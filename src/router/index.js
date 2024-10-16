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
	}
	// Ви можете розкоментувати ці шляхи, якщо потрібно додати маршрути для аутентифікації
	// {
	//   path: '/auth',
	//   component: () => import('@/layouts/AuthLayout.vue'),
	//   children: [
	//     {
	//       path: 'login',
	//       name: 'LoginPage',
	//       component: () => import('@/pages/auth/LoginPage.vue')
	//     },
	//     {
	//       path: 'registration',
	//       name: 'RegistrationPage',
	//       component: () => import('@/pages/auth/RegistrationPage.vue')
	//     }
	//   ]
	// }
];

// Створюємо екземпляр роутера
const router = createRouter({
	history: createWebHistory(),
	routes // Використовуємо маршрути, визначені вище
});

// Експортуємо роутер як `export default`
export default router;
