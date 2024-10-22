<template>
	<div class="page">
	 
		<TheNavigation :is-open="isNavOpen" />
		<div class="page__content">
			<TheHeader @on-toggle="isNavOpen = !isNavOpen" />
			<main class="page__main">
				<RouterView #default="{ Component }">
					<Transition
						name="fade"
						mode="out-in"
					>
						<component :is="Component" />
					</Transition>
				</RouterView>
			</main>
			<InitializeToken @token-initialized="onTokenInitialized" />
			<Loader v-if="isLoading" :duration="12000" />
			<HomePage />
			<TheFooter />
		</div>
	</div>
</template>

<script>
import TheNavigation from '@/components/TheNavigation.vue';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import { useTrackStore } from '@/store/trackStore';
import InitializeToken from '@/components/InitializeToken.vue';
import HomePage from '../pages/HomePage.vue';
import Loader from '@/components/Loader.vue'; // Додаємо компонент лоадера

export default {
	name: 'MainLayout',
	components: {
		TheNavigation,
		TheHeader,
		TheFooter,
		InitializeToken,
		HomePage,
		Loader
	},
	setup() {
		const trackStore = useTrackStore();

		const onTokenInitialized = async () => {
			try {
				await trackStore.fetchTrack('11dFghVXANMlKmJXsNCbNl');
			} catch (error) {
				console.error('Error fetching track:', error);
			}
		};

		return {
			onTokenInitialized
		};
	},
	data() {
		return {
			isNavOpen: false,
			isLoading: true // Додаємо змінну для контролю лоадера
		};
	},
	mounted() {
		// Симуляція затримки для лоадера
		setTimeout(() => {
			this.isLoading = false;
		}, 3000); // Лоадер буде активним 3 секунди
	}
};
</script>

<style lang="scss" scoped>
.page {
	background: #121212;
	display: flex;
	align-items: flex-start;
	height: 100%;
	overflow: hidden;
	padding: 5px;
	width: 100%;
	position: relative; // Важливо для лоадера

	@media (min-width: 678px) {
		background: black;
	}
	&__content {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}
	&__main {
		flex: 1 1 auto;
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
