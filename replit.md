# Gestor de Tareas Accesible

## Overview
Aplicación de gestión de tareas con enfoque en accesibilidad natural mediante HTML semántico. Diseñada para ser completamente accesible con lectores de pantalla y navegación por teclado, sin uso excesivo de ARIA.

## Recent Changes
- **2025-01-08**: Implementación completa del gestor de tareas accesible
  - Esquema de datos para tareas y listas
  - Backend con API REST completa y almacenamiento en memoria
  - Sidebar con navegación de listas y contadores de tareas
  - Componentes de tareas con checkboxes nativos y acciones accesibles
  - Formularios completamente accesibles con labels apropiados (sr-only cuando necesario)
  - Sistema de prioridades visuales (0-3) con indicadores de borde de color
  - Búsqueda global de tareas en tiempo real
  - Navegación completa por teclado con group-focus-within
  - Diálogos modales para editar tareas y crear listas
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
- **Tasks**: id, title, description, completed, priority (0-3), listId
- **Lists**: id, name, color

## User Preferences
- **Accesibilidad**: Prioridad en HTML semántico, uso mínimo de ARIA
- **Diseño**: Limpio, eficiente, inspirado en Linear y Todoist
- **Navegación**: Completa por teclado sin mouse

## Key Features
- Crear, editar, eliminar tareas
- Organizar tareas en listas personalizables
- Sistema de prioridades (ninguna, baja, media, alta)
- Marcar tareas como completadas
- Navegación completa por teclado
- Accesible con lectores de pantalla
