<template>
	<div class="playlist">
		<div class="header">
			<button
				class="header__button"
				:class="{ active: isMusicActive }"
				@click="toggleMusic"
			>
				Музика
			</button>
		</div>

		<!-- Секція з інформацією про артиста -->
		<div
			v-if="selectedArtist"
			class="artist-info"
		>
			<img
				:src="selectedArtist.imageUrl"
				alt="Artist Cover"
				class="artist-info__image"
			/>
			<h2 class="artist-info__name">{{ selectedArtist.name }}</h2>
		</div>

		<div class="playlist__info">
			<!-- Секція з артистами -->
			<div class="artists-section">
				<div v-if="artistsLoading">Завантаження артистів...</div>
				<div v-else-if="artistsError">{{ artistsError }}</div>
				<div
					class="artists-list"
					v-else
				>
					<div
						class="artist-card"
						v-for="artist in limitedArtists"
						:key="artist.id"
						@click="selectArtist(artist)"
					>
						<img
							:src="artist.imageUrl"
							alt="Artist Cover"
							class="artist__image"
						/>
						<p class="artist__name">{{ artist.name }}</p>
					</div>
				</div>
			</div>

			<!-- Секція з треками -->
			<div class="tracks-section">
				<a>Рекомендації для тебе</a>
				<div v-if="tracksLoading">Завантаження треків...</div>
				<div v-else-if="tracksError">{{ tracksError }}</div>
				<div class="tracks-list" v-else>
					<div class="track-card" v-for="track in tracks" :key="track.id" @click="playTrack(track)">
						<img :src="track.imageUrl" alt="Track Cover" class="track__image" />
						<p class="track__name">{{ track.name }}</p>
						<p class="track__artist">{{ track.artistName }}</p>
					</div>
				</div>
			</div>

			<!-- Секція з плейлистами -->
			<div class="playlists-section">
				<a>Слухай найкращі локальні плейлисти</a>
				<div v-if="playlistsLoading">Завантаження плейлистів...</div>
				<div v-else-if="playlistsError">{{ playlistsError }}</div>
				<div v-else>
					<div class="playlists-list">
						<div
							class="playlist-card"
							v-for="playlist in playlists"
							:key="playlist.id"
						>
							<img
								:src="playlist.imageUrl"
								alt="Playlist Cover"
								class="playlist__image"
							/>
							<p class="playlist__name">{{ playlist.name }}</p>
							<p class="playlist__artists">
								{{ playlist.artists.slice(0, 2).join(', ') }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
		<TheFooter/>
	</div>
	<TrackPlay :selectedTrack="selectedTrack" />
	
</template>

<script>
import { onMounted, computed, ref } from 'vue';
import { useArtistsStore } from '@/store/artistStore';
import { usePlaylistStore } from '@/store/playlistStore';
import { fetchAccessToken } from '@/auth';

import TrackPlay from '@/components/track/TrackPlay.vue';
import TheFooter from '../TheFooter.vue';

export default {
	name: 'PlaylistCard',
	components: {
		TrackPlay,
		TheFooter
	},

	setup() {
		const artistsStore = useArtistsStore();
		const playlistStore = usePlaylistStore();

		const artists = computed(() => artistsStore.artists);
		const tracks = computed(() => playlistStore.tracks);
		const playlists = computed(() => playlistStore.playlists);
		const selectedTrack = computed(() => playlistStore.tracks[playlistStore.currentTrackIndex]);
		

		const artistsLoading = ref(true);
		const artistsError = ref(null);
		const tracksLoading = ref(true);
		const tracksError = ref(null);
		const playlistsLoading = ref(true);
		const playlistsError = ref(null);

		const isMusicActive = ref(false);
		const selectedArtist = ref(null);
		const selectedArtistSongs = ref([]);

		const toggleMusic = () => {
			isMusicActive.value = !isMusicActive.value;
		};

		const limitedArtists = computed(() => {
			const limit = 8;
			return artists.value.slice(0, limit);
		});

		const loadArtists = async () => {
			artistsLoading.value = true;
			try {
				if (!artistsStore.accessToken) {
					const token = await fetchAccessToken();
					artistsStore.setAccessToken(token);
				}

				if (artistsStore.accessToken) {
					await artistsStore.fetchRandomArtists();
				}
			} catch (err) {
				console.error('Помилка при отриманні артистів:', err);
				artistsError.value = 'Не вдалося завантажити артистів. Спробуйте ще раз пізніше.';
			} finally {
				artistsLoading.value = false;
			}
		};

		const loadTracks = async () => {
			tracksLoading.value = true;
			try {
				if (!playlistStore.accessToken) {
					const token = await fetchAccessToken();
					playlistStore.setAccessToken(token);
				}

				if (playlistStore.accessToken) {
					await playlistStore.fetchRandomTracks();
				}
			} catch (err) {
				console.error('Помилка при отриманні треків:', err);
				tracksError.value = 'Не вдалося завантажити треки. Спробуйте ще раз пізніше.';
			} finally {
				tracksLoading.value = false;
			}
		};

		const loadPlaylists = async () => {
			playlistsLoading.value = true;
			try {
				if (!playlistStore.accessToken) {
					const token = await fetchAccessToken();
					playlistStore.setAccessToken(token);
				}

				if (playlistStore.accessToken) {
					await playlistStore.fetchPlaylists();
				}
			} catch (err) {
				console.error('Помилка при отриманні плейлистів:', err);
				playlistsError.value = 'Не вдалося завантажити плейлісти. Спробуйте ще раз пізніше.';
			} finally {
				playlistsLoading.value = false;
			}
		};

		const selectArtist = artist => {
			selectedArtist.value = artist;
			selectedArtistSongs.value = [];
			loadArtistSongs(artist.id);
		};

		const playTrack = track => {
			playlistStore.currentTrackIndex = tracks.value.indexOf(track);
		};

		onMounted(() => {
			loadArtists();
			loadTracks();
			loadPlaylists();
		});

		return {
			artists,
			tracks,
			playlists,
			artistsLoading,
			artistsError,
			tracksLoading,
			tracksError,
			playlistsLoading,
			playlistsError,
			isMusicActive,
			toggleMusic,
			limitedArtists,
			selectArtist,
			selectedArtist,
			selectedArtistSongs,
			selectedTrack,
			playTrack,
		};
	}
};
</script>

<style scoped>
.artist-info {
	/* background: #1d1d1d; */
	color: white;
	padding: 15px;
	border-radius: 10px;
	margin-bottom: 20px;
	text-align: center;
	display: flex;
	align-items: center;
}

.artist-info__image {
	width: 150px;
height: 150px;
	border-radius: 50%;
	object-fit: cover;
	margin: 0 20px 10px 0;
	@media (min-width:678px) {
		width: 200px;
	height: 200px;
	margin: 0 40px 10px 0;
	}
}

.artist-info__name {
	font-weight: 900;
	font-size: 32px;
	@media (min-width: 678px) {
		font-size: 64px;
	}
}

.playlist {
	background: #121212;
	color: aliceblue;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	position: relative;
	padding: 0 15px 100px;
	box-sizing: border-box;
	margin: 55px 20px 0;
	border-radius: 10px;
	a {
		font-weight: 700;
		font-size: 22px;
		&:hover {
			text-decoration: underline;
		}
	}
}

.header {
	height: 70px;
	position: sticky;
	top: 0;
	background: #121212;
	z-index: 1000;
	padding: 10px;
	display: flex;
	justify-content: space-between;
	flex-shrink: 0;
	align-items: center;
}

.header button {
	color: #fff;
	font-weight: 700;
	background: rgba(65, 64, 64, 0.148);
	border-radius: 15px;
	height: 30px;
	width: 75px;
}

.header button:hover {
	background: rgba(93, 91, 91, 0.148);
}

.header button.active {
	background: #fff;
	color: #121212;
}

.playlist::-webkit-scrollbar {
	width: 4px;
}

.playlist::-webkit-scrollbar-thumb {
	background-color: #888;
	border-radius: 5px;
}

.playlist::-webkit-scrollbar-thumb:hover {
	background-color: #555;
}

.playlist::-webkit-scrollbar-track {
	background: #2a2a2a;
}

.playlist__info {
	flex-grow: 1;
	padding: 20px 0;
}

.artists-section {
	margin-bottom: 20px;
}

.artists-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
	margin: 0 0 50px 0;
}

