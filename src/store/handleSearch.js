// У вашому script-розділі
import { fetchAccessToken } from '@/auth'; // Імпортуйте функцію для отримання токена

export default {
	name: 'TheHeader',
	emits: ['on-toggle'],
	data() {
		return {
			searchQuery: '',
			searchResults: [], // Додайте масив для зберігання результатів пошуку
		};
	},
	methods: {
		async handleSearch() {
			try {
				const results = await this.searchTracks(this.searchQuery);
				this.searchResults = results; // Зберігайте результати у локальному стані
				console.log('Search results:', this.searchResults);
				// Тут можна додати логіку для відображення результатів
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		},
		async searchTracks(query) {
			const accessToken = await fetchAccessToken();
			const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			return data.tracks.items.map(track => ({
				id: track.id,
				name: track.name,
				artist: track.artists.map(artist => artist.name).join(', '),
				imageUrl: track.album.images[0]?.url,
			}));
		},
	},
};
