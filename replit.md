# Gestor de Tareas Accesible

## Overview
Aplicación de gestión de tareas con enfoque en accesibilidad natural mediante HTML semántico. Diseñada para ser completamente accesible con lectores de pantalla y navegación por teclado, sin uso excesivo de ARIA.

## Recent Changes
- **2025-11-08**: Implementación completa del gestor de tareas accesible con todas las características avanzadas
  - **MVP Inicial**: Esquema de datos, backend API REST, sidebar, componentes de tareas, formularios accesibles, prioridades, búsqueda global
  - **Filtros de tareas**: Todas/Completadas/Pendientes con anuncios de estado para lectores de pantalla
  - **Fechas de vencimiento**: Selector de fecha HTML5, indicadores visuales (rojo=vencido, ámbar=hoy, gris=futuro), corrección de bug de zona horaria
  - **Atajos de teclado**: N (nueva tarea), L (nueva lista), ? (ayuda), Escape (cerrar), modal de ayuda accesible
  - **Mejoras de UX**: 
    - Botón "+ Añadir tarea" que revela el formulario (interfaz minimalista)
    - Selector de prioridad integrado en formularios de añadir/editar tarea
    - Diálogos simplificados (solo botón X para cerrar)
    - Sidebar siempre visible (toggle eliminado por no ser útil para lectores de pantalla)
  - Navegación completa por teclado con group-focus-within
  - Diseño limpio con fuente Inter y contraste WCAG AA
  - Todas las pruebas end-to-end pasadas exitosamente

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
- Crear, editar, eliminar tareas con formularios accesibles
- Organizar tareas en listas personalizables con colores
- Sistema de prioridades (ninguna, baja, media, alta) con indicadores visuales
- Marcar tareas como completadas/pendientes
- **Filtros**: Mostrar todas/completadas/pendientes
- **Fechas de vencimiento**: Con indicadores de estado (vencido, hoy, futuro)
- **Búsqueda global** en tiempo real
- **Atajos de teclado**: N, L, ?, Escape con ayuda visual
- Navegación completa por teclado (Tab, Enter, Space, Escape)
- Completamente accesible con lectores de pantalla
- HTML semántico, uso mínimo de ARIA
