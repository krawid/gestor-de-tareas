# Migraciones de Base de Datos

## Aplicar Migración Manual

Si ya tienes una base de datos PostgreSQL con datos existentes, ejecuta este comando para aplicar la migración:

```bash
psql $DATABASE_URL -f migrations/001_add_start_end_dates.sql
```

O si estás usando la interfaz de PostgreSQL:

```sql
-- Copia y pega el contenido de 001_add_start_end_dates.sql
```

## Nueva Instalación

Si estás creando la base de datos desde cero, simplemente ejecuta:

```bash
npm run db:push
```

Esto creará las tablas con el esquema actualizado automáticamente.

## Cambios en esta Migración

- **Añadido**: Columna `start_date` (fecha de inicio de la tarea)
- **Añadido**: Columna `end_date` (fecha de fin de la tarea)
- **Migrado**: Los datos de `due_date` se copian a `end_date`
- **Eliminado**: Columna `due_date` (reemplazada por start_date y end_date)
