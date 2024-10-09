import RaffleList from '@/views/raffle/RaffleList.vue'
import Cookies from 'js-cookie';
const rafflesRoutes = [
    {
		path: '/raffles',
		name: 'RaffleList',
		component: RaffleList,
		beforeEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	}
]

export default rafflesRoutes