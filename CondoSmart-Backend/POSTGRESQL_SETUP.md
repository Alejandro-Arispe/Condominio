# 🐘 Guía de Instalación de PostgreSQL para CondoSmart

## 📥 Paso 1: Descargar PostgreSQL

Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/

**Recomendado:** PostgreSQL 15 o 16

## 🔧 Paso 2: Instalar PostgreSQL

1. Ejecuta el instalador descargado
2. Durante la instalación:
   - **Puerto:** Deja el predeterminado (5432)
   - **Contraseña del superusuario (postgres):** Usa `postgres` (o la que prefieras)
   - **Locale:** Spanish, Bolivia (o el predeterminado)
3. Completa la instalación

## 🗄️ Paso 3: Crear la Base de Datos

Abre **pgAdmin** (se instala con PostgreSQL) o usa la terminal:

### Opción A: Usando pgAdmin (Más fácil)
1. Abre pgAdmin
2. Conéctate al servidor local (contraseña: `postgres`)
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `condosmart_db`
5. Owner: `postgres`
6. Click "Save"

### Opción B: Usando Terminal
```powershell
# Abre PowerShell como Administrador
psql -U postgres

# Dentro de psql, ejecuta:
CREATE DATABASE condosmart_db;
\q
```

## ⚙️ Paso 4: Configurar el Backend

El archivo `.env` ya está configurado con:
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=condosmart_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

**Si usaste una contraseña diferente**, edita el archivo `.env` y cambia `DB_PASSWORD`.

## ✅ Paso 5: Ejecutar Migraciones

```powershell
cd CondoSmart-Backend
.\\venv\\Scripts\\Activate.ps1
python manage.py migrate
python manage.py seed_data
```

## 🚀 Paso 6: Iniciar el Servidor

```powershell
python manage.py runserver
```

---

## 🔍 Verificar que PostgreSQL está corriendo

```powershell
# Verificar servicio
Get-Service -Name postgresql*

# Si no está corriendo, iniciarlo:
Start-Service postgresql-x64-15  # o la versión que instalaste
```

---

## ❓ Problemas Comunes

### Error: "psql no se reconoce"
Agrega PostgreSQL al PATH:
1. Busca la carpeta de instalación: `C:\Program Files\PostgreSQL\15\bin`
2. Agrégala a las variables de entorno PATH

### Error: "password authentication failed"
Verifica que la contraseña en `.env` coincida con la que configuraste en PostgreSQL

### Error: "database does not exist"
Crea la base de datos usando pgAdmin o psql

---

## 📝 Notas

- **Usuario por defecto:** postgres
- **Contraseña por defecto:** postgres (la que configuraste)
- **Puerto por defecto:** 5432
- **Base de datos:** condosmart_db
