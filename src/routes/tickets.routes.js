import TicketList from '@/views/ticket/TicketList.vue'
import TicketFree from '@/views/ticket/TicketFree.vue'
import TikectFirstPaid from '@/views/ticket/TikectFirstPaid.vue';
import chartprincipal from '@/views/charts/chartprincipal.vue';


import Cookies from 'js-cookie';
import { name } from '@cloudinary/url-gen/actions/namedTransformation';
import TicketLine from '@/views/ticket/TicketLine.vue';
import chartsellers from '@/views/charts/chartsellers.vue';
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
		path: '/tickets/LoadingTickets',
		name: 'TicketLoadingTickets',
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
		path: '/tickets/Pendiente',
		name: 'PendingTickets',
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
	},
	{
		path: '/tickets/Enlinea',
		name_: 'OnlineTickets',
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
		path: '/tickets/Abono',
		name: 'PaidTicketsimage',
		component: TikectFirstPaid,
		befereEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}
	},
	{
		path: '/reports/sales',
		name: 'chartprincipal',
		component: chartprincipal,
		befereEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		}

	},
	{
		path: '/reports/users',
		name: 'chartsellers',
		component: chartsellers,
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