import { defineStore } from 'pinia';
import axios from 'axios';

export const useArtistsStore = defineStore('artists', {
    state: () => ({
        artists: [], // Масив артистів
        accessToken: '', // Токен доступу
        artistTopTracks: {} // Об'єкт для зберігання топ-треків артистів
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

        async fetchTopTracks(artistId) {
            if (!this.accessToken) {
                console.error('Access token is not set. Cannot fetch top tracks.');
                return; // Не викликаємо запит, якщо токен відсутній
            }

            try {
                const response = await axios.get(
                    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                // Зберігаємо топ-треки для артиста
                this.artistTopTracks[artistId] = response.data.tracks.map(track => ({
                    id: track.id,
                    name: track.name,
                    artistName: track.artists[0]?.name,
                    imageUrl: track.album.images[0]?.url // Отримуємо URL обкладинки треку
                }));

                console.log('Fetched top tracks for artist:', artistId, this.artistTopTracks[artistId]);
            } catch (error) {
                console.error('Error loading top tracks:', error);
            }
        },

        setAccessToken(token) {
            this.accessToken = token; 
            console.log('Access token set:', token); 
        }
    }
});
