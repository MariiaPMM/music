<template>
  <div class="playlist">
    <div class="header">
      <button class="header__button">Моя медіа</button>
      <p>Випадкові артисти</p>
    </div>
    <div class="playlist__info">
      <!-- Секція для артистів -->
      <div class="artists-section">
        <h2>Артисти</h2>
        <div v-if="artistsLoading">Завантаження артистів...</div>
        <div v-else-if="artistsError">{{ artistsError }}</div>
        <div v-else class="artists-list">
          <div
            class="artist-card"
            v-for="artist in artists"
            :key="artist.id"
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
    </div>
  </div>
</template>

<script>
import { onMounted, computed, ref } from 'vue';
import { useArtistsStore } from '@/store/artistStore';
import { fetchAccessToken } from '@/auth';

export default {
  name: 'PlaylistCard',
  setup() {
    const artistsStore = useArtistsStore();
    const artists = computed(() => artistsStore.artists);
    const artistsLoading = ref(true);
    const artistsError = ref(null);

    // Завантаження артистів
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

    onMounted(async () => {
      await loadArtists();
    });

    return {
      artists,
      artistsLoading,
      artistsError,
    };
  }
};
</script>

<style scoped>
.playlist {
  background: #121212;
  color: aliceblue;
  height: 100vh; /* Займає всю висоту екрану */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box; /* Включає відступи у ширину */
  margin: 55px 20px 0;
  border-radius: 10px;
}

.playlist__info {
  flex-grow: 1; /* Розтягується на всю доступну висоту */
  padding: 20px 0;
}

.artists-section {
  margin-bottom: 20px;
}

.artists-list {
  display: flex;
  flex-wrap: wrap; /* Дозволяє елементам займати кілька рядків */
  gap: 10px; /* Відстань між картками */
}

.artist-card {
  background-color: #181818; /* Темніший фон для карток */
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  width: 100px; /* Фіксована ширина картки */
}

.artist__image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  object-fit: cover; /* Зображення заповнює блок без спотворень */
}

.artist__name {
  margin-top: 5px;
  color: white;
  font-size: 14px;
}
</style>