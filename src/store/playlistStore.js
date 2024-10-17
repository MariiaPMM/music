// src/store/playlistStore.js
import { defineStore } from 'pinia';
import { fetchAccessToken } from '@/auth';

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    tracks: [],
    playlists: [], // Додаємо поле для плейлистів
    accessToken: null,
  }),
  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem('spotifyAccessToken', token);
    },
    async fetchRandomTracks() {
      try {
        const featuredPlaylistsResponse = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });

        const featuredData = await featuredPlaylistsResponse.json();
        const playlists = featuredData.playlists.items;

        // Вибір випадкового плейлиста
        const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

        const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${randomPlaylist.id}/tracks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });

        const tracksData = await tracksResponse.json();
        
        // Отримання треків у правильному форматі
        this.tracks = tracksData.items.map(item => ({
          name: item.track.name,
          artistName: item.track.artists[0].name,
          imageUrl: item.track.album.images[0].url
        }));

        console.log('Fetched random tracks:', this.tracks);

      } catch (error) {
        console.error('Error fetching random tracks:', error);
      }
    },

    // Додаємо нову логіку для отримання плейлистів
    async fetchPlaylists() {
      try {
        const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
    
        const data = await response.json();
    
        // Перевіряємо, чи існують плейлисти
        if (data.playlists && data.playlists.items) {
          this.playlists = data.playlists.items.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            imageUrl: playlist.images[0]?.url, // Перевіряємо наявність зображень
            // Перевіряємо наявність треків і їхніх артистів
            artists: playlist.tracks?.items?.map(item => item.track?.artists[0]?.name) || []
          }));
        } else {
          console.error('No playlists found');
        }
    
        console.log('Fetched playlists:', this.playlists);
    
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    }
    
    
  },
});
