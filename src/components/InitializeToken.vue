<template>
	<div></div>
	<!-- Можна залишити пустим -->
</template>

<script>
import { fetchAccessToken } from '@/auth'; // Імпорт функції отримання токена
import { useTrackStore } from '@/store/trackStore'; // Імпорт функції для отримання токена

async function initialize() {
	const trackStore = useTrackStore();
	try {
		const accessToken = await fetchAccessToken();
		trackStore.setAccessToken(accessToken); // Збереження токена в store
	} catch (error) {
		console.error('Failed to initialize:', error);
	}
}

initialize();
</script>

<style scoped>
/* Ваші стилі, якщо потрібно */
</style>
