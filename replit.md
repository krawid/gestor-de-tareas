# Gestor de Tareas Accesible

## Overview
Aplicación de gestión de tareas con enfoque en accesibilidad natural mediante HTML semántico. Diseñada para ser completamente accesible con lectores de pantalla y navegación por teclado, sin uso excesivo de ARIA.

## Recent Changes
- **2025-11-09**: Refactorización mayor de fecha/hora, persistencia y notificaciones
  - **HTML semántico**: Corregido elemento `<main>` duplicado (SidebarInset ya usa `<main>`, App.tsx cambió a `<div>`)
  - **Persistencia con PostgreSQL**:
    - Migrado de almacenamiento en memoria (MemStorage) a base de datos PostgreSQL
    - Implementación con Drizzle ORM (@neondatabase/serverless)
    - Fallback automático a MemStorage si DATABASE_URL no está disponible
    - Datos persisten entre sesiones y dispositivos
  - **Selectores de fecha/hora accesibles** (estilo GOV.UK):
    - Componente `DateTimePicker` con selectores separados para día, mes (nombres localizados), año
    - Checkbox "Añadir hora específica" que muestra selectores de hora y minuto
    - IDs únicos por instancia usando React `useId()` para evitar duplicados
    - Totalmente accesible con NVDA (Chrome/Windows) y VoiceOver (Safari/iPhone)
    - Eliminados inputs type="date" y type="time" problemáticos con lectores de pantalla
  - **Sistema de notificaciones mejorado**:
    - Reemplazado polling (setInterval cada 60s) por scheduler preciso con setTimeout
    - Calcula timestamp exacto del próximo recordatorio y programa alarma al milisegundo
    - Page Visibility API detecta cuando la página vuelve a estar visible y reactiva timers
    - Catch-up inmediato de notificaciones vencidas (ventana de 90 segundos solo para catch-up, no para futuras)
    - Deduplicación usando `lastNotifiedAt` Map por tarea (evita notificaciones repetidas)
    - Función `updateNotificationSchedule()` se llama después de cada mutación (crear/editar/eliminar tarea)
    - Banner contextual cuando hay tareas con recordatorios pero permisos bloqueados
  - **Limpieza de código**:
    - Eliminadas importaciones innecesarias (X de lucide-react en add-task-dialog)
    - TypeScript types mejorados para evitar undefined en DateTimePicker
  - **Formato de fecha corregido**:
    - Función formatDueDate ahora detecta si la fecha tiene hora específica
    - Muestra "d de MMMM, HH:mm" cuando hay hora (ej: "15 de diciembre, 14:30")
    - Muestra solo "d de MMMM" cuando no hay hora (ej: "15 de diciembre")
- **2025-11-08 (tarde)**: Mejoras de accesibilidad en selectores de fecha/hora
  - **Campos separados**: Separación de datetime-local en dos inputs independientes para VoiceOver
    - Input type="date" etiquetado como "Fecha de vencimiento"
    - Input type="time" etiquetado como "Hora de vencimiento" (solo visible cuando hay fecha)
    - Mensaje explicativo: "Opcional. Si no especificas hora, será medianoche (00:00)"
  - **Implementación técnica**:
    - Valores derivados directamente de field.value (sin estado local desincronizado)
    - Formateo manual con getFullYear()/getMonth()+1/getDate() (sin conversión UTC)
    - Construcción de Date con new Date(year, month-1, day, hours, minutes) en zona horaria local
    - Garantiza sincronización correcta después de form.reset() y entre diferentes tareas
  - **Sistema de recordatorios**: Implementado usando Web Notifications API
    - Campo reminderMinutes en schema de tareas (entero nullable, minutos antes de dueDate)
    - Selector de recordatorio: sin recordatorio, 15min, 30min, 1h, 3h, 6h, 12h, 24h antes
    - Verifica tareas cada minuto para mostrar notificaciones en el momento apropiado
    - Deduplica notificaciones para evitar repeticiones
    - Solicita permisos automáticamente cuando hay tareas con recordatorios
    - Degrada gracefully en navegadores sin soporte para Notifications API
    - Selector deshabilitado si no hay fecha de vencimiento, con mensaje explicativo
