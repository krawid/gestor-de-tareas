# Gestor de Tareas Accesible

## Overview
El Gestor de Tareas Accesible es una aplicación de gestión de tareas diseñada con un enfoque principal en la accesibilidad natural mediante el uso de HTML semántico. Su propósito es proporcionar una experiencia de usuario fluida y completamente accesible para personas que utilizan lectores de pantalla y navegación por teclado, minimizando la dependencia de atributos ARIA complejos. El proyecto busca ser una solución robusta y fácil de usar para la organización personal de tareas, destacando por su compromiso con los estándares de accesibilidad web.

## User Preferences
- **Accesibilidad**: Prioridad en HTML semántico, uso mínimo de ARIA
- **Diseño**: Limpio, eficiente, inspirado en Linear y Todoist
- **Navegación**: Completa por teclado sin mouse

## System Architecture

### UI/UX Decisions
- **Diseño limpio y eficiente**: Inspirado en la estética de Linear y Todoist.
- **Componentes accesibles por defecto**: Utiliza Shadcn UI para garantizar la accesibilidad de los componentes.
- **HTML Semántico**: Empleo de etiquetas HTML nativas como `<main>`, `<nav>`, `<form>`, `<label>`, `<button>` para una estructura clara y accesible.
- **Navegación por teclado**: Soporte completo para navegación mediante Tab, Enter y Escape.
- **Jerarquía de encabezados coherente**: Uso de `h1`, `h2` para estructurar el contenido de forma lógica y navegable por lectores de pantalla.
- **Diálogos modales nativos**: Migración completa a elementos `<dialog>` HTML nativos (NativeDialog) con gestión explícita de foco:
  - Guarda el elemento enfocado antes de abrir
  - Enfoca automáticamente el primer campo interactivo al abrir
  - Restaura el foco al elemento anterior al cerrar (vía Escape, backdrop, o botón)
  - Sincronización correcta de estado para evitar llamadas duplicadas a callbacks
  - **Focus trap estricto**: El foco queda completamente encerrado en el modal, Tab/Shift+Tab nunca pueden escapar a la barra de direcciones u otros controles del navegador
- **Inputs nativos 100%**: Todos los componentes de formulario son HTML estándar:
  - `<input>`, `<textarea>`, `<select>` nativos
  - NativeCheckbox: `<input type="checkbox">` con API compatible con Radix
- **Consistencia en formularios**: Todos los diálogos de tareas siguen el mismo orden y etiquetado:
  1. Título
  2. Descripción (opcional)
  3. Asignar a lista
  4. Prioridad
  5. Fecha/hora de vencimiento
- **Notificaciones**: Toast notifications con región `aria-live` dedicada para una correcta vocalización por lectores de pantalla.
- **Siempre visible sidebar**: La barra lateral es siempre visible (no colapsable) para mejorar la accesibilidad, eliminando la necesidad de un toggle.

### Technical Implementations
- **Frontend**: Desarrollado con React y TypeScript, utilizando Wouter para el enrutamiento.
- **Gestión de estado**: TanStack Query para la gestión eficiente del estado de la aplicación.
- **Backend**: Implementado con Express.js.
- **Base de datos**: PostgreSQL para persistencia de datos.
- **ORM**: Drizzle ORM (@neondatabase/serverless) para la interacción con la base de datos.
- **Fallback de almacenamiento**: Un mecanismo de fallback a MemStorage si la variable de entorno `DATABASE_URL` no está disponible.
- **API RESTful**: Para operaciones CRUD de tareas y listas.
- **Validación**: Zod para la validación de esquemas de datos.
- **Manejo de fechas/horas**: Selectores de fecha y hora accesibles y segmentados, compatibles con NVDA y VoiceOver, que evitan los problemáticos inputs `type="date"` y `type="time"`.
- **Markdown en descripciones**: Uso de `react-markdown` para renderizar descripciones de listas con formato Markdown.
- **Atajos de teclado globales**: Implementación de `useKeyboardShortcuts` para atajos como N (nueva tarea), L (nueva lista), ? (ayuda) y Escape (cerrar).

### Feature Specifications
- **Gestión de tareas**: Creación, edición, eliminación y marcado de tareas como completadas/pendientes. Incluye campos para título, descripción, lista, prioridad y fecha/hora de vencimiento.
- **Listas personalizables**: Creación, edición y eliminación de listas con nombre, color y una descripción opcional en Markdown.
- **Filtros y búsqueda**: Filtros predefinidos (Todas, Pendientes, Completadas) y búsqueda global en tiempo real por título y descripción de tareas.
- **Fechas de vencimiento**: Gestión de fechas de vencimiento con opciones para añadir o no fecha y hora específicas, indicadores visuales de estado y ordenamiento automático de tareas.
- **Accesibilidad total**: Cumplimiento estricto de principios de accesibilidad, incluyendo navegación por teclado, semántica HTML, uso mínimo de ARIA y pruebas con lectores de pantalla (NVDA, VoiceOver).

### System Design Choices
- **Priorización de componentes nativos**: Preferencia estricta por elementos HTML nativos (`<dialog>`, `<input>`, `<select>`, `<textarea>`, `<input type="checkbox">`) sobre componentes abstractos (ej. Radix UI) para evitar interferencias con la accesibilidad de lectores de pantalla.
- **Gestión de foco robusta en NativeDialog**: Implementación con ref `isClosingProgrammatically` para distinguir cierres programáticos de cierres iniciados por usuario, evitando callbacks duplicados y garantizando restauración confiable del foco. Incluye focus trap estricto mediante event listeners de `keydown` y `focusin` que interceptan Tab/Shift+Tab y previenen escape a controles del navegador, manteniendo el foco completamente encerrado dentro del modal.
- **Separación de responsabilidades**: Componentes de formulario desacoplados del manejo de estado (`react-hook-form` Controller) para mayor flexibilidad.
- **Normalización de datos**: Backend normaliza descripciones vacías a `undefined` para que Drizzle ORM las convierta a `NULL` en la base de datos.
- **Ordenamiento automático**: Las tareas se ordenan automáticamente por fecha/hora de vencimiento, con las tareas sin fecha al final.

## External Dependencies
- **React**: Biblioteca JavaScript para construir interfaces de usuario.
- **TypeScript**: Superset de JavaScript que añade tipado estático.
- **Wouter**: Pequeña librería para enrutamiento en React.
- **Shadcn UI**: Colección de componentes UI accesibles.
- **TanStack Query**: Para la gestión de caché y estado asíncrono.
- **Express.js**: Framework de backend para Node.js.
- **PostgreSQL**: Sistema de gestión de bases de datos relacionales.
- **Drizzle ORM (@neondatabase/serverless)**: ORM moderno para TypeScript.
- **Zod**: Librería de validación de esquemas.
- **react-markdown**: Para renderizar contenido Markdown de forma segura.
- **Tailwind CSS**: Framework CSS para estilos.