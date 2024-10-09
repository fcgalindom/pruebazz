import CustomerList from '@/views/customer/CustomerList.vue'
import Cookies from 'js-cookie';
const customerRoutes = [
    {

		path: '/customers',
		name: 'CustomerList',
		component: CustomerList,
		beforeEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	}
]

export default customerRoutes