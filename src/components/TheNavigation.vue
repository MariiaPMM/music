<template>
	<div class="container">
		<div class="header">
			<h1 class="header-title">Моя медіатека</h1>
			<div v-if="loading"></div>
			<div v-if="error" class="error">
				{{ error }}
			</div>
		</div>

		<div class="artist-list">
			<div
				v-for="artist in artists"
				:key="artist.id"
				class="artist"
				@click="selectArtist(artist)"
			>
				<img
					:src="artist.imageUrl"
					alt="Artist Image"
					class="artist-image"
				/>
				<div class="artist-info">
					<p class="artist-name">{{ artist.name }}</p>
					<p class="artist-subtitle">Виконавець</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent, onMounted, computed, ref } from 'vue';
import { useArtistsStore } from '../store/artistStore';
import { fetchAccessToken } from '../auth';

export default defineComponent({
	name: 'TheNavigation',
	props: {
		onArtistSelect: Function // Передаємо подію як пропс
	},
	setup(props) {
		const artistsStore = useArtistsStore();
		const artists = computed(() => artistsStore.artists);
		const loading = ref(true);
		const error = ref(null);

		// Функція для вибору артиста
		const selectArtist = artist => {
			props.onArtistSelect(artist); // Викликаємо метод з пропсів для передачі артиста
		};

		onMounted(async () => {
			try {
				if (!artistsStore.accessToken) {
					const token = await fetchAccessToken();
					artistsStore.setAccessToken(token);
				}

				if (artistsStore.accessToken) {
					await artistsStore.fetchRandomArtists();
				}
			} catch (err) {
				console.error('Error during fetching token or artists:', err);
				error.value = 'Failed to load artists. Please try again later.';
			} finally {
				loading.value = false;
			}
		});

		return {
			artists,
			loading,
			error,
			selectArtist
		};
	}
});
</script>


<style lang="scss" scoped>
.container {
	display: none;
	
	@media (min-width: 678px) {
		display: flex;
		flex-direction: column;
		background: #121212;
		border-radius: 10px;
		margin: 55px 0 0px 0;
		height: 90%;
		z-index: 1000; 
	}
}

.header {
	flex-shrink: 0; 
	width: 350px;
	background-color: #121212;
	padding: 20px;
	border-radius: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	.header-title {
		color: #ffffff;
		font-size: 16px;
		margin: 10px;
	}

	.error {
		color: red; 
		margin-top: 10px; 
	}
}

.artist-list {
	overflow-y: auto; 
	flex-grow: 1; 
	

	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #888; 
		border-radius: 10px; 
	}

	&::-webkit-scrollbar-thumb:hover {
		background-color: #555; 
	}

	&::-webkit-scrollbar-track {
		background-color: #222; 
	}
}

.artist {

	display: flex;
	align-items: center;
	margin: 0 10px 10px;
	padding: 10px;
	&:hover {
		background-color: #282828;
		border-radius: 5px;
		cursor: pointer;
	}
}

.artist-info {
	display: flex;
	flex-direction: column;
}

.artist-subtitle {
	color: #656464;
	font-weight: 700;
}

.artist-image {
	width: 50px; 
	height: 50px; 
	border-radius: 50%; 
	margin-right: 10px; 
}

.artist-name {
	color: #ffffff; 
	font-weight: 700;
	font-size: 14px;
}
</style>
