import { defineStore } from 'pinia';
import axios from 'axios';

export const useArtistsStore = defineStore('artists', {
	state: () => ({
		artists: [], // Масив артистів
		accessToken: '' // Токен доступу
	}),
	actions: {
    async fetchRandomArtists() {
        if (!this.accessToken) {
            console.error('Access token is not set. Cannot fetch artists.');
            return; // Не викликаємо запит, якщо токен відсутній
        }

        try {
            const response = await axios.get(
                'https://api.spotify.com/v1/browse/new-releases?country=US&limit=20',
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Оновлюємо масив артистів з необхідними даними (зображення та ім'я)
            this.artists = response.data.albums.items.map(album => ({
                id: album.id,
                name: album.artists[0]?.name,
                imageUrl: album.images[0]?.url // Отримуємо URL першого зображення альбому
            }));

            // Додайте це для перевірки
            console.log('Fetched artists:', this.artists);
        } catch (error) {
            console.error('Error loading artists:', error);
        }
    },
    setAccessToken(token) {
        this.accessToken = token; // Зберігаємо токен доступу
        console.log('Access token set:', token); // Додайте це для перевірки
    }
}

});
