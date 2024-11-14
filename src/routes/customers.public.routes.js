import Clients from '@/views/clients/Clients.vue'
import Cookies from 'js-cookie';

const customerPublicRoutes = [
    {
		path: '/',
		name: 'Clients',
		component: Clients,
		beforeEnter: (to, from, next) => {
			 
			if (Cookies.get('token')) {
				Cookies.remove('token');
				window.location.reload();				
			} else {
				next()
			}
			
			
		}

	}
]

export default customerPublicRoutes