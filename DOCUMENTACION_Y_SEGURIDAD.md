# 📋 Documentación y Análisis de Seguridad
## Proyecto: Raffles Dentix Frontend

---

## 📌 Información General del Proyecto

### **Descripción**
Sistema frontend para la gestión de rifas y sorteos para Dentix. Permite administrar clientes, vendedores, tickets, premios y promociones a través de una interfaz web.

### **Tecnologías Principales**
- **Framework**: Vue.js 3.4.29
- **Build Tool**: Vite 5.3.1
- **Estado**: Pinia 2.3.0
- **Routing**: Vue Router 4.4.5
- **UI Frameworks**:
  - Bootstrap 4.6.2
  - PrimeVue 4.2.2
  - Tailwind CSS 3.4.15
  - AdminLTE 3.2.0
- **HTTP Client**: Axios 1.8.1
- **Cookies**: js-cookie 3.0.5

### **Backend API**
- **URL Producción**: `https://rafllesdentix-1b827b6a53c6.herokuapp.com/api/`
- **URL Desarrollo**: `http://localhost:8000/api/` (comentada)

---

## 🏗️ Arquitectura del Proyecto

### **Estructura de Directorios**
```
src/
├── assets/             # Recursos estáticos (imágenes, CSS)
├── components/         # Componentes Vue reutilizables
│   ├── base/          # Componentes base (Inputs, Buttons, Modals)
│   └── ticket/        # Componentes específicos de tickets
├── data/              # Datos estáticos y configuraciones
├── enviroments/       # Configuración de API
├── helpers/           # Funciones utilitarias
├── plugins/           # Plugins de Vue (PrimeVue)
├── routes/            # Definición de rutas
├── services/          # Servicios de API
├── stores/            # Stores de Pinia
└── views/             # Vistas/Páginas de la aplicación
    ├── charts/        # Gráficos y reportes
    ├── clients/       # Gestión de clientes
    ├── customer/      # Gestión de customers
    ├── Home/          # Dashboard principal
    ├── login/         # Autenticación
    ├── Promotions/    # Gestión de promociones
    ├── raffle/        # Gestión de rifas
    ├── seller/        # Gestión de vendedores
    └── ticket/        # Gestión de tickets
```

### **Módulos Principales**

#### 1. **Autenticación** (`src/views/login/`)
- Login de usuarios
- Gestión de sesiones con cookies
- Diferenciación entre admin y vendedor

#### 2. **Clientes** (`src/views/clients/`, `src/views/customer/`)
- Listado y búsqueda de clientes
- Formulario de registro/edición
- Búsqueda por documento

#### 3. **Rifas** (`src/views/raffle/`)
- Creación y edición de rifas
- Gestión de premios
- Carga de imágenes

#### 4. **Tickets** (`src/views/ticket/`)
- Venta de tickets
- Seguimiento de pagos
- Tickets gratuitos
- Reportes y filtros
- Tickets por línea

#### 5. **Vendedores** (`src/views/seller/`)
- Gestión de vendedores
- Tracking de ventas
- Asignación de tickets

#### 6. **Promociones** (`src/views/Promotions/`)
- Gestión de promociones activas

#### 7. **Reportes** (`src/views/charts/`)
- Gráficos de ventas
- Estadísticas por vendedor
- Dashboard principal

---

## 🔐 Sistema de Autenticación

### **Flujo de Login**
1. Usuario ingresa email y contraseña
2. Se envía POST a `/api/sellers/login/`
3. Backend retorna:
   - Token de autenticación
   - Información del usuario
   - Información del vendedor (si aplica)
4. Se almacenan en cookies:
   - `token`: Token de autenticación
   - `type_user`: Boolean indicando si es superuser
   - `is_admin`: Verificación especial para `rifasysorteos4@gmail.com`
   - `name`: Nombre del usuario/vendedor
   - `seller_id`: ID del vendedor (si no es admin)

### **Protección de Rutas**
- Uso de `beforeEnter` guards en rutas
- Verificación de cookie `token`
- Redirección a login si no está autenticado

---

## 🛡️ ANÁLISIS DE VULNERABILIDADES Y PUNTOS DÉBILES

---

## 🚨 CRÍTICAS (Alta Prioridad)

### 1. **❌ Hardcoded Email para Admin (Línea Login.vue:49)**
```javascript
if (user.value.email == 'rifasysorteos4@gmail.com') {
    Cookies.set('is_admin', true, {
```

**Problema**:
- Lógica de autorización basada en email hardcodeado en frontend
- Cualquiera puede ver este email en el código fuente
- Un atacante puede cambiar el código JS en el navegador

**Impacto**: Control de acceso inseguro, escalación de privilegios

**Recomendación**:
```javascript
// Esta lógica debe estar en el backend
// El backend debe retornar is_admin en el response
Cookies.set('is_admin', response.user.is_admin, {
```

---

### 2. **❌ Cookie Flag Incorrecto: `vsecure` en lugar de `secure`**
```javascript
Cookies.set('token', response.token, {
    vsecure: true,    // ❌ TYPO - debería ser "secure"
    sameSite: 'Strict',
    expires: 1
});
```

**Problema**:
- Typo: `vsecure` no es una propiedad válida
- Las cookies NO se están marcando como `secure`
- Las cookies pueden ser transmitidas por HTTP sin cifrado

**Impacto**: Tokens pueden ser interceptados en ataques Man-in-the-Middle

**Recomendación**:
```javascript
Cookies.set('token', response.token, {
    secure: true,     // ✅ Corregir a "secure"
    sameSite: 'Strict',
    expires: 1,
    httpOnly: false   // No puede ser true en frontend
});
```

**Nota**: `httpOnly` no puede establecerse desde JavaScript. Esto debe configurarse desde el backend.

---

### 3. **❌ Falta de Interceptor de Axios para Autenticación**

**Problema**:
- El token se agrega manualmente en algunas peticiones (ticket.service.js:26-31)
- No todas las peticiones incluyen el token
- Código duplicado y propenso a errores

**Ejemplo actual**:
```javascript
static async createCustomer(raffle) {
    const url = `${enviroments.baseUrl}tickets/create/`
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const response = await axios.post(url, raffle, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
}
```

**Impacto**:
- Inconsistencia en autenticación
- Algunas peticiones pueden fallar por falta de token

**Recomendación**: Crear interceptor global
```javascript
// src/plugins/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '@/router';

axios.interceptors.request.use(
    config => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            Cookies.remove('token');
            router.push('/admin');
        }
        return Promise.reject(error);
    }
);

export default axios;
```

---

### 4. **❌ URL de API Hardcoded en Código (api.js:4)**
```javascript
export default {
    // baseUrl: 'http://localhost:8000/api/'
    baseUrl: 'https://rafllesdentix-1b827b6a53c6.herokuapp.com/api/'
}
```

**Problema**:
- URL de producción expuesta en código fuente
- No usa variables de entorno
- Difícil cambiar entre ambientes

**Impacto**: Exposición de infraestructura, dificulta CI/CD

**Recomendación**:
```javascript
// .env.production
VITE_API_BASE_URL=https://rafllesdentix-1b827b6a53c6.herokuapp.com/api/

// .env.development
VITE_API_BASE_URL=http://localhost:8000/api/

// src/enviroments/api.js
export default {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'
}
```

---

### 5. **❌ Manejo Inadecuado de Cookies en Parsing Manual**
```javascript
const token = document.cookie.split('; ').find(row => row.startsWith('token='));
```

**Problema**:
- Parsing manual propenso a errores
- Ya existe librería `js-cookie` en el proyecto pero no se usa consistentemente
- Código duplicado

**Recomendación**: Usar `js-cookie` consistentemente
```javascript
import Cookies from 'js-cookie';
const token = Cookies.get('token');
```

---

## ⚠️ ALTA (Prioridad Media-Alta)

### 6. **⚠️ Falta de Manejo de Errores en Peticiones**

**Problema**:
- Los servicios no tienen try-catch
- Los componentes no manejan errores de red
- Falta feedback al usuario en caso de error

**Ejemplo**:
```javascript
// login.service.js - Sin manejo de errores
static async login(user) {
    const url = `${enviroments.baseUrl}sellers/login/`
    const response = await axios.post(url, user)
    return response.data
}
```

**Recomendación**:
```javascript
static async login(user) {
    try {
        const url = `${enviroments.baseUrl}sellers/login/`
        const response = await axios.post(url, user)
        return { success: true, data: response.data }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error de conexión'
        }
    }
}
```

---

### 7. **⚠️ No Hay Validación de Tokens Expirados**

**Problema**:
- Las cookies expiran en 1 día
- No hay verificación de token expirado
- No hay refresh token

**Impacto**: Usuario puede quedar con token inválido sin saberlo

**Recomendación**: Implementar verificación en interceptor de axios (ver punto 3)

---

### 8. **⚠️ Uso de sessionStorage para Datos Sensibles**
```javascript
// TicketFilter.vue:129
sessionStorage.setItem('ticket', filters.value.number);

// TicketFree.vue:578
const ticketsee = sessionStorage.getItem('ticket');
```

**Problema**:
- sessionStorage persiste en memoria durante toda la sesión del navegador
- Accesible desde JavaScript (XSS vulnerability)
- No se limpia automáticamente

**Recomendación**:
- Usar store de Pinia para datos temporales
- Si es necesario persistir, usar cookies con secure flag

---

### 9. **⚠️ Falta de Sanitización de Inputs**

**Problema**:
- No hay validación/sanitización visible en los componentes
- Riesgo de XSS si el backend no sanitiza

**Recomendación**:
```javascript
// Usar librerías como DOMPurify para sanitizar
import DOMPurify from 'dompurify';

const cleanInput = DOMPurify.sanitize(userInput);
```

---

