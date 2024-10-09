import TicketList from '@/views/ticket/TicketList.vue'

const ticketsRoutes = [
    {
		path: '/tickets/free',
		name: 'FreeTickets',
		component: TicketList,
	},
    {
		path: '/tickets/booked',
		name: 'BookedTickets',
		component: TicketList,
	},
	{
		path: '/tickets/paid',
		name: 'PaidTickets',
		component: TicketList,
	}
]

export default ticketsRoutes