import type { Task } from "@shared/schema";

// Almacenamos el timestamp de la última notificación mostrada por tarea
const lastNotifiedAt = new Map<string, number>();

// Timer activo
let activeTimer: number | null = null;

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
 * Calcula el próximo recordatorio que debe activarse
 * @param tasks Lista de tareas
 * @returns El timestamp del próximo recordatorio, o null si no hay ninguno
 */
function getNextReminderTime(tasks: Task[]): { time: number; task: Task } | null {
  const now = Date.now();
  let nextReminder: { time: number; task: Task } | null = null;

  tasks.forEach((task) => {
    // Ignorar tareas completadas
    if (task.completed) return;

    // Ignorar tareas sin fecha de vencimiento o sin recordatorio
    if (!task.dueDate || !task.reminderMinutes) return;

    const dueDate = new Date(task.dueDate);
    const reminderTime = dueDate.getTime() - task.reminderMinutes * 60 * 1000;

    // Ignorar recordatorios que ya pasaron hace más de 90 segundos
    if (reminderTime < now - 90 * 1000) return;

    // Si el recordatorio es futuro o reciente (últimos 90 segundos)
    if (!nextReminder || reminderTime < nextReminder.time) {
      nextReminder = { time: reminderTime, task };
    }
  });

  return nextReminder;
}

/**
 * Programa el próximo recordatorio
 */
function scheduleNextReminder(): void {
  // Cancelar timer activo si existe
  if (activeTimer !== null) {
    window.clearTimeout(activeTimer);
    activeTimer = null;
  }

  if (!getTasksFn) return;

  const tasks = getTasksFn();
  const nextReminder = getNextReminderTime(tasks);

  if (!nextReminder) return;

  const now = Date.now();
  const timeUntilReminder = nextReminder.time - now;

  // Solo disparar notificaciones que ya vencieron (catch-up)
  // NO disparar notificaciones futuras, incluso si están dentro de 90 segundos
  if (timeUntilReminder <= 0 && Notification.permission === "granted") {
    showTaskNotification(nextReminder.task);
  }

  // Si el recordatorio es futuro, programar un setTimeout
  if (timeUntilReminder > 0) {
    activeTimer = window.setTimeout(() => {
      if (Notification.permission === "granted") {
        showTaskNotification(nextReminder.task);
      }
      // Programar el siguiente
      scheduleNextReminder();
    }, timeUntilReminder);
  } else {
    // Si ya pasó, programar el siguiente inmediatamente
    scheduleNextReminder();
  }
}

/**
 * Maneja cuando la página se vuelve visible
 */
function handleVisibilityChange(): void {
  if (document.visibilityState === "visible") {
    // Cuando la página vuelve a estar visible, reprogramar
    scheduleNextReminder();
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

  // Programar el primer recordatorio
  scheduleNextReminder();

  // Escuchar cambios de visibilidad
  document.addEventListener("visibilitychange", handleVisibilityChange);
}

/**
 * Detiene el servicio de notificaciones
 */
export function stopNotificationService(): void {
  if (activeTimer !== null) {
    window.clearTimeout(activeTimer);
    activeTimer = null;
  }
  
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  getTasksFn = null;
}

/**
 * Actualiza el scheduler cuando cambian las tareas
 * Llama a esta función después de crear, editar o eliminar tareas
 */
export function updateNotificationSchedule(): void {
  scheduleNextReminder();
}
