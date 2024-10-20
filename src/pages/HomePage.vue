<template>
	<div class="home">
		<PlaylistCard
			v-if="artists.length > 0"
			:artist="artists[0]"
		/>

		<!-- TrackPlay має показувати тільки один трек -->
		<TrackPlay @select-track="selectTrack" />
		<TheFooter/>
	</div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useArtistsStore } from '@/store/artistStore';
import { useTrackStore } from '@/store/trackStore';
import { usePlaylistStore } from '@/store/playlistStore';
import TrackPlay from '@/components/track/TrackPlay.vue';
import PlaylistCard from '@/components/playlist/PlaylistCard.vue';

export default defineComponent({
	name: 'HomePage',
	components: {
		PlaylistCard,
		TrackPlay
	},
	setup() {
		const artistsStore = useArtistsStore();
		const trackStore = useTrackStore();
		const playlistStore = usePlaylistStore();

		// Отримання артистів
		const artists = computed(() => artistsStore.artists);

		const selectTrack = async trackId => {
			try {
				await trackStore.fetchTrack(trackId);
				console.log('Track selected:', trackId);
			} catch (error) {
				console.error('Error fetching track:', error);
			}
		};

		return {
			artists, 
			selectTrack
		};
	}
});
</script>

<style scoped>
.home {
	display: flex;
	color: aliceblue;
	background: #121212;
	overflow: hidden;
	flex: 1 1 auto;
	flex-direction: column;
	width: 100%;
	@media (min-width:678px) {
		background:black;
	}
}

.playlist-container {
	display: flex;
	flex-direction: row;
	overflow-x: auto;
	
}
</style>
