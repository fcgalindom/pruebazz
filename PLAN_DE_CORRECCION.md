# 🛠️ Plan de Corrección - Vulnerabilidades Críticas

## Sprint Inmediato (1-2 días)

---

## 1️⃣ Corregir Cookie Secure Flag

### **Archivos a modificar**: `src/views/login/Login.vue`

**Líneas**: 38-79

```javascript
// ❌ ANTES
Cookies.set('token', response.token, {
    vsecure: true,    // TYPO
    sameSite: 'Strict',
    expires: 1
});

// ✅ DESPUÉS
Cookies.set('token', response.token, {
    secure: true,     // Corregido
    sameSite: 'Strict',
    expires: 1
});
```

**Aplicar el mismo cambio en**:
- `Cookies.set('type_user', ...)`
- `Cookies.set('is_admin', ...)`
- `Cookies.set('name', ...)`
- `Cookies.set('seller_id', ...)`

---

## 2️⃣ Implementar Axios Interceptor

### **Crear archivo**: `src/plugins/axios.js`

```javascript
import axios from 'axios';
import Cookies from 'js-cookie';
import router from '@/router';
import enviroments from '@/enviroments/api';

// Configurar base URL
axios.defaults.baseURL = enviroments.baseUrl;

// Request Interceptor - Agregar token automáticamente
axios.interceptors.request.use(
    config => {
        const token = Cookies.get('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Manejar errores de autenticación
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expirado o inválido
            Cookies.remove('token');
            Cookies.remove('type_user');
            Cookies.remove('is_admin');
            Cookies.remove('name');
            Cookies.remove('seller_id');
            router.push('/admin');
        }
        return Promise.reject(error);
    }
);

export default axios;
```

### **Modificar**: `src/main.js`

```javascript
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import globalComponents from './components/globalComponents'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import primevue from '@plugins/primevue'
import './styles/app.css'

// ✅ AGREGAR ESTA LÍNEA
import './plugins/axios'

const app = createApp(App)

app.use(router)
app.use(primevue)
app.use(globalComponents)
app.use(createPinia())
app.mount('#app')
```

### **Simplificar servicios**

**Antes** (ticket.service.js):
```javascript
static async createCustomer(raffle) {
    const url = `${enviroments.baseUrl}tickets/create/`
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    const response = await axios.post(url, raffle, {
        headers: {
            Authorization: `Token ${token}`
        }
    });
    return response.data;
}
```

**Después**:
```javascript
static async createCustomer(raffle) {
    const url = '/tickets/create/'  // baseURL ya está configurada
    const response = await axios.post(url, raffle);
    // El token se agrega automáticamente
    return response.data;
}
```

---

## 3️⃣ Configurar Variables de Entorno

### **Crear**: `.env.development`
```env
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_APP_NAME=Raffles Dentix
VITE_DEBUG=true
```

### **Crear**: `.env.production`
```env
VITE_API_BASE_URL=https://rafllesdentix-1b827b6a53c6.herokuapp.com/api/
VITE_APP_NAME=Raffles Dentix
VITE_DEBUG=false
```

### **Crear**: `.env.example`
```env
VITE_API_BASE_URL=http://localhost:8000/api/
VITE_APP_NAME=Raffles Dentix
VITE_DEBUG=true
```

### **Modificar**: `src/enviroments/api.js`

```javascript
export default {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'
}
```

### **Actualizar**: `.gitignore`
```gitignore
.env
.env.local
.env.*.local
.env.development.local
.env.production.local
```

---

## 4️⃣ Mover Lógica de Admin al Backend

### **Coordinar con Backend**

El backend debe retornar `is_admin` en el response de login:

```json
{
    "token": "abc123...",
    "user": {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "is_superuser": true,
        "is_admin": true  // ← Backend debe agregar esto
    }
}
```

### **Modificar**: `src/views/login/Login.vue`

**Antes**:
```javascript
if (user.value.email == 'rifasysorteos4@gmail.com') {
    Cookies.set('is_admin', true, { ... });
} else {
    Cookies.set('is_admin', false, { ... });
}
```

**Después**:
```javascript
// La lógica está en el backend
Cookies.set('is_admin', response.user.is_admin || false, {
    secure: true,
    sameSite: 'Strict',
    expires: 1
});
```

---

## 5️⃣ Implementar Manejo Global de Errores

### **Crear**: `src/composables/useErrorHandler.js`

```javascript
import { ref } from 'vue';
import Swal from 'sweetalert2';

export function useErrorHandler() {
    const isLoading = ref(false);
    const error = ref(null);

    const handleError = (err) => {
        console.error('Error:', err);

        const message = err.response?.data?.message
            || err.response?.data?.detail
            || err.message
            || 'Ha ocurrido un error inesperado';

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message
        });

        error.value = message;
    };

    const executeAsync = async (asyncFn, successMessage = null) => {
        isLoading.value = true;
        error.value = null;

        try {
            const result = await asyncFn();

            if (successMessage) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: successMessage,
                    timer: 2000
                });
            }

            return result;
        } catch (err) {
            handleError(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        handleError,
        executeAsync
    };
}
```

### **Uso en componentes**:

```vue
<script setup>
import { useErrorHandler } from '@/composables/useErrorHandler';
import { LoginServices } from '@/services/login.service';

const { isLoading, executeAsync } = useErrorHandler();

const saveEntity = async () => {
    await executeAsync(
        async () => {
            const response = await LoginServices.login(user.value);
            // Procesar respuesta...
        },
        'Login exitoso'
    );
};
</script>

<template>
    <Button @click="saveEntity" :disabled="isLoading">
        <span v-if="isLoading">Cargando...</span>
        <span v-else>Login</span>
    </Button>
</template>
```

---

## 6️⃣ Usar Router.push en lugar de window.location

### **Modificar**: `src/views/login/Login.vue`

```javascript
import { useRouter } from 'vue-router';

const router = useRouter();

const saveEntity = async () => {
    try {
        const response = await LoginServices.login(user.value);

        // Configurar cookies...

        // ❌ ANTES
        // window.location.href = '/home';

        // ✅ DESPUÉS
        router.push('/home');
    } catch (error) {
        // Manejar error
    }
}
```

---

## 7️⃣ Reemplazar sessionStorage

### **Crear store**: `src/stores/ticketStore.js`

```javascript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTicketStore = defineStore('ticket', () => {
    const selectedTicketNumber = ref(null);

    const setTicketNumber = (number) => {
        selectedTicketNumber.value = number;
    };

    const clearTicketNumber = () => {
        selectedTicketNumber.value = null;
    };

    return {
        selectedTicketNumber,
        setTicketNumber,
        clearTicketNumber
    };
});
```

### **Usar en componentes**:

**Antes** (TicketFilter.vue):
```javascript
sessionStorage.setItem('ticket', filters.value.number);
```

**Después**:
```javascript
import { useTicketStore } from '@/stores/ticketStore';

const ticketStore = useTicketStore();
ticketStore.setTicketNumber(filters.value.number);
```

**Antes** (TicketFree.vue):
```javascript
const ticketsee = sessionStorage.getItem('ticket');
```

**Después**:
```javascript
import { useTicketStore } from '@/stores/ticketStore';

const ticketStore = useTicketStore();
const ticketsee = ticketStore.selectedTicketNumber;
```

---

## 🧪 Testing del Plan

### **Checklist de Verificación**

```bash
# 1. Variables de entorno
npm run dev    # Debe usar .env.development
npm run build  # Debe usar .env.production

# 2. Cookies seguras
# Abrir DevTools > Application > Cookies
# Verificar: Secure = ✓, SameSite = Strict

# 3. Interceptor funciona
# Hacer login
# Ir a Network tab
# Todas las peticiones deben tener header: Authorization: Token xxx

# 4. Manejo de errores
# Desconectar internet
# Intentar hacer login
# Debe mostrar SweetAlert con error

# 5. Token expirado
# Borrar cookie de token manualmente
# Intentar acceder a ruta protegida
# Debe redirigir a /admin
```

---

## 📦 Comandos Útiles

```bash
# Actualizar dependencias
npm audit fix

# Verificar vulnerabilidades
npm audit

# Limpiar cache
rm -rf node_modules package-lock.json
npm install

# Build de producción
npm run build

# Preview de producción
npm run preview
```

---

## 🚀 Deploy

### **Antes de hacer deploy a producción**:

1. ✅ Todas las correcciones implementadas
2. ✅ Variables de entorno configuradas en Vercel/Heroku
3. ✅ Backend actualizado con campo `is_admin`
4. ✅ Testing completo
5. ✅ Audit de npm sin vulnerabilidades críticas

---

## 📞 Soporte

Si tienes dudas durante la implementación:
1. Revisar documentación de Vue 3
2. Revisar documentación de Axios
3. Consultar OWASP guidelines

---

**Fecha de creación**: 2026-03-18
**Tiempo estimado**: 4-8 horas de desarrollo
**Prioridad**: CRÍTICA 🚨
