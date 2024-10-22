<template>
	<div class="track">
		<div
			class="main-info"
			v-if="selectedTrack"
		>
			<img
				:src="selectedTrack.imageUrl"
				alt="Album cover"
			/>
			<div class="track-info">
				<h2>{{ selectedTrack.name }}</h2>
				<p>{{ selectedTrack.artistName }}</p>
			</div>
			<div class="controls">
				<button
					@click="previousTrack"
					class="previous"
				>
					<img
						src="./track-img/back.png"
						alt="Previous"
					/>
				</button>
				<button
					@click="togglePlay"
					class="start-stop"
				>
					<img
						:src="isPlaying ? './src/assets/images/stop.png' : './src/assets/images/play.png'"
						alt="Play/Stop"
					/>
				</button>
				<button
					@click="nextTrack"
					class="next"
				>
					<img
						src="./track-img/next.png"
						alt="Next" class="next"
					/>
				</button>
			</div>
		</div>
		<div v-else>
			<p>No track selected</p>
		</div>
	</div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, watch } from 'vue';
import { usePlaylistStore } from '@/store/playlistStore';
import { fetchAccessToken } from '@/auth';

export default defineComponent({
	setup() {
		const trackStore = usePlaylistStore();
		const selectedTrack = computed(() => trackStore.tracks[trackStore.currentTrackIndex] || null);
		const isPlaying = ref(false);
		let audio = null; // Додали змінну для аудіо

		const togglePlay = () => {
			if (selectedTrack.value) {
				if (isPlaying.value) {
					audio.pause(); // Зупинка відтворення
				} else {
					audio = new Audio(selectedTrack.value.audioUrl); // Створення нового об'єкта Audio
					audio.play(); // Відтворення треку
				}
				isPlaying.value = !isPlaying.value; // Перемикаємо стан відтворення
			}
		};

		const nextTrack = () => {
			if (trackStore.currentTrackIndex < trackStore.tracks.length - 1) {
				trackStore.currentTrackIndex++;
			} else {
				trackStore.currentTrackIndex = 0; // Цикл на початок
			}
			if (isPlaying.value) {
				audio.pause(); // Зупинка попереднього треку
				togglePlay(); // Запуск нового треку
			}
		};

		const previousTrack = () => {
			if (trackStore.currentTrackIndex > 0) {
				trackStore.currentTrackIndex--;
			} else {
				trackStore.currentTrackIndex = trackStore.tracks.length - 1; // Цикл на кінець
			}
			if (isPlaying.value) {
				audio.pause(); // Зупинка попереднього треку
				togglePlay(); // Запуск нового треку
			}
		};

		const fetchTrack = async trackId => {
			try {
				await trackStore.fetchTrack(trackId);
			} catch (error) {
				console.error('Error fetching track:', error);
			}
		};

		onMounted(async () => {
			try {
				if (!trackStore.accessToken) {
					const token = await fetchAccessToken();
					trackStore.setAccessToken(token);
				}
				await trackStore.fetchRandomTracks(); // Завантаження треків
				trackStore.currentTrackIndex = 0; // Встановлюємо перший трек
			} catch (error) {
				console.error('Error during fetching token or track:', error);
			}
		});

		// Слідкуємо за змінами в selectedTrack
		watch(selectedTrack, (newTrack) => {
			if (isPlaying.value && audio) {
				audio.pause(); // Зупиняємо поточний трек, якщо він відтворюється
				audio = new Audio(newTrack.audioUrl); // Завантажуємо новий трек
				audio.play(); // Відтворюємо новий трек
			}
		});

		return {
			selectedTrack,
			isPlaying,
			togglePlay,
			nextTrack,
			previousTrack
		};
	}
});
</script>



<style scoped>
.track {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	z-index: 1000000000;
	padding: 10px 20px;
	height: 80px;
	display: flex;
	align-items: center;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
	overflow: hidden;
	background-color: rgb(86, 84, 84);
	font-size: 12px;
  margin: 0 0 5px 0px;
	@media (min-width: 678px) {
		background-color: black;
		font-size: 16px;
    margin: 0 0 0 0;
  
	}
}
.main-info {
	display: flex;
	justify-content: space-between;
	width: 100%;
}
.track img {
	margin: 0 15px 0 0;
	max-width: 50px;
	max-height: 50px;
	border-radius: 5px;
}
.track-info {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
h2 {
	font-size: 1.5rem;
	color: #ffffff;
  @media (min-width:678px) {
    font-size: 1.2rem;
  }
}
p {
	margin: 5px 0;
	font-size: 1.2rem;
	color: #b3b3b3;
  @media (min-width:678px) {
    font-size: 0.8rem;
    margin: 0px 0;
  }
}

.controls {
	display: flex;
	justify-content: center;
	align-items: center;
}
button {
	cursor: pointer;
	background-color: transparent;
	border-radius: 5px;
	transition: background-color 0.3s, transform 0.2s;
	width: 50px;
	height: 50px;
}
button img {
	width: 40px;
	height: 40px;
}
button:hover {
	transform: scale(1.05);
}
button:active {
	transform: scale(0.95);
}
</style>
