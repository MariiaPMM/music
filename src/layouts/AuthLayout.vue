<template>
	<main class="auth">
		<h1 class="auth__title">Log in</h1>
		<div class="auth__content">
			<RouterView />
		</div>
	</main>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.auth {
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(91, 140, 232, 0.25);
	flex-direction: column;
	// .auth__content
	&__content {
		background-color: $white;
		padding: 16px;
		border-radius: 3px;
		width: 300px;
	}
	&__title {
		color: $black;
		font-size: font-rem(30);
		margin: 0 0 20px;
		font-weight: 600;
	}
}
</style>
