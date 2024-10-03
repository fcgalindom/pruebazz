import { createRouter, createWebHistory } from 'vue-router'

import customerRoutes from '@/routes/customers.routes'
import rafflesRoutes from '@/routes/raffle.route'
import sellerRoutes from '@/routes/sellers.routes'

const routes = [
    ...customerRoutes,
    ...rafflesRoutes,
    ...sellerRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router