import type { Task } from "@shared/schema";

// Almacenamos el timestamp del recordatorio que ya notificamos por cada tarea
// Clave: task.id, Valor: timestamp del recordatorio que ya se disparó
const notifiedReminders = new Map<string, number>();

// Intervalo de verificación (1 minuto)
const CHECK_INTERVAL_MS = 60 * 1000;

// Ventana de catch-up: 5 minutos para notificaciones perdidas
const CATCH_UP_WINDOW_MS = 5 * 60 * 1000;

// ID del intervalo activo
let activeInterval: number | null = null;

// Función para obtener tareas (se setea desde fuera)
let getTasksFn: (() => Task[]) | null = null;

/**
 * Solicita permisos de notificación al usuario
 * @returns Promise que resuelve en true si se obtuvieron permisos, false en caso contrario
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("Este navegador no soporta notificaciones de escritorio");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  console.log("Permisos de notificación no otorgados. Estado:", Notification.permission);
  return false;
}

/**
 * Muestra una notificación para una tarea y registra el recordatorio como notificado
 * @param task La tarea para la que mostrar la notificación
 * @param reminderTime El timestamp del recordatorio que se está disparando
 */
function showTaskNotification(task: Task, reminderTime: number): void {
  const title = "Recordatorio de tarea";
  const body = task.title;
  const options: NotificationOptions = {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: `task-${task.id}`,
    requireInteraction: false,
  };

  try {
    const notification = new Notification(title, options);
    
    // Registrar que notificamos este recordatorio específico
    notifiedReminders.set(task.id, reminderTime);

    // Enfocar la ventana cuando hagan click en la notificación
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error("Error mostrando notificación:", error);
  }
}

/**
 * Verifica y procesa recordatorios que deben mostrarse
 */
function checkAndNotifyReminders(): void {
  if (!getTasksFn || Notification.permission !== "granted") {
    return;
  }

  const tasks = getTasksFn();
  const now = Date.now();

  tasks.forEach((task) => {
    // Ignorar tareas completadas
    if (task.completed) return;

    // Ignorar tareas sin fecha de vencimiento o sin recordatorio
    if (!task.dueDate || !task.reminderMinutes) return;

    const dueDate = new Date(task.dueDate);
    const reminderTime = dueDate.getTime() - task.reminderMinutes * 60 * 1000;

    // Verificar si ya notificamos este recordatorio específico
    const lastNotifiedReminderTime = notifiedReminders.get(task.id);
    if (lastNotifiedReminderTime === reminderTime) {
      // Ya notificamos este recordatorio exacto, no volver a disparar
      return;
    }

    // Calcular cuánto tiempo ha pasado desde el momento del recordatorio
    const timeSinceReminder = now - reminderTime;

    // Ventana de notificación: disparar si el recordatorio está entre:
    // - 0 segundos (justo ahora) y CATCH_UP_WINDOW_MS (ventana de catch-up)
    // Esto permite recuperar notificaciones perdidas (ej: pestaña suspendida)
    // Pero cada recordatorio específico solo se dispara UNA vez gracias al registro persistente
    if (timeSinceReminder >= 0 && timeSinceReminder < CATCH_UP_WINDOW_MS) {
      showTaskNotification(task, reminderTime);
    }
  });
}

/**
 * Maneja cuando la página se vuelve visible
 */
function handleVisibilityChange(): void {
  if (document.visibilityState === "visible") {
    // Cuando la página vuelve a estar visible, verificar inmediatamente
    checkAndNotifyReminders();
  }
}

/**
 * Inicia el servicio de notificaciones
 * @param getTasks Función que devuelve la lista de tareas
 */
export function startNotificationService(getTasks: () => Task[]): void {
  // Verificar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    return;
  }

  // Guardar la función para obtener tareas
  getTasksFn = getTasks;

  // Verificar inmediatamente
  checkAndNotifyReminders();

  // Configurar intervalo de verificación
  if (activeInterval !== null) {
    window.clearInterval(activeInterval);
  }
  activeInterval = window.setInterval(checkAndNotifyReminders, CHECK_INTERVAL_MS);

  // Escuchar cambios de visibilidad
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

/**
 * Detiene el servicio de notificaciones
 */
export function stopNotificationService(): void {
  if (activeInterval !== null) {
    window.clearInterval(activeInterval);
    activeInterval = null;
  }
  
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  getTasksFn = null;
}

/**
 * Actualiza el scheduler cuando cambian las tareas
 * Llama a esta función después de crear, editar o eliminar tareas
 */
export function updateNotificationSchedule(): void {
  // Limpiar recordatorios notificados de tareas que ya no existen o cambiaron
  if (getTasksFn) {
    const tasks = getTasksFn();
    const existingTaskIds = new Set(tasks.map(t => t.id));
    
    // Limpiar recordatorios de tareas que ya no existen
    Array.from(notifiedReminders.keys()).forEach(taskId => {
      if (!existingTaskIds.has(taskId)) {
        notifiedReminders.delete(taskId);
      }
    });
    
    // Limpiar recordatorios si la tarea cambió su recordatorio
    tasks.forEach(task => {
      if (!task.dueDate || !task.reminderMinutes) {
        // Si la tarea ya no tiene recordatorio, limpiar
        notifiedReminders.delete(task.id);
        return;
      }
      
      const dueDate = new Date(task.dueDate);
      const currentReminderTime = dueDate.getTime() - task.reminderMinutes * 60 * 1000;
      const notifiedReminderTime = notifiedReminders.get(task.id);
      
      // Si el recordatorio cambió, limpiar el registro
      if (notifiedReminderTime && notifiedReminderTime !== currentReminderTime) {
        notifiedReminders.delete(task.id);
      }
    });
  }
  
  // Verificar inmediatamente
  checkAndNotifyReminders();
}
