# 📦 Guía Paso a Paso - Nuevo Repositorio GitHub

## 🎯 Objetivo
Crear un nuevo repositorio en GitHub para el proyecto veterinaria mejorado y configurar todo para deployment.

---

## PASO 1: Crear Repositorio en GitHub

### 1.1 Acceder a GitHub
1. Ve a [GitHub](https://github.com)
2. Inicia sesión con tu cuenta: **Jimenosky**

### 1.2 Crear Nuevo Repositorio
1. Click en el botón **"+"** (arriba derecha) → **"New repository"**
2. Configurar el repositorio:
   ```
   Repository name: App-veterinaria-Final
   Description: Sistema integral de veterinaria con App Móvil, Panel Admin Web y API Backend
   Visibility: Public (o Private si prefieres)
   
   ⚠️ NO INICIALIZAR CON:
   ❌ README (ya tienes uno)
   ❌ .gitignore (ya tienes uno)
   ❌ license
   ```
3. Click en **"Create repository"**

### 1.3 Copiar URL del Repositorio
Después de crear, verás una página con instrucciones. Copia la URL:
```
https://github.com/Jimenosky/App-veterinaria-Final.git
```

---

## PASO 2: Conectar Tu Proyecto Local al Repositorio

### 2.1 Abrir PowerShell en la carpeta del proyecto
```powershell
cd "D:\Desktop\proga diurno\app-veterinariaFInal"
```

### 2.2 Inicializar Git (si no está ya)
```powershell
# Verificar si ya es un repositorio git
git status

# Si dice "not a git repository", inicializar:
git init
```

### 2.3 Verificar archivos antes de subir
```powershell
# Ver qué archivos se subirán
git status

# IMPORTANTE: Verificar que NO aparezcan archivos .env
# Solo debe aparecer .env.example
```

### 2.4 Agregar todos los archivos
```powershell
git add .
```

### 2.5 Hacer el primer commit
```powershell
git commit -m "🎉 Versión inicial del sistema veterinario completo"
```

### 2.6 Cambiar rama a main (si es necesario)
```powershell
# Verificar rama actual
git branch

# Si está en "master", cambiar a "main"
git branch -M main
```

### 2.7 Conectar con el repositorio remoto
```powershell
# Reemplazar con TU URL de GitHub
git remote add origin https://github.com/Jimenosky/App-veterinaria-Final.git
```

### 2.8 Subir el código
```powershell
git push -u origin main
```

**Si pide autenticación:**
- Username: `Jimenosky`
- Password: Usa un **Personal Access Token** (no tu password normal)

---

## PASO 3: Crear Personal Access Token (si no tienes uno)

### 3.1 Ir a Settings en GitHub
1. Click en tu foto de perfil → **Settings**
2. Scroll hasta abajo → **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token** → **Generate new token (classic)**

### 3.2 Configurar el Token
```
Note: Token para App Veterinaria
Expiration: 90 days (o el que prefieras)

Scopes a seleccionar:
✅ repo (todos los sub-items)
✅ workflow
```

### 3.3 Generar y Copiar
1. Click en **Generate token**
2. **COPIAR EL TOKEN INMEDIATAMENTE** (solo se muestra una vez)
3. Guardarlo en un lugar seguro

### 3.4 Usar el Token
Cuando te pida password en el `git push`, pega el token (no tu password).

---

## PASO 4: Verificar que todo está en GitHub

### 4.1 Abrir tu repositorio
Ve a: `https://github.com/Jimenosky/App-veterinaria-Final`

### 4.2 Verificar estructura
Debes ver:
```
✅ README.md
✅ veterinaria-backend/
✅ veterinaria-admin/
✅ App-veterinaria-sin-error-web/
✅ .gitignore
✅ Todos los archivos de configuración
```

### 4.3 CRÍTICO: Verificar seguridad
En GitHub, busca archivos `.env`:
- ❌ **NO DEBE APARECER** ningún archivo `.env`
- ✅ **SÍ DEBE APARECER** `veterinaria-backend/.env.example`
- ✅ **SÍ DEBE APARECER** `veterinaria-admin/.env.example`
- ✅ **SÍ DEBE APARECER** `App-veterinaria-sin-error-web/.env.example`

**Si ves archivos `.env` reales en GitHub:**
```powershell
# DETENER y ejecutar esto:
git rm --cached .env
git rm --cached veterinaria-backend/.env
git rm --cached veterinaria-admin/.env
git rm --cached App-veterinaria-sin-error-web/.env
git commit -m "🔒 Remover archivos .env del repositorio"
git push
```

---

## PASO 5: Actualizar README.md con nuevo repo

### 5.1 Editar README.md
Agregar al inicio del README:
```markdown
## 🔗 Enlaces

- **Repositorio:** https://github.com/Jimenosky/App-veterinaria-Final
- **Backend API:** (Configurar después de Render deploy)
- **Admin Panel:** (Configurar después de Netlify deploy)
- **Repositorio Anterior (v1):** https://github.com/Jimenosky/App-veterinaria2.0
```

### 5.2 Commit y push
```powershell
git add README.md
git commit -m "📝 Actualizar README con nuevo repositorio"
git push
```

---

## 📋 Checklist de Verificación

Antes de continuar con Render y Netlify:
- [ ] Repositorio creado en GitHub
- [ ] Código subido completamente
- [ ] NO hay archivos `.env` en el repositorio (solo `.env.example`)
- [ ] Todos los archivos están presentes
- [ ] README actualizado con nuevo repo
- [ ] .gitignore funcionando correctamente

---

## ⏭️ Próximos Pasos

Una vez el código esté en GitHub, podemos continuar con:
1. **Configurar Render** (Backend API)
2. **Configurar Netlify** (Frontend Admin)
3. **Actualizar variables de entorno** con las nuevas URLs
4. **Testing completo** del sistema

---

## 🆘 Solución de Problemas Comunes

### "remote: Repository not found"
- Verificar que el repositorio existe en GitHub
- Verificar que tienes permisos de escritura
- Verificar que la URL sea correcta

### "Permission denied (publickey)"
- Usar HTTPS en lugar de SSH
- O configurar SSH keys correctamente

### "Updates were rejected"
```powershell
# Forzar push (solo si estás seguro)
git push -f origin main
```

### "Large files warning"
```powershell
# Ver archivos grandes
git ls-files | xargs ls -lh | sort -k5 -hr | head -20

# Remover node_modules si se agregó por error
git rm -r --cached node_modules
git commit -m "🗑️ Remover node_modules"
```

---

## 💡 Tips Importantes

1. **Nunca subas archivos `.env`** - Contienen credenciales sensibles
2. **Usa tokens, no passwords** - Más seguro para autenticación
3. **Commits descriptivos** - Usa emojis y mensajes claros
4. **Pull antes de push** - Si trabajas desde múltiples lugares
5. **Branch protection** - Configura después para proteger main

---

📞 **¿Listo para continuar?**
Una vez tengas el repositorio en GitHub, podemos configurar Render y Netlify! 🚀
