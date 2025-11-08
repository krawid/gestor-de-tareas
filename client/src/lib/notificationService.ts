import type { Task } from "@shared/schema";

// Almacenamos las notificaciones ya mostradas para no repetirlas
const shownNotifications = new Set<string>();

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

  return false;
}

/**
 * Muestra una notificación para una tarea
 * @param task La tarea para la que mostrar la notificación
 */
function showTaskNotification(task: Task): void {
  const notificationId = `${task.id}-${task.reminderMinutes}`;
  
  // Si ya mostramos esta notificación, no la mostramos de nuevo
  if (shownNotifications.has(notificationId)) {
    return;
  }

  const title = "Recordatorio de tarea";
  const body = task.title;
  const options: NotificationOptions = {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: notificationId,
    requireInteraction: false,
  };

  try {
    const notification = new Notification(title, options);
    
    // Marcar como mostrada
    shownNotifications.add(notificationId);

    // Enfocar la ventana cuando hagan click en la notificación
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Limpiar del set después de 1 hora para permitir re-notificar si fuera necesario
    setTimeout(() => {
      shownNotifications.delete(notificationId);
    }, 60 * 60 * 1000);
  } catch (error) {
    console.error("Error mostrando notificación:", error);
  }
}

/**
 * Verifica las tareas y muestra notificaciones si es necesario
 * @param tasks Lista de tareas a verificar
 */
export function checkTasksForNotifications(tasks: Task[]): void {
  if (!("Notification" in window)) {
    console.log("Notificaciones no soportadas");
    return;
  }

  if (Notification.permission !== "granted") {
    console.log("Permisos de notificación no otorgados. Estado:", Notification.permission);
    return;
  }

  const now = new Date();
  console.log("Verificando notificaciones. Hora actual:", now.toLocaleString());

  tasks.forEach((task) => {
    // Ignorar tareas completadas
    if (task.completed) {
      return;
    }

    // Ignorar tareas sin fecha de vencimiento o sin recordatorio
    if (!task.dueDate || !task.reminderMinutes) {
      return;
    }

    const dueDate = new Date(task.dueDate);
    const reminderTime = new Date(dueDate.getTime() - task.reminderMinutes * 60 * 1000);

    console.log(`Tarea: "${task.title}"`, {
      dueDate: dueDate.toLocaleString(),
      reminderMinutes: task.reminderMinutes,
      reminderTime: reminderTime.toLocaleString(),
      now: now.toLocaleString(),
    });

    // Si ya pasó el tiempo del recordatorio y estamos dentro de una ventana de 5 minutos
    const timeDiff = now.getTime() - reminderTime.getTime();
    console.log(`  Diferencia de tiempo: ${timeDiff}ms (${Math.round(timeDiff / 1000)}s)`);
    
    if (timeDiff >= 0 && timeDiff <= 5 * 60 * 1000) {
      console.log(`  ¡Mostrando notificación para "${task.title}"!`);
      showTaskNotification(task);
    } else if (timeDiff < 0) {
      console.log(`  Recordatorio en ${Math.round(-timeDiff / 1000)}s`);
    } else {
      console.log(`  Recordatorio ya pasó hace ${Math.round(timeDiff / 1000)}s`);
    }
  });
}

let checkInterval: number | null = null;

/**
 * Inicia el servicio de notificaciones
 * Verifica las tareas cada minuto para mostrar notificaciones
 * @param getTasks Función que devuelve la lista de tareas
 */
export function startNotificationService(getTasks: () => Task[]): void {
  // Verificar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    return;
  }

  // Si ya está corriendo, no iniciar de nuevo
  if (checkInterval !== null) {
    return;
  }

  // Verificar inmediatamente
  checkTasksForNotifications(getTasks());

  // Verificar cada minuto
  checkInterval = window.setInterval(() => {
    checkTasksForNotifications(getTasks());
  }, 60 * 1000);
}

/**
 * Detiene el servicio de notificaciones
 */
export function stopNotificationService(): void {
  if (checkInterval !== null) {
    window.clearInterval(checkInterval);
    checkInterval = null;
  }
}
