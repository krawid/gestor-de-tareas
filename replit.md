# Gestor de Tareas Accesible

## Overview
Aplicación de gestión de tareas con enfoque en accesibilidad natural mediante HTML semántico. Diseñada para ser completamente accesible con lectores de pantalla y navegación por teclado, sin uso excesivo de ARIA.

## Recent Changes
- **2025-11-08**: Refactorización mayor para mejorar accesibilidad y claridad
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
    - Añadido SidebarTrigger en header para acceso al sidebar en móviles
    - Reemplazado confirm() nativo con AlertDialog de Radix UI para confirmación de eliminación
    - Eliminados aria-describedby innecesarios de DialogContent (mantenidos solo en formularios)
  - **Formularios modales**: 
    - Añadir tarea ahora es un diálogo modal (evita mezcla con tareas existentes)
    - Selector de lista integrado en formularios de crear/editar tarea (select nativo)
    - Asignación explícita de lista en lugar de automática por contexto
    - Modal de editar: eliminado botón "Cancelar" duplicado (DialogContent incluye botón X)
  - **Mejoras de accesibilidad**:
    - Toast notifications con región aria-live separada (solución a bug Radix UI #3634)
    - Región sr-only siempre presente para que NVDA la registre al cargar la página
    - Notificaciones descriptivas: "Tarea marcada como completada/pendiente" en lugar de mensaje genérico
    - aria-current="page" en botones de lista activos en sidebar
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
- Express.js con almacenamiento en memoria
- API RESTful para CRUD de tareas y listas
- Validación con Zod

### Data Model
- **Tasks**: id, title, description, completed, priority (0-3), listId, dueDate (timestamp)
- **Lists**: id, name, color

## User Preferences
- **Accesibilidad**: Prioridad en HTML semántico, uso mínimo de ARIA
- **Diseño**: Limpio, eficiente, inspirado en Linear y Todoist
- **Navegación**: Completa por teclado sin mouse

## Key Features
- **Gestión de tareas**:
  - Crear tareas mediante diálogo modal con campos: título, descripción, lista, prioridad, fecha
  - Editar y eliminar tareas existentes
  - Marcar tareas como completadas/pendientes
  - Sistema de prioridades (ninguna, baja, media, alta)
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
- **Fechas de vencimiento**: Con indicadores de estado (vencido, hoy, futuro)
- **Atajos de teclado**: N (nueva tarea), L (nueva lista), ? (ayuda), Escape (cerrar)
- **Accesibilidad total**:
  - HTML semántico (h1, h2, nav, main, form, label), uso mínimo de ARIA
  - Navegación completa por teclado
  - aria-current en elementos activos
  - Notificaciones toast con región aria-live dedicada para NVDA
  - Mensajes descriptivos y contextuales en todas las acciones
  - Completamente accesible con lectores de pantalla (probado con NVDA en Chrome/Windows)
