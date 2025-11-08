# Gestor de Tareas Accesible

## Overview
Aplicación de gestión de tareas con enfoque en accesibilidad natural mediante HTML semántico. Diseñada para ser completamente accesible con lectores de pantalla y navegación por teclado, sin uso excesivo de ARIA.

## Recent Changes
- **2025-01-08**: Implementación inicial del frontend con componentes accesibles
  - Esquema de datos para tareas y listas
  - Sidebar con navegación de listas
  - Componentes de tareas con checkboxes nativos
  - Formularios completamente accesibles con labels apropiados
  - Sistema de prioridades visuales y textuales
  - Diseño limpio con fuente Inter y contraste WCAG AA

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
