import { createRouter, createWebHashHistory } from 'vue-router'

import customerRoutes from '@/routes/customers.routes'
import rafflesRoutes from '@/routes/raffle.route'
import ticketsRoutes from '@/routes/tickets.routes'
import sellerRoutes from '@/routes/sellers.routes'
import loginRoutes from './routes/login.routes'
import promotionRoutes from './routes/promotion.route'
import customerPublicRoutes from './routes/customers.public.routes'
import Cookies from 'js-cookie';

const routes = [
    ...customerRoutes,
    ...rafflesRoutes,
    ...ticketsRoutes,
    ...sellerRoutes,
    ...loginRoutes,
    ...promotionRoutes,
    ...customerPublicRoutes
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // Cambia a createWebHashHistory
  routes,
})

export default router
