import TicketList from '@/views/ticket/TicketList.vue'
import TicketFree from '@/views/ticket/TicketFree.vue'
import Cookies from 'js-cookie';
const ticketsRoutes = [
    {
		path: '/tickets/Libre',
		name: 'TicketFree',
		component: TicketFree,
		befereEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	},
    {
		path: '/tickets/Reservado',
		name: 'BookedTickets',
		component: TicketList,
		befereEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	},
	{
		path: '/tickets/Pagado',
		name: 'PaidTickets',
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