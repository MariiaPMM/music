import { defineStore } from 'pinia';
import { fetchAccessToken } from '@/auth';

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    tracks: [],
    accessToken: null,
  }),
  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem('spotifyAccessToken', token);
    },
    async fetchRandomTracks() {
      try {
        const response = await fetch('https://api.spotify.com/v1/playlists/{playlist_id}/tracks', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        // Оновлюємо інформацію про треки
        this.tracks = data.items.map(item => ({
          name: item.track.name, // Назва пісні
          imageUrl: item.track.album.images[0]?.url, // Картинка альбому
          artistName: item.track.artists[0]?.name, // Ім'я виконавця
          artistId: item.track.artists[0]?.id, // ID виконавця
        }));

        // Збереження треків у localStorage
        localStorage.setItem('playlistTracks', JSON.stringify(this.tracks));
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    },
  },
});
