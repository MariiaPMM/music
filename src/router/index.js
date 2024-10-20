import { createRouter, createWebHistory } from 'vue-router';

// Визначаємо масив маршрутів
const routes = [
	{
		path: '/',
		component: () => import('@/layouts/MainLayout.vue'),
		children: [
			{
				path: '',
				name: 'HomePage',
				component: () => import('@/pages/HomePage.vue')
			}
		]
	},
	{
		path: '/',
		component: () => import('@/layouts/AuthLayout.vue'),
		children: [
			{
				path: '',
				name: 'UserProfile',
				component: () => import('@/pages/UserProfile.vue')
			}
		]
	}
	
];

// Створюємо екземпляр роутера
const router = createRouter({
	history: createWebHistory(),
	routes // Використовуємо маршрути, визначені вище
});

// Експортуємо роутер як `export default`
export default router;
