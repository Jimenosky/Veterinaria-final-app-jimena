# 🔄 Guía de Migración - URLs y Servicios

## 📋 URLs Actuales Encontradas (Proyecto Anterior)

### 1. Backend API en Render
```
URL Actual: https://api-express-mysql-de-jime.onrender.com
```
**Archivos que la usan:**
- `veterinaria-backend/test-register.js`
- `veterinaria-backend/test-user-edit.js`
- `veterinaria-backend/test-render-api.js`
- `veterinaria-backend/test-render-crear-mascota.js`
- `veterinaria-backend/test-mascotas-admin.js`
- `veterinaria-backend/test-login-https.js`
- `veterinaria-backend/test-crear-sin-color.js`
- `veterinaria-backend/test-crear-mascota.js`
- `veterinaria-backend/test-admin-stats.js`
- `veterinaria-backend/recreate-admin-render.js`

### 2. Base de Datos en Neon
```
URL Actual: postgresql://neondb_owner:npg_24ygwNfLnoCU@ep-snowy-mouse-ai2qasyt-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
```
**Archivos que la usan:**
- `veterinaria-backend/.env.example`
- `veterinaria-backend/update-admin-role.js`
- `veterinaria-backend/migrate-mysql-to-neon.js`

### 3. Repositorio GitHub Anterior
```
URL: https://github.com/Jimenosky/App-veterinaria2.0
```

---

## 🎯 Plan de Migración

### FASE 1: Preparar el Código ✅
- [x] Revisar URLs hardcodeadas
- [ ] Reemplazar URLs hardcodeadas por variables de entorno
- [ ] Actualizar archivos .env.example

### FASE 2: Crear Nuevo Repositorio
- [ ] Crear nuevo repositorio en GitHub
- [ ] Subir código al nuevo repositorio
- [ ] Configurar .gitignore correctamente

### FASE 3: Configurar Servicios en la Nube

#### A. Neon (Base de Datos PostgreSQL)
**Opciones:**
1. **Mantener la base de datos actual** de Neon (recomendado si quieres conservar datos)
2. **Crear nueva base de datos** en Neon (si quieres empezar desde cero)

#### B. Render (Backend API)
- [ ] Crear nuevo Web Service en Render
- [ ] Conectar con nuevo repositorio GitHub
- [ ] Configurar variables de entorno:
  - `DATABASE_URL` (desde Neon)
  - `JWT_SECRET`
  - `NODE_ENV=production`
  - `PORT=3001`
- [ ] Obtener nueva URL de Render

#### C. Netlify (Frontend Admin)
- [ ] Crear nuevo sitio en Netlify
- [ ] Conectar con nuevo repositorio GitHub
- [ ] Configurar directorio: `veterinaria-admin`
- [ ] Configurar variable: `VITE_API_URL` (con URL de Render nueva)

#### D. Netlify o Expo (App Móvil)
- [ ] Configurar en Expo Go para desarrollo
- [ ] O publicar en Netlify si es web

### FASE 4: Actualizar Variables de Entorno Local
Crear archivos `.env` locales (NO SUBIR A GIT):

**veterinaria-backend/.env**
```env
DATABASE_URL=postgresql://[NUEVA_URL_NEON]
JWT_SECRET=veterinaria-secret-key-production-2026
NODE_ENV=development
PORT=3001
```

**veterinaria-admin/.env**
```env
VITE_API_URL=http://localhost:3001/api/v1
# Cambiar a URL de Render cuando esté lista
```

**App-veterinaria-sin-error-web/.env**
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
# Cambiar a URL de Render cuando esté lista
```

---

## 🔧 Archivos a Actualizar

### Archivos con URLs hardcodeadas (necesitan usar variables de entorno):

1. **veterinaria-backend/test-*.js** (10 archivos)
   - Cambiar: `https://api-express-mysql-de-jime.onrender.com`
   - Por: `process.env.API_URL || 'http://localhost:3001'`

2. **veterinaria-backend/update-admin-role.js**
   - Cambiar: hardcoded Neon URL
   - Por: `process.env.DATABASE_URL`

3. **veterinaria-backend/migrate-mysql-to-neon.js**
   - Cambiar: hardcoded Neon URL
   - Por: `process.env.DATABASE_URL`

---

## 📝 Notas Importantes

⚠️ **SEGURIDAD:**
- Los archivos `.env` NUNCA deben subirse a GitHub
- Usa `.env.example` como plantilla sin datos sensibles
- Verifica que `.gitignore` incluye `.env`

⚠️ **ORDEN DE CONFIGURACIÓN:**
1. Primero: Base de datos (Neon)
2. Segundo: Backend (Render) - necesita DATABASE_URL
3. Tercero: Frontend (Netlify) - necesita VITE_API_URL del backend

⚠️ **TESTING:**
- Probar localmente primero con `npm start`
- Usar `npx expo start` para la app móvil
- Verificar que todo funciona antes de hacer deploy

---

## 🚀 URLs Finales (A completar después del deploy)

### Producción
```
Backend API: https://[TU-NUEVO-SERVICIO].onrender.com
Admin Panel: https://[TU-SITIO].netlify.app
Base de Datos: postgresql://[TU-NEON-URL]
Repositorio: https://github.com/Jimenosky/[NUEVO-REPO]
```

### Desarrollo
```
Backend API: http://localhost:3001
Admin Panel: http://localhost:5173
App Móvil: npx expo start
```

---

## ✅ Checklist Final

Antes de considerar la migración completa:
- [ ] Código subido al nuevo repositorio
- [ ] Backend deployado en Render y funcionando
- [ ] Admin deployado en Netlify y funcionando
- [ ] App móvil conectada al nuevo backend
- [ ] Todas las URLs actualizadas
- [ ] Variables de entorno configuradas
- [ ] Testing completo realizado
- [ ] Documentación actualizada

---

**¿Listo para empezar?** 🎯
