import TicketList from '@/views/ticket/TicketList.vue'
import Cookies from 'js-cookie';
const ticketsRoutes = [
    {
		path: '/tickets',
		name: 'TicketList',
		component: TicketList,
		befereEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	}
]

export default ticketsRoutes