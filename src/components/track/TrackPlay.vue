<template>
  <div class="track">
    <div class="main-info" v-if="selectedTrack">
      <img :src="selectedTrack.imageUrl" alt="Album cover" />
      <div class="track-info">
        <h2>{{ selectedTrack.name }}</h2>
        <p>{{ selectedTrack.artistName }}</p>
      </div>
      <div class="controls">
        <button @click="previousTrack" class="previous">
          <img src="./track-img/previous.svg" alt="Previous" />
        </button>
        <button @click="togglePlay" class="start-stop">
          <img :src="isPlaying ? './src/assets/images/stop.png' : './src/assets/images/play.png'" alt="Play/Stop" />
        </button>
        <button @click="nextTrack" class="next">
          <img src="./track-img/next.png" alt="Next" />
        </button>
      </div>
    </div>
    <div v-else>
      <p>No track selected</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref } from 'vue';
import { usePlaylistStore } from '@/store/playlistStore';
import { fetchAccessToken } from '@/auth';

export default defineComponent({
  setup() {
    const trackStore = usePlaylistStore();
    const selectedTrack = computed(() => trackStore.tracks[trackStore.currentTrackIndex] || null);
    const isPlaying = ref(false);

    const togglePlay = () => {
      isPlaying.value = !isPlaying.value;
    };

    const nextTrack = () => {
      if (trackStore.currentTrackIndex < trackStore.tracks.length - 1) {
        trackStore.currentTrackIndex++;
      } else {
        trackStore.currentTrackIndex = 0; // Цикл на початок
      }
    };

    const previousTrack = () => {
      if (trackStore.currentTrackIndex > 0) {
        trackStore.currentTrackIndex--;
      } else {
        trackStore.currentTrackIndex = trackStore.tracks.length - 1; // Цикл на кінець
      }
    };

    const fetchTrack = async (trackId) => {
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

    return {
      selectedTrack,
      isPlaying,
      togglePlay,
      nextTrack,
      previousTrack,
    };
  },
});
</script>


<style scoped>
.track {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  padding: 10px 20px;
  background-color: #191414;
  height: 80px;
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
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
}
p {
  margin: 5px 0;
  font-size: 1.2rem;
  color: #b3b3b3;
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
