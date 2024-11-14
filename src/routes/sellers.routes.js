import SellerList from '@/views/seller/SellerList.vue'
import SellerTickets from '@/views/seller/SellerTickets.vue'
import  SellerTracking from '@/views/seller/SellerTracking.vue'
import Cookies from 'js-cookie';
const sellerRoutes = [
    {
		path: '/sellers',
		name: 'SellerList',
		component: SellerList,
		beforeEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	},
	{
		path: '/sellers-tracking/:id/',
		name: 'SellerTracking',
		component: SellerTracking,
		beforeEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	},
	{
		path: '/sellers-tickets/:id/',
		name: 'SellerTickets',
		component: SellerTickets,
		beforeEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	}
]

export default sellerRoutes;