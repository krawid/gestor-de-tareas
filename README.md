# Gestor de Tareas

Aplicación web para gestión de tareas construida con React, TypeScript, Express y PostgreSQL.

## Requisitos

- Node.js 18 o superior
- PostgreSQL

## Instalación local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Edita .env con tu DATABASE_URL

# Crear tablas en la base de datos
npm run db:push

# Si actualizas desde una versión anterior, aplica las migraciones
psql $DATABASE_URL -f migrations/001_add_start_end_dates.sql

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Deploy en Railway

1. Conecta tu repositorio de GitHub
2. Railway detectará automáticamente Node.js
3. Añade PostgreSQL desde el dashboard
4. Railway configurará DATABASE_URL automáticamente
5. Deploy automático

## Variables de entorno

- `DATABASE_URL`: Conexión a PostgreSQL
- `PORT`: Puerto del servidor (Railway lo configura automáticamente)
- `NODE_ENV`: Entorno (development/production)
