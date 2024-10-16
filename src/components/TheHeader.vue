<template>
	<header class="header">
		<a
			class="header__logo"
			src="#"
		>
			<img
				src="../assets/images/logo.png"
				alt="logo"
			/>
		</a>
		<div class="header__search-container">
			<input
				type="text"
				placeholder="Що хочете ввімкнути?"
				v-model="searchQuery"
				@keydown.enter="handleSearch"
			/>
			<button @click="handleSearch">
				<img
					src="../assets/images/search.png"
					alt="search"
				/>
			</button>
		</div>
	</header>
</template>

<script>


export default {
	name: 'TheHeader',
	components: {},
	emits: ['on-toggle'],
	data() {
		return {
			searchQuery: '' // Додано змінну для зберігання пошукового запиту
		};
	},
	methods: {
		handleSearch() {
			// Логіка пошуку за значенням searchQuery
			console.log('Searching for:', this.searchQuery);
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 0;
	left: 0;
	height: calc(48px + var(--panel-gap) * 2);
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: black;
	width: 100%;
	z-index: 100;
	height: 60px;
	// margin: 50px;

	&__logo {
		img {
			cursor: pointer;
			max-height: 35px;
			max-width: 35px;
			margin: 0px 10px 0px 20px;
		}
	}
	&__search-container {
		display: flex;
		align-items: center;

		input {
			cursor: pointer;
			border-radius: 500px;
			border: none;
			height: 40px;
			background: url('../assets/images/search.png') no-repeat left center;
			background-color: #1f1f1f;
			background-size: 20px;
			padding: 0px 10px;
			background-position: 6px center;
			padding-left: 40px;
			font-weight: 700;
			@media (min-width: 768px) {
				width: 350px;
			}
			&:focus {
				border: 2px solid #fff;
				border-radius: 500px;
				color: #fff;
				padding: 0 0 0 25px;
				padding-left: 40px;
			}
		}
		button {
			width: 40px;
			height: 40px;
			background-color: #1f1f1f;
			border-radius: 500px;
			margin: 0px 40px 0 15px;
			&:hover {
				border: 2px solid #fff;
			}
		}
	}
}
</style>
