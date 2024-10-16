import axios from 'axios';

// Функція для отримання токена
export const getAccessToken = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/token'); // Викликаємо ваш API
    return response.data.access_token; // Повертаємо токен
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error; // Піднімаємо помилку для подальшої обробки
  }
};
