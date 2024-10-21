import { defineStore } from 'pinia';
import { fetchAccessToken } from '@/auth';

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    tracks: [],
    playlists: [],
    accessToken: null,
    currentTrackIndex: 0,
    selectedTrack: null,
    audio: new Audio(),
    artist: null,  // Для зберігання інформації про артиста
    error: null,    // Для обробки помилок
  }),

  actions: {
    setSelectedTrack(track) {
      this.selectedTrack = track;
      this.audio.src = track.audioUrl; // Заміна на аудіо URL
      this.audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    },

    setAccessToken(token) {
      this.accessToken = token;
      localStorage.setItem('spotifyAccessToken', token);
    },

    async fetchRandomTracks() {
      try {
        const featuredPlaylistsResponse = await fetch(
          'https://api.spotify.com/v1/browse/featured-playlists',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.accessToken}`
            }
          }
        );

        const featuredData = await featuredPlaylistsResponse.json();
        const playlists = featuredData.playlists.items;

        const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

        const tracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${randomPlaylist.id}/tracks`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.accessToken}`
            }
          }
        );

        const tracksData = await tracksResponse.json();

        this.tracks = tracksData.items.map(item => ({
          id: item.track.id,
          name: item.track.name,
          artistName: item.track.artists[0].name,
          imageUrl: item.track.album.images[0].url,
          audioUrl: item.track.preview_url
        }));

        console.log('Fetched random tracks:', this.tracks);
      } catch (error) {
        console.error('Error fetching random tracks:', error);
      }
    },

    async fetchPlaylists() {
      try {
        const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        });

        const data = await response.json();

        if (data.playlists && data.playlists.items) {
          this.playlists = data.playlists.items.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            imageUrl: playlist.images[0]?.url,
            artists: playlist.tracks?.items?.map(item => item.track?.artists[0]?.name) || []
          }));
        } else {
          console.error('No playlists found');
        }

        console.log('Fetched playlists:', this.playlists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    },

    playTrack(track) {
      if (track.audioUrl) {
        this.setSelectedTrack(track);
      }
    },

    pauseTrack() {
      this.audio.pause();
    },

    nextTrack() {
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.playTrack(this.tracks[this.currentTrackIndex]);
    },

    previousTrack() {
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.playTrack(this.tracks[this.currentTrackIndex]);
    }

		// async fetchArtistTracks(artistId) {
		// 	try {
		// 		const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
		// 			headers: {
		// 				Authorization: `Bearer ${this.accessToken}`,
		// 			},
		// 		});
		
		// 		const topTracksData = await topTracksResponse.json();
		// 		const tracks = topTracksData.tracks.map(track => ({
		// 			id: track.id,
		// 			name: track.name,
		// 			artistName: track.artists.map(artist => artist.name).join(', '),
		// 			imageUrl: track.album.images[0]?.url || '',
		// 			audioUrl: track.preview_url // URL для попереднього прослуховування, якщо доступний
		// 		}));
		
		// 		if (tracks.length > 0) {
		// 			this.topTracks = tracks; // Зберігаємо треки в стані
		// 			console.log('Fetched artist tracks:', this.topTracks);
		// 		} else {
		// 			console.warn('No top tracks found for this artist');
		// 			alert('Sorry, no top tracks found for this artist.');
		// 		}
		// 	} catch (error) {
		// 		console.error('Error fetching artist tracks:', error);
		// 		alert('There was an error fetching the tracks for this artist.');
		// 	}
		// }
		
  }
});
