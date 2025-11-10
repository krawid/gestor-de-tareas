import type { Task } from "@shared/schema";

// Almacenamos el timestamp de la última notificación mostrada por tarea
const lastNotifiedAt = new Map<string, number>();

// Intervalo de verificación (1 minuto)
const CHECK_INTERVAL_MS = 60 * 1000;

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
 * Muestra una notificación para una tarea
 * @param task La tarea para la que mostrar la notificación
 */
function showTaskNotification(task: Task): void {
  const now = Date.now();
  const lastNotified = lastNotifiedAt.get(task.id);
  
  // Si ya notificamos esta tarea en los últimos 2 minutos, no notificar de nuevo
  if (lastNotified && (now - lastNotified) < 2 * 60 * 1000) {
    return;
  }

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
    
    // Registrar que notificamos esta tarea
    lastNotifiedAt.set(task.id, now);

    // Enfocar la ventana cuando hagan click en la notificación
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Limpiar del map después de 5 minutos
    setTimeout(() => {
      lastNotifiedAt.delete(task.id);
    }, 5 * 60 * 1000);
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

    // Ventana de notificación: entre 90 segundos antes y ahora
    // Esto permite catch-up de notificaciones perdidas sin ser demasiado agresivo
    const notificationWindow = 90 * 1000; // 90 segundos
    const timeSinceReminder = now - reminderTime;

    // Si el recordatorio ya pasó pero está dentro de la ventana de catch-up
    if (timeSinceReminder >= 0 && timeSinceReminder <= notificationWindow) {
      showTaskNotification(task);
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
  // Con el sistema de polling, solo verificamos inmediatamente
  checkAndNotifyReminders();
}
