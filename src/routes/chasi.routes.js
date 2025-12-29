import ChasiList from '@/views/chasi/ChasiList.vue'
import Cookies from 'js-cookie'

const chasiRoutes = [
    {
        path: '/chasi',
        name: 'ChasiList',
        component: ChasiList,
        beforeEnter: (to, from, next) => {
            if (Cookies.get('token')) {
                next()
            } else {
                next('/admin')
            }
        }
    }
]

export default chasiRoutes
