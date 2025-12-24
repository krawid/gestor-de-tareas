# Changelog

## [Unreleased] - 2024-12-24

### Changed
- **Fechas de tareas**: Reemplazado el campo único "Fecha de vencimiento" por dos campos separados:
  - **Fecha de inicio**: Permite establecer cuándo comienza una tarea
  - **Fecha de fin**: Permite establecer cuándo termina una tarea
- La casilla "Añadir fecha de vencimiento" ahora se llama "Añadir fecha"
- Ambas fechas son opcionales y pueden incluir hora específica
- El ordenamiento de tareas ahora se basa en la fecha de fin
- Las alertas de vencimiento (vencida/hoy) se basan en la fecha de fin

### Added
- Nuevo componente `DateRangePicker` para seleccionar fechas de inicio y fin
- Script de migración SQL para actualizar bases de datos existentes
- Documentación de migración en `migrations/README.md`

### Technical Changes
- **Schema**: Columnas `start_date` y `end_date` reemplazan a `due_date`
- **Componentes actualizados**:
  - `add-task-dialog.tsx`: Usa `DateRangePicker`
  - `edit-task-dialog.tsx`: Usa `DateRangePicker`
  - `task-item.tsx`: Muestra ambas fechas
  - `home.tsx`: Ordenamiento basado en `endDate`
- **Storage**: Actualizado para manejar `startDate` y `endDate`

### Migration
Para usuarios con datos existentes, ejecutar:
```bash
psql $DATABASE_URL -f migrations/001_add_start_end_dates.sql
```

Los datos de `due_date` se migrarán automáticamente a `end_date`.
