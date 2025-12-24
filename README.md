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

Este proyecto está configurado para desplegarse automáticamente en Railway:

1. Conecta tu repositorio de GitHub a Railway
2. Railway detectará automáticamente Node.js
3. Añade PostgreSQL desde el dashboard de Railway
4. Railway configurará DATABASE_URL automáticamente
5. El deploy se ejecuta automáticamente con cada push a main

### Variables de entorno en Railway

Railway configura automáticamente:
- `DATABASE_URL`: Conexión a PostgreSQL (automática)
- `PORT`: Puerto del servidor (automática)
- `NODE_ENV`: Se configura como `production`

### Aplicar migraciones en Railway

Si actualizas desde una versión anterior, conecta a la base de datos de Railway y ejecuta:

```bash
# Obtén la DATABASE_URL desde el dashboard de Railway
psql [DATABASE_URL] -f migrations/001_add_start_end_dates.sql
```

## Variables de entorno

- `DATABASE_URL`: Conexión a PostgreSQL (Railway la configura automáticamente)
- `PORT`: Puerto del servidor (Railway la configura automáticamente, default: 5000)
- `NODE_ENV`: Entorno (development/production)