### 10. **⚠️ Console.log con Información Sensible**
```javascript
// ticket.service.js:94
console.error('Error descargando el Excel:', error);
```

**Problema**:
- Puede loguear información sensible
- En producción no debería haber console.logs

**Recomendación**:
```javascript
// Crear logger service
class Logger {
    static error(message, error) {
        if (import.meta.env.DEV) {
            console.error(message, error);
        }
        // Enviar a servicio de logging en producción
    }
}
```

---

## ⚡ MEDIA (Buenas Prácticas)

### 11. **⚡ Múltiples Frameworks CSS**

**Problema**:
- Bootstrap 4.6.2
- Tailwind CSS 3.4.15
- PrimeVue
- AdminLTE

**Impacto**:
- Bundle size innecesariamente grande
- Conflictos de estilos
- Mantenimiento complejo

**Recomendación**: Estandarizar en 1-2 frameworks máximo

---

### 12. **⚡ Falta de Variables de Entorno**

**Problema**: No existe archivo `.env` ni `.env.example`

**Recomendación**: Crear `.env.example`
```env
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_APP_NAME=Raffles Dentix
VITE_DEBUG=true
```

---

### 13. **⚡ window.location.href para Navegación**
```javascript
// Login.vue:82
window.location.href = '/home';
```

**Problema**:
- Recarga completa de la página
- Pierde estado de Vue
- No aprovecha SPA routing

**Recomendación**:
```javascript
import { useRouter } from 'vue-router';
const router = useRouter();

router.push('/home');
```

---

### 14. **⚡ Dependencias con Vulnerabilidades Conocidas**

**Verificar versiones de**:
- Bootstrap 4.6.2 (actualizar a 5.x)
- jQuery 3.7.1 (¿realmente necesario en Vue?)
- AdminLTE 3.2.0

**Recomendación**: Ejecutar
```bash
npm audit
npm audit fix
```

---

### 15. **⚡ Archivo `Clients copy.vue`**

**Problema**: Archivo duplicado con " copy" en el nombre

**Recomendación**: Eliminar o renombrar adecuadamente

---

### 16. **⚡ Falta de Validación en Formularios**

**Problema**:
- No se ve validación frontend consistente
- Inputs aceptan cualquier valor

**Recomendación**: Usar VeeValidate o Zod para validaciones

---

### 17. **⚡ Código Comentado en Producción**
```javascript
// Login.vue:37
//sessionStorage.setItem('key', response.data.token);
```

**Recomendación**: Eliminar código comentado antes de commit

---

## 📊 Resumen de Vulnerabilidades

| Severidad | Cantidad | Criticidad |
|-----------|----------|------------|
| 🚨 Crítica | 5 | **RESOLVER INMEDIATAMENTE** |
| ⚠️ Alta | 5 | Resolver en siguiente sprint |
| ⚡ Media | 7 | Refactoring técnico |
| **TOTAL** | **17** | |

---

## ✅ Checklist de Seguridad Prioritario

### **Sprint Inmediato**
- [ ] Corregir typo `vsecure` → `secure` en todas las cookies
- [ ] Mover lógica de `is_admin` al backend
- [ ] Implementar interceptor de Axios
- [ ] Migrar URLs a variables de entorno
- [ ] Usar `js-cookie` consistentemente

### **Siguiente Sprint**
- [ ] Implementar manejo de errores global
- [ ] Validar tokens expirados
- [ ] Eliminar sessionStorage para datos sensibles
- [ ] Implementar validación de formularios
- [ ] Actualizar dependencias vulnerables

### **Backlog Técnico**
- [ ] Reducir frameworks CSS
- [ ] Implementar logger service
- [ ] Usar router.push en lugar de window.location
- [ ] Sanitización de inputs
- [ ] Limpiar código comentado

---

## 🎯 Puntos Positivos del Proyecto

✅ **Buena separación de concerns** (services, routes, views)
✅ **Uso de Pinia** para gestión de estado
✅ **Componentes base reutilizables**
✅ **Estructura de rutas modular**
✅ **Uso de SameSite en cookies**
✅ **Build tool moderno** (Vite)

---

## 📚 Recursos de Mejora

1. **OWASP Top 10**: https://owasp.org/www-project-top-ten/
2. **Vue Security Best Practices**: https://vuejs.org/guide/best-practices/security.html
3. **Axios Security**: https://axios-http.com/docs/interceptors
4. **Cookie Security**: https://owasp.org/www-community/controls/SecureCookieAttribute

---

## 👨‍💻 Autor del Análisis
Fecha: 2026-03-18
Herramienta: Claude Code Analysis

---

## 📝 Notas Finales

Este análisis identifica 17 puntos de mejora en seguridad y buenas prácticas.
**Las 5 vulnerabilidades críticas deben ser atendidas de inmediato** ya que
comprometen la seguridad de autenticación y autorización del sistema.

La aplicación tiene una buena arquitectura base, pero requiere hardening de
seguridad antes de considerarse production-ready para un ambiente empresarial.
