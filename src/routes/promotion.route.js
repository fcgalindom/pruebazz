import PromotionList from '@/views/Promotions/PromotionList.vue';
import Cookies from 'js-cookie';

const promotionRoutes = [
   
   
    {

         path: '/promotions',
         name: 'PromotionList',
         component: PromotionList,
         beforeEnter: (to, from, next) => {
			if (Cookies.get('token')) {
				next()
			} else {
				next('/admin')
			}
		 }



    }



]
export default promotionRoutes