# ☁️ Guía de Configuración - Render y Netlify

## 🎯 Objetivo
Configurar el backend en Render y el frontend admin en Netlify, conectados al nuevo repositorio de GitHub.

---

## PARTE 1: Configurar Backend en Render 🚀

### Paso 1: Acceder a Render
1. Ve a [Render.com](https://render.com)
2. Inicia sesión (o crea cuenta si no tienes)
3. Dashboard → **New +** → **Web Service**

### Paso 2: Conectar Repositorio
1. Click en **"+ New Web Service"**
2. Conectar tu cuenta de GitHub si no está conectada
3. Buscar y seleccionar: **`App-veterinaria-Final`**
4. Click en **"Connect"**

### Paso 3: Configurar el Servicio

#### Configuración Básica
```
Name: app-veterinaria-backend
   (o el nombre que prefieras, será parte de la URL)

Region: Oregon (US West) 
   (o el más cercano a tus usuarios)

Branch: main

Root Directory: veterinaria-backend
   ⚠️ IMPORTANTE: Esto hace que Render solo vea la carpeta del backend
```

#### Configuración de Build
```
Runtime: Node

Build Command: npm install

Start Command: npm start
   (o node server.js)
```

#### Plan
```
Plan: Free
   (Suficiente para desarrollo y pruebas)
```

### Paso 4: Variables de Entorno
En la sección **"Environment"**, agregar estas variables:

```env
DATABASE_URL
Valor: postgresql://neondb_owner:npg_24ygwNfLnoCU@ep-snowy-mouse-ai2qasyt-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET
Valor: veterinaria-secret-key-production-2026

NODE_ENV
Valor: production

PORT
Valor: 3001
```

### Paso 5: Crear el Servicio
1. Click en **"Create Web Service"**
2. Esperar a que se complete el deploy (5-10 minutos)
3. Render instalará dependencias y arrancará el servidor

### Paso 6: Obtener la URL del Backend
Una vez deployado, verás algo como:
```
✅ Live at: https://app-veterinaria-backend-XXXX.onrender.com
```

**COPIAR ESTA URL** - la necesitarás para configurar el frontend.

### Paso 7: Probar el API
```powershell
# Probar health check
curl https://tu-backend.onrender.com/api/v1/health
```

---

## PARTE 2: Configurar Frontend Admin en Netlify 🌐

### Paso 1: Acceder a Netlify
1. Ve a [Netlify.com](https://netlify.com)
2. Inicia sesión (o crea cuenta)
3. Click en **"Add new site"** → **"Import an existing project"**

### Paso 2: Conectar GitHub
1. Click en **"Connect to Git provider"** → **GitHub**
2. Autorizar Netlify si es la primera vez
3. Buscar y seleccionar: **`App-veterinaria-Final`**

### Paso 3: Configurar el Sitio

#### Configuración de Build
```
Branch to deploy: main

Base directory: veterinaria-admin
   ⚠️ IMPORTANTE: Netlify solo verá esta carpeta

Build command: npm run build

Publish directory: veterinaria-admin/dist
```

### Paso 4: Variables de Entorno
Click en **"Advanced settings"** → **"New variable"**

```env
VITE_API_URL
Valor: https://tu-backend.onrender.com/api/v1
   ⚠️ Reemplazar con TU URL de Render del Paso 6
```

### Paso 5: Deploy
1. Click en **"Deploy site"**
2. Esperar 2-5 minutos mientras se construye
3. Una vez completo, verás la URL del sitio

### Paso 6: Obtener URL del Frontend
Netlify asignará una URL como:
```
https://random-name-12345.netlify.app
```

Puedes cambiarla en: **Site settings** → **Change site name**
```
Nuevo nombre: app-veterinaria-admin
URL final: https://app-veterinaria-admin.netlify.app
```

---

## PARTE 3: Actualizar Variables de Entorno Locales 📝

### Backend Local (.env)
Crear `veterinaria-backend/.env`:
```env
DATABASE_URL=postgresql://neondb_owner:npg_24ygwNfLnoCU@ep-snowy-mouse-ai2qasyt-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
API_URL=http://localhost:3001
JWT_SECRET=veterinaria-secret-key-production-2026
NODE_ENV=development
PORT=3001
```

### Admin Local (.env)
Crear `veterinaria-admin/.env`:
```env
# Para desarrollo local
VITE_API_URL=http://localhost:3001/api/v1

# Para probar con backend en producción
# VITE_API_URL=https://tu-backend.onrender.com/api/v1
```

### App Móvil Local (.env)
Crear `App-veterinaria-sin-error-web/.env`:
```env
# Para desarrollo local
EXPO_PUBLIC_API_URL=http://localhost:3001

# Para probar con backend en producción
# EXPO_PUBLIC_API_URL=https://tu-backend.onrender.com
```

**⚠️ RECORDAR: NO SUBIR ESTOS ARCHIVOS A GIT**

---

## PARTE 4: Testing del Sistema Completo 🧪

### Test 1: Backend API
```powershell
# En veterinaria-backend
$env:API_URL="https://tu-backend.onrender.com"
node test-admin-stats.js
```

### Test 2: Admin Panel
1. Abrir: `https://app-veterinaria-admin.netlify.app`
2. Login con: `admin@gmail.com` / `Password1!`
3. Verificar que carga el dashboard
4. Verificar que muestra datos

### Test 3: App Móvil
```powershell
cd App-veterinaria-sin-error-web
npx expo start
```
1. Escanear QR en Expo Go
2. Probar login y registro
3. Verificar conexión con backend

---

## PARTE 5: Configuraciones Adicionales ⚙️

### Render: Configurar Auto-Deploy
1. En Render Dashboard → tu servicio
2. **Settings** → **Build & Deploy**
3. ✅ Auto-Deploy: Yes
   - Cada push a `main` desplegará automáticamente

### Netlify: Configurar Auto-Deploy
Ya está habilitado por defecto:
- Cada push a `main` → auto-deploy del frontend

### CORS en Backend
Verificar en `veterinaria-backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://app-veterinaria-admin.netlify.app',
    // Agregar tu URL de Netlify aquí
  ],
  credentials: true
}));
```

---

## 📊 URLs Finales - Resumen

Anota aquí tus URLs para referencia:

```
📦 Repositorio GitHub:
https://github.com/Jimenosky/App-veterinaria-Final

🚀 Backend API (Render):
https://_____________.onrender.com

🌐 Admin Panel (Netlify):
https://_____________.netlify.app

🗄️ Base de Datos (Neon):
postgresql://neondb_owner:npg_24...@ep-snowy-mouse-...neon.tech/neondb

👤 Repositorio Anterior:
https://github.com/Jimenosky/App-veterinaria2.0
```

---

## 🆘 Solución de Problemas

### Backend no inicia en Render
1. Revisar logs: Dashboard → tu servicio → **Logs**
2. Verificar variables de entorno
3. Verificar que `package.json` tenga `"start": "node server.js"`

### Frontend no puede conectar al backend
1. Verificar variable `VITE_API_URL` en Netlify
2. Verificar CORS en el backend
3. Revisar consola del navegador (F12)

### Error de base de datos
1. Verificar que `DATABASE_URL` sea exacta (sin espacios)
2. Probar conexión desde local primero
3. Verificar que Neon esté activo

### Build falla en Netlify
1. Verificar que `Base directory` sea correcto
2. Verificar que todas las dependencias estén en `package.json`
3. Revisar logs de build

---

## ✅ Checklist Final

Antes de considerar completado:
- [ ] Backend desplegado en Render
- [ ] Frontend desplegado en Netlify
- [ ] Variables de entorno configuradas correctamente
- [ ] Login funciona en producción
- [ ] Dashboard carga datos correctamente
- [ ] App móvil se conecta al backend en producción
- [ ] Auto-deploy configurado en ambos servicios
- [ ] URLs documentadas en el README
- [ ] Todo probado y funcional

---

## 🎓 Mejoras Opcionales

### Custom Domain (Netlify)
1. Comprar dominio (ej: GoDaddy, Namecheap)
2. En Netlify: **Domain settings** → **Add custom domain**
3. Configurar DNS según instrucciones

### SSL/HTTPS
- Render y Netlify incluyen SSL automático ✅

### Monitoring
- Render: Ver logs en tiempo real
- Netlify: Analytics en el dashboard

---

**🎉 ¡Felicidades! Tu sistema está en la nube!**

Ahora tienes:
- ✅ Código en GitHub
- ✅ Backend en Render
- ✅ Frontend en Netlify
- ✅ Base de datos en Neon
- ✅ Sistema completo funcionando

🚀 **¡Tu proyecto está listo para presentar!**
