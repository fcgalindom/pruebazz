import SellerList from '@/views/seller/SellerList.vue'
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
	}
]

export default sellerRoutes;