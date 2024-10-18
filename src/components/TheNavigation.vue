<template>
	<div class="container">
		<div class="header">
			<h1 class="header-title">Моя медіатека</h1>

			<button class="title__button">
				<img
					src="../assets/images/plus.png"
					alt="plus"
				/>
			</button>
			<button class="title__button">
				<img
					src="../assets/images/right-arrow.png"
					alt="arrow"
				/>
			</button>
			<div v-if="loading"></div>
			<div
				v-if="error"
				class="error"
			>
				{{ error }}
			</div>
		</div>
		<div class="artist-list">
			<div
				v-for="artist in artists"
				:key="artist.id"
				class="artist"
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
	setup() {
		const artistsStore = useArtistsStore();

		const artists = computed(() => artistsStore.artists); // Повертаємо артистів
		const loading = ref(true); // Статус завантаження
		const error = ref(null); // Повідомлення про помилку

		onMounted(async () => {
			try {
				if (!artistsStore.accessToken) {
					const token = await fetchAccessToken();
					artistsStore.setAccessToken(token);
				}

				// Викликаємо fetchRandomArtists тільки якщо токен встановлений
				if (artistsStore.accessToken) {
					await artistsStore.fetchRandomArtists();
				}
			} catch (err) {
				console.error('Error during fetching token or artists:', err);
				error.value = 'Failed to load artists. Please try again later.';
			} finally {
				loading.value = false; // Завантаження завершено
			}
		});

		return {
			artists,
			loading,
			error
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
	flex-shrink: 0; /* Не дозволяємо шапці зменшуватися */
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
		color: red; /* Колір помилки */
		margin-top: 10px; /* Відступ для повідомлення про помилку */
	}
}

.artist-list {
	overflow-y: auto; /* Додаємо прокрутку по вертикалі для списку артистів */
	flex-grow: 1; /* Дозволяємо списку артистів займати доступний простір */
	
	/* Кастомізація скролу */
	&::-webkit-scrollbar {
		width: 10px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: #888; /* Колір смуги прокрутки */
		border-radius: 10px; /* Заокруглені краї */
	}

	&::-webkit-scrollbar-thumb:hover {
		background-color: #555; /* Колір смуги при ховері */
	}

	&::-webkit-scrollbar-track {
		background-color: #222; /* Колір фону смуги прокрутки */
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
	width: 50px; /* Ширина зображення артиста */
	height: 50px; /* Висота зображення артиста */
	border-radius: 50%; /* Кругла форма зображення */
	margin-right: 10px; /* Відступ праворуч від зображення */
}

.artist-name {
	color: #ffffff; /* Колір тексту */
	font-weight: 700;
	font-size: 14px; /* Розмір шрифту */
}
</style>
