import { createRouter, createWebHistory } from 'vue-router'

const prefix = ''

import Test from '../src/views/Test.vue'

const routes = [
    {
		path: prefix + '/enterprises',
		name: 'Test',
		component: Test,
	}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router