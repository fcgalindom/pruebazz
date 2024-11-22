import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.min.css' // Import the styles of Font Awesome
import globalComponents from './components/globalComponents' // Import the global components

import 'bootstrap/dist/css/bootstrap.min.css' // Import the styles of Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Import the scripts of Bootstrap

import primevue from '@plugins/primevue' // Import PrimeVue

import './styles/app.css'

const app = createApp(App)

app.use(router)
app.use(primevue)
app.use(globalComponents)
app.use(createPinia())
app.mount('#app')
