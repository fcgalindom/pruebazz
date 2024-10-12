import { createRouter, createWebHistory } from 'vue-router'

import customerRoutes from '@/routes/customers.routes'
import rafflesRoutes from '@/routes/raffle.route'
import ticketsRoutes from '@/routes/tickets.routes'
import sellerRoutes from '@/routes/sellers.routes'
import loginRoutes from './routes/login.routes'
import customerPublicRoutes from './routes/customers.public.routes'
import Cookies from 'js-cookie';



const routes = [
    ...customerRoutes,
    ...rafflesRoutes,
    ...ticketsRoutes,
    ...sellerRoutes,
    ...loginRoutes,
    ...customerPublicRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router