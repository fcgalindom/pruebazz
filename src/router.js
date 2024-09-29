import { createRouter, createWebHistory } from 'vue-router'

import customerRoutes from '@/routes/customers.routes'

const routes = [
    ...customerRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router