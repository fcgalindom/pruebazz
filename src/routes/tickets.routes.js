import TicketList from '@/views/ticket/TicketList.vue'
import Cookies from 'js-cookie';
const ticketsRoutes = [
    {
		path: '/tickets/Libre',
		name: 'FreeTickets',
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