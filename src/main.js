import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import globalComponents from './components/globalComponents' // Import the global components
import 'admin-lte/dist/css/adminlte.min.css' // Import the styles of AdminLTE
import 'admin-lte/dist/js/adminlte.min.js' // Import the scripts of AdminLTE

const app = createApp(App)

app.use(router)
app.use(globalComponents)
app.use(createPinia())
app.mount('#app')
