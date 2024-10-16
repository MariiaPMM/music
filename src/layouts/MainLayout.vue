<template>
	<div class="page">
		<TheNavigation :is-open="isNavOpen"/>
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
			<HomePage/>
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

export default {
	name: 'MainLayout',
	components: {
		TheNavigation,
		TheHeader,
		TheFooter,
		InitializeToken,
		HomePage
	},
	setup() {
		const trackStore = useTrackStore();

		// Функція для виклику треку після ініціалізації токена
		const onTokenInitialized = async () => {
			try {
				await trackStore.fetchTrack('11dFghVXANMlKmJXsNCbNl'); // Замініть на потрібний ID
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
			isNavOpen: false
		};
	}
};
</script>

<style lang="scss" scoped>
.page {
	background: black;
	display: flex;
	align-items: flex-start;
	height: 100%;
	overflow: hidden;
	padding: 5px;
	width: 100%;
	
	&__content {
		display: flex;
		flex-direction: column;
		// width: 100%;
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