- **2025-11-08 (mañana)**: Refactorización mayor para mejorar accesibilidad y claridad
  - **Jerarquía de encabezados**:
    - h1 "Gestor de tareas" como encabezado principal en sidebar
    - h2 "Mis Tareas" en sidebar (navegable con H/Shift+H en NVDA)
    - h2 "Listas" en sidebar (navegable con H/Shift+H en NVDA)
    - Vista "Todas las tareas": h2 "Tareas pendientes" y h2 "Tareas completadas" en área principal
    - Vista filtrada o de lista: h2 contextual descriptivo en área principal
  - **Filtros en sidebar**:
    - Filtros movidos a sidebar bajo "Mis Tareas"
    - Tres botones: "Todas las tareas", "Pendientes", "Completadas"
    - Selector de filtros eliminado del header principal
  - **Correcciones para VoiceOver (iPhone)**:
    - Sidebar siempre visible (collapsible="none") en móvil y desktop para garantizar accesibilidad
    - Reemplazado confirm() nativo con AlertDialog de Radix UI para confirmación de eliminación
    - Eliminados aria-describedby innecesarios de DialogContent (mantenidos solo en formularios)
    - Selectores de fecha usan onBlur en lugar de onChange para evitar establecer fecha automáticamente al navegar
  - **Formularios modales**: 
    - Añadir tarea ahora es un diálogo modal (evita mezcla con tareas existentes)
    - Selector de lista integrado en formularios de crear/editar tarea (select nativo)
    - Asignación explícita de lista en lugar de automática por contexto
    - Modal de editar: eliminado botón "Cancelar" duplicado (DialogContent incluye botón X)
  - **Mejoras de accesibilidad**:
    - Toast notifications con región aria-live separada (solución a bug Radix UI #3634)
    - Región sr-only siempre presente para que NVDA la registre al cargar la página
    - Notificaciones descriptivas: "Tarea marcada como completada/pendiente" en lugar de mensaje genérico
    - aria-pressed en botones de filtro/lista (VoiceOver requiere aria-pressed en botones, no aria-current)
    - Grupos de botones con role="group" y aria-label descriptivo
    - Jerarquía de encabezados coherente en todas las vistas
    - Sidebar siempre visible (toggle eliminado por no ser útil para lectores de pantalla)
  - **Fechas de vencimiento**: Selector HTML5, indicadores visuales, manejo correcto de zona horaria
  - **Atajos de teclado**: N (nueva tarea), L (nueva lista), ? (ayuda), Escape (cerrar)
  - **Sistema de listas**: 
    - Listas puramente para filtrar vista (no auto-asignan tareas)
    - Selector "Asignar a lista" en formularios con opción "Sin lista"
    - Selectores nativos HTML en lugar de componentes custom
    - Botón de eliminar lista junto a cada lista en sidebar con confirmación

## Architecture

### Frontend
- React + TypeScript con Wouter para enrutamiento
- Shadcn UI para componentes accesibles por defecto
- TanStack Query para gestión de estado
- HTML semántico: `<main>`, `<nav>`, `<form>`, `<label>`, `<button>`
- Navegación completa por teclado (Tab, Enter, Escape)

### Backend
- Express.js con base de datos PostgreSQL
- Drizzle ORM para gestión de base de datos (@neondatabase/serverless)
- Fallback a MemStorage si DATABASE_URL no está disponible
- API RESTful para CRUD de tareas y listas
- Validación con Zod

### Data Model
- **Tasks**: id, title, description, completed, priority (0-3), listId, dueDate (timestamp), reminderMinutes (integer nullable)
- **Lists**: id, name, color

## User Preferences
- **Accesibilidad**: Prioridad en HTML semántico, uso mínimo de ARIA
- **Diseño**: Limpio, eficiente, inspirado en Linear y Todoist
- **Navegación**: Completa por teclado sin mouse

## Key Features
- **Gestión de tareas**:
  - Crear tareas mediante diálogo modal con campos: título, descripción, lista, prioridad, fecha, recordatorio
  - Editar y eliminar tareas existentes
  - Marcar tareas como completadas/pendientes
  - Sistema de prioridades (ninguna, baja, media, alta)
  - Recordatorios con notificaciones del navegador (15min a 24h antes de fecha de vencimiento)
- **Listas personalizables**:
  - Crear listas con nombre y color
  - Eliminar listas (botón junto a cada lista en sidebar)
  - Filtrar vista por lista (sidebar)
  - Asignar tareas a listas explícitamente en formularios
  - Opción "Sin lista" disponible
- **Filtros y búsqueda**:
  - Filtros: Todas/Completadas/Pendientes
  - Búsqueda global en tiempo real por título y descripción
  - Encabezado descriptivo indica vista activa
- **Fechas de vencimiento**: 
  - Selectores segmentados accesibles (día, mes, año, hora, minuto)
  - Checkbox opcional "Añadir hora específica"
  - Indicadores visuales de estado (vencido, hoy, futuro)
  - Compatible con NVDA y VoiceOver
- **Atajos de teclado**: N (nueva tarea), L (nueva lista), ? (ayuda), Escape (cerrar)
- **Accesibilidad total**:
  - HTML semántico (h1, h2, nav, main, form, label), uso mínimo de ARIA
  - Navegación completa por teclado
  - aria-current en elementos activos
  - Notificaciones toast con región aria-live dedicada para NVDA
  - Mensajes descriptivos y contextuales en todas las acciones
  - Completamente accesible con lectores de pantalla
  - Probado con NVDA (Chrome/Windows) y VoiceOver (Safari/iPhone)
