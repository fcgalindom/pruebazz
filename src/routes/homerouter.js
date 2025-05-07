import Home from '@/views/Home/Home.vue';
import Cookies from 'js-cookie';
const customerRoutes = [
    {

        path: '/home',
        name: 'Home',
        component: Home,
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