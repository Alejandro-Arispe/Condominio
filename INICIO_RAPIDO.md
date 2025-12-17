# 🎯 CondoSmart - Inicio Rápido

## 🚀 Una Línea para Iniciar Todo

### PowerShell
```powershell
.\run.ps1
```

### Command Prompt (CMD)
```batch
run.bat
```

---

## 📍 URLs Después de Iniciar

| Servicio | URL | Puerto |
|----------|-----|--------|
| **Frontend** | http://localhost:3000 | 3000 |
| **Backend API** | http://localhost:8000 | 8000 |
| **API Docs** | http://localhost:8000/api/schema | 8000 |

---

## 🔑 Login

```
📧 Email:    admin@condosmart.com
🔐 Password: admin123
```

---

## 📋 Opciones del Script

Después de ejecutar `run.ps1` o `run.bat`:

| Opción | Acción |
|--------|--------|
| 1 | Backend solo (Django) |
| 2 | Frontend solo (React) |
| 3 | **Backend + Frontend** (Recomendado) |
| 4 | Backend sin Frontend |
| 5 | Ver estado de servicios |
| 6 | Limpiar y resetear |

---

## ✅ Verificación Rápida

Después de iniciar, verifica:

1. **Backend** → http://localhost:8000
   - Deberías ver Swagger API documentation

2. **Frontend** → http://localhost:3000
   - Deberías ver página de login

3. **Login** → admin@condosmart.com / admin123
   - Deberías ver Dashboard

---

## 🛠️ Si Algo Falla

### Error 1: "Python no encontrado"
```powershell
# Instala desde:
python.org
```

### Error 2: "npm no encontrado"
```powershell
# Instala desde:
nodejs.org
```

### Error 3: "Puerto en uso"
```powershell
# En PowerShell (Admin):
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Error 4: Espacio en disco
```powershell
# Limpia e intenta de nuevo:
.\run.ps1
# Selecciona opción 6
```

---

## 📚 Documentación Completa

- **FRONTEND_FUNCIONAL.md** → Estado del frontend
- **CondoSmart-Frontend/QUICK_START.md** → Guía del frontend
- **CondoSmart-Frontend/CHECKLIST.md** → Verificación
- **CondoSmart-Backend/README.md** → Backend info

---

## 🎉 ¡Listo!

**3 clicks para tener CondoSmart corriendo:**

1. Doble clic `run.ps1` (o `run.bat`)
2. Selecciona opción **3**
3. Abre http://localhost:3000

**¡Eso es todo!** 🚀