.artist-card {
	background-color: #b3b3b30e;
	border-radius: 4px;
	text-align: center;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: start;
}

.artist__image {
	width: 50px;
	height: 50px;
	border-radius: 4px 0px 0px 4px;
	object-fit: cover;
}

.artist__name {
	color: white;
	font-size: 12px;
	margin: 0 0 0 10px;
	font-weight: 800;
}
.tracks-section {
	margin-top: 20px;
}
.tracks-list {
	display: flex;
	overflow-x: auto;
	scroll-behavior: smooth;
	gap: 10px;
	padding: 10px 0;
	scrollbar-width: none;
	-ms-overflow-style: none;
	border-radius: 10px;
}

.tracks-list::-webkit-scrollbar {
	display: none;
}

.track-card {
	border-radius: 10px;
	padding: 10px;
	text-align: start;
	min-width: 100px;
	flex: 0 0 auto;
}

.track__image {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	object-fit: cover;
	margin-bottom: 20px;
}

.track__name {
	margin-top: 5px;
	color: white;
	font-size: 16px;
	font-weight: 600;
	display: flex;
	width: 150px;
}

.track__artist {
	margin-top: 3px;
	color: gray;
	font-size: 12px;
}

.playlists-section {
	margin-top: 20px;
}
.playlists-list {
	display: flex;
	overflow-x: auto;
	scroll-behavior: smooth;
	gap: 10px;
	padding: 10px 0;
	scrollbar-width: none;
	-ms-overflow-style: none;
	border-radius: 10px;
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	height: 200px;
}
.playlist-card {
	flex: 0 0 150px;
	display: flex;
	flex-direction: column;
	border-radius: 4px;
	text-align: center;
	padding: 10px;
}

.playlist__image {
	display: block;
	border-radius: 4px;

	margin-bottom: 10px;
}

.playlist__name {
	color: white;
	font-size: 14px;
	font-weight: 700;
	text-align: start;
}

.playlist__artists {
	color: gray;
	font-size: 12px;
}

.playlist-list::-webkit-scrollbar {
	display: none;
}
</style>
