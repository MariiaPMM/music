import { defineStore } from 'pinia';
import axios from 'axios';

export const useTrackStore = defineStore('track', {
  state: () => ({
    currentTrack: null,
    accessToken: '',
    tracks: [], // Масив треків
    currentTrackIndex: 0 // Індекс поточного треку
  }),
  actions: {
    async fetchTrack(trackId) {
      if (!this.accessToken) {
        throw new Error('Access token is not set');
      }

      try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}` // Виправлено форматування
          }
        });

        this.currentTrack = response.data; // Зберігаємо отриманий трек
      } catch (error) {
        console.error('Error fetching track:', error);
        throw error; // Пробрасываем ошибку для обработки на более высоком уровне
      }
    },
    setAccessToken(token) {
      this.accessToken = token; // Зберігаємо токен доступу
    },
    setTracks(trackIds) {
      this.tracks = trackIds; // Зберігаємо треки в store
      this.currentTrackIndex = 0; // Скидаємо індекс при новому наборі треків
    },
    nextTrack() {
      // Переходження до наступного треку
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length; // Збільшуємо індекс
      this.fetchTrack(this.tracks[this.currentTrackIndex]); // Завантажуємо трек
    },
    previousTrack() {
      // Повернення до попереднього треку
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length; // Зменшуємо індекс
      this.fetchTrack(this.tracks[this.currentTrackIndex]); // Завантажуємо трек
    },
    setCurrentTrack(track) {
			this.currentTrack = track;
		},

  }
});
