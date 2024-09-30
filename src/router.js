import { createRouter, createWebHistory } from 'vue-router'

import customerRoutes from '@/routes/customers.routes'
import rafflesRoutes from '@/routes/raffle.route'

const routes = [
    ...customerRoutes,
    ...rafflesRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router