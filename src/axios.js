import axios from 'axios';

const apiClient = axios.create({
	baseURL: 'https://accounts.spotify.com/api/token',
	headers: {
		'Content-Type': 'application/json',
		Authorization:
			'BQA9pI-ysyUyJzd_VAB6-NaaoVU0Onwa8MzELn6qAY_rxPHbxiN1H014U9MgOdURy2ELYXupZv42qLQO8IHvjIiEB4z_yytHCYaoJPosay5JfLW8jds' // Вставте свій токен або отримуйте його динамічно
	}
});

export default apiClient;
