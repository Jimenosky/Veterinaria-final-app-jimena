# 🚀 GUÍA RÁPIDA: GENERAR APK Y DESPLEGAR

## 📱 PASO 1: GENERAR APK DE LA APP MÓVIL

### Opción A: Con Expo EAS (Recomendado)

```bash
# 1. Instalar EAS CLI globalmente
npm install -g eas-cli

# 2. Navegar a la carpeta de la app móvil
cd "D:\Desktop\proga diurno\app-veterinariaFInal\App-veterinaria-sin-error-web"

# 3. Login en Expo (necesitas crear cuenta en expo.dev)
eas login

# 4. Configurar el proyecto
eas build:configure

# 5. Generar APK (preview build)
eas build --platform android --profile preview

# 6. Esperar a que termine (5-15 minutos)
# Al finalizar te dará un enlace para descargar el APK
```

### Opción B: Build Local (Más rápido pero requiere Android Studio)

```bash
# 1. Navegar a la carpeta de la app
cd "D:\Desktop\proga diurno\app-veterinariaFInal\App-veterinaria-sin-error-web"

# 2. Instalar dependencias si no lo has hecho
npm install

# 3. Generar APK local
npx expo export --platform android
npx expo run:android --variant release

# El APK estará en: android/app/build/outputs/apk/release/
```

### Opción C: Expo Application Services Web

1. Ir a https://expo.dev/
2. Login con tu cuenta
3. Crear nuevo proyecto o conectar el existente
4. Click en "Build" → "Android" → "APK"
5. Esperar y descargar el APK

---

## 📤 PASO 2: SUBIR APK A LA NUBE

### Google Drive

1. Ir a https://drive.google.com
2. Click en "Nuevo" → "Subir archivo"
3. Seleccionar el APK descargado
4. Click derecho en el archivo → "Obtener enlace"
5. Cambiar a "Cualquier persona con el enlace"
6. Copiar el enlace

### OneDrive

1. Ir a https://onedrive.live.com
2. Click en "Cargar" → "Archivos"
3. Seleccionar el APK
4. Click derecho → "Compartir"
5. Configurar "Cualquiera con el vínculo"
6. Copiar el enlace

**Enlace del APK:** [PEGAR AQUÍ EL ENLACE]

---

## 🌐 PASO 3: DESPLEGAR PANEL WEB EN NETLIFY

### Método 1: Desde GitHub (Recomendado)

```bash
# 1. Asegurarse de que el código está en GitHub
cd "D:\Desktop\proga diurno\app-veterinariaFInal\veterinaria-admin"
git add .
git commit -m "Preparar para deploy en Netlify"
git push origin main
```

2. Ir a https://www.netlify.com/
3. Login con GitHub
4. Click en "Add new site" → "Import an existing project"
5. Seleccionar tu repositorio
6. Configurar:
   - **Base directory:** `veterinaria-admin`
   - **Build command:** `npm run build`
   - **Publish directory:** `veterinaria-admin/dist`
