import Login from '@/views/login/Login.vue'
import Cookies from 'js-cookie';


const loginRoutes = [
    {
		path: '/admin',
		name: 'Login',
		component: Login,
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

export default loginRoutes