7. Click "Deploy site"
8. Esperar 2-3 minutos
9. Copiar la URL generada (ej: https://tu-proyecto.netlify.app)

### Método 2: Deploy Manual

```bash
# 1. Navegar a la carpeta del panel web
cd "D:\Desktop\proga diurno\app-veterinariaFInal\veterinaria-admin"

# 2. Instalar dependencias
npm install

# 3. Generar build de producción
npm run build

# 4. Instalar Netlify CLI
npm install -g netlify-cli

# 5. Login en Netlify
netlify login

# 6. Deploy
netlify deploy --prod

# Seleccionar la carpeta 'dist' cuando pregunte
```

**URL del Panel Web:** [PEGAR AQUÍ LA URL DE NETLIFY]

---

## 🌐 ALTERNATIVA: DESPLEGAR EN VERCEL

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Navegar a la carpeta
cd "D:\Desktop\proga diurno\app-veterinariaFInal\veterinaria-admin"

# 3. Login
vercel login

# 4. Deploy
vercel --prod

# Seguir las instrucciones en pantalla
```

**URL del Panel Web:** [PEGAR AQUÍ LA URL DE VERCEL]

---

## 🎥 PASO 4: GRABAR VIDEO DEMOSTRATIVO

### Herramientas Recomendadas

**Windows:**
- OBS Studio (gratis): https://obsproject.com/
- Loom (online, gratis): https://www.loom.com/
- Xbox Game Bar (viene con Windows 10/11): Win + G

**Online:**
- Screen Recorder de Chrome Extension
- Screencast-O-Matic

### Guion del Video (3-5 minutos)

```
⏱️ 0:00-0:30 | INTRODUCCIÓN
├─ Saludo
├─ Nombre del proyecto
└─ Tecnologías usadas

⏱️ 0:30-1:30 | REGISTRO Y LOGIN
├─ Abrir app en celular
├─ Crear cuenta nueva
├─ Iniciar sesión
└─ Ver pantalla principal

⏱️ 1:30-2:30 | GESTIÓN DE MASCOTAS
├─ Agregar nueva mascota
├─ Ver lista de mascotas
├─ Ver historial médico
└─ Ver tratamientos

⏱️ 2:30-3:30 | AGENDAR CITA
├─ Click en "Nueva Cita"
├─ Seleccionar fecha
├─ Elegir mascota y servicio
├─ Confirmar
└─ Ver notificación de tratamiento

⏱️ 3:30-4:30 | PANEL ADMIN
├─ Logout de usuario normal
├─ Login como admin
├─ Ver dashboard
├─ Editar una cita
└─ Completar una cita

⏱️ 4:30-5:00 | CIERRE
├─ Resumen de características
└─ Despedida
```

### Subir Video

**YouTube:**
1. Ir a https://studio.youtube.com/
2. Click "Crear" → "Subir video"
3. Seleccionar tu video
4. Configurar como "No listado" o "Público"
5. Copiar el enlace

**Google Drive:**
1. Subir el video a Drive
2. Click derecho → "Obtener enlace"
3. Configurar como público
4. Copiar enlace

**Enlace del Video:** [PEGAR AQUÍ EL ENLACE]

---

## ✅ CHECKLIST FINAL ANTES DE ENTREGAR

### Archivos y Enlaces
- [ ] APK generado y probado en celular real
- [ ] APK subido a Google Drive/OneDrive
- [ ] Enlace del APK funcionando (cualquiera puede descargar)
- [ ] Panel web desplegado en Netlify/Vercel
- [ ] URL del panel web funcionando
- [ ] Backend funcionando en Render
- [ ] Video grabado (3-5 minutos)
- [ ] Video subido a YouTube/Drive
- [ ] Enlace del video funcionando

### Documento de Entrega
- [ ] Abrir ENTREGA_FINAL_PROYECTO.md
- [ ] Copiar todo el contenido
- [ ] Pegar en Microsoft Word
- [ ] Agregar tu nombre completo
- [ ] Agregar tu carné
- [ ] Agregar enlace del APK en la sección 5
- [ ] Agregar enlace del video en la sección 6
- [ ] Agregar enlace de Netlify/Vercel
- [ ] Revisar formato y ortografía
- [ ] Guardar como PDF y DOCX
- [ ] Imprimir una copia física (opcional)

### Pruebas Finales
- [ ] Descargar APK desde el enlace público
- [ ] Instalar APK en un celular Android
- [ ] Probar registro de nuevo usuario
- [ ] Probar login
- [ ] Crear una mascota
- [ ] Agendar una cita
- [ ] Ver el panel admin web
- [ ] Verificar que la cita aparezca en el panel web
- [ ] Probar editar cita desde panel admin
- [ ] Probar completar cita

### Entrega
- [ ] Fecha límite: 28/02/2026 - 12:00 md
- [ ] Documento Word/PDF impreso o enviado
- [ ] Enlaces verificados funcionando
- [ ] Video completo y visible

---

## 🆘 PROBLEMAS COMUNES Y SOLUCIONES

### "Error: No Android SDK found"
```bash
# Usar Expo EAS en lugar de build local
eas build --platform android --profile preview
```

### "APK muy grande (>500MB)"
```bash
# Generar APK optimizado
eas build --platform android --profile production
```

### "El APK no instala en mi celular"
1. Habilitar "Orígenes desconocidos" en Ajustes
2. Ir a Ajustes → Seguridad → Instalar apps desconocidas
3. Activar para tu navegador o administrador de archivos

### "Error de deploy en Netlify"
```bash
# Verificar que el build funcione localmente
cd veterinaria-admin
npm run build

# Si funciona, subir manualmente la carpeta dist/
```

### "No puedo grabar el celular"
- Usar emulador de Android Studio (más fácil de grabar)
- O grabar con otra cámara/celular
- O usar scrcpy para screen mirror: https://github.com/Genymobile/scrcpy

---

## 📞 SOPORTE Y RECURSOS

### Enlaces Útiles
- **Expo Docs:** https://docs.expo.dev/
- **EAS Build:** https://docs.expo.dev/build/setup/
- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs

### Comandos de Emergencia

```bash
# Si algo falla, reinstalar dependencias
cd App-veterinaria-sin-error-web
rm -rf node_modules package-lock.json
npm install
npx expo start --clear

# Verificar que el backend esté funcionando
curl https://api-express-mysql-de-jime.onrender.com/api/v1/users

# Ver logs de Expo
npx expo start --tunnel
```

---

## 🎓 NOTAS FINALES

1. **Tiempo estimado total:** 1-2 horas (incluyendo build y video)
2. **Prioridad:** Primero el APK, luego el video, finalmente el documento
3. **Backup:** Guardar una copia del APK en tu computadora
4. **Práctica:** Probar el APK ANTES de grabar el video
5. **Calma:** Si algo falla, revisa los logs y busca errores específicos

---

✅ **¡Todo listo para entregar!**

Una vez completados todos los pasos, tendrás:
- ✅ APK funcionando y descargable
- ✅ Panel web en la nube
- ✅ Video demostrativo publicado
- ✅ Documento completo en Word
- ✅ Proyecto 100% funcional

**¡Éxito en tu entrega! 🚀**
