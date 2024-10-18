<template>
	<header class="header">
		<a
			class="header__logo"
			href="#"
		>
			<img
				src="../assets/images/logo.png"
				alt="logo"
			/>
		</a>
		<div
			class="header__search-container"
			:class="{ 'show-search': showSearchInput }"
		>
			<input
				type="text"
				placeholder="Що хочете ввімкнути?"
				v-model="searchQuery"
				@keydown.enter="handleSearch"
			/>
			<button @click="toggleSearch">
				<img
					src="../assets/images/search.png"
					alt="search"
				/>
			</button>
		</div>
	</header>

	<!-- Відображення результатів пошуку -->
	<div
		v-if="searchResults.length > 0"
		class="search-results"
	>
		<button
			class="close-btn"
			@click="closeResults"
		>
			✖
		</button>

		<!-- Відображення інформації про вибраний трек -->
		<div
			v-if="selectedTrack"
			class="track-info"
		>
			<h2>{{ selectedTrack.name }}</h2>
			<p>{{ selectedTrack.artist }}</p>
			<img
				:src="selectedTrack.imageUrl"
				alt="Selected track image"
			/>
		</div>

		<ul>
			<li
				v-for="track in searchResults"
				:key="track.id"
				@click="selectTrack(track)"
			>
				<img
					:src="track.imageUrl"
					alt="Track image"
				/>
				<div>
					<h3>{{ track.name }}</h3>
					<p>{{ track.artist }}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { fetchAccessToken } from '@/auth';

export default {
	name: 'TheHeader',
	data() {
		return {
			searchQuery: '',
			searchResults: [],
			selectedTrack: null,
			showSearchInput: false // Додано змінну для контролю відображення інпуту
		};
	},
	methods: {
		async handleSearch() {
			try {
				const results = await this.searchTracks(this.searchQuery);
				this.searchResults = results;
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		},
		async searchTracks(query) {
			const accessToken = await fetchAccessToken();
			const response = await fetch(
				`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			);

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			return data.tracks.items.map(track => ({
				id: track.id,
				name: track.name,
				artist: track.artists.map(artist => artist.name).join(', '),
				imageUrl: track.album.images[0]?.url
			}));
		},
		closeResults() {
			this.searchResults = [];
			this.selectedTrack = null;
		},
		selectTrack(track) {
			this.selectedTrack = track;
			this.$nextTick(() => {
				const trackInfoElement = document.querySelector('.track-info');
				trackInfoElement.style.backgroundImage = `url(${track.imageUrl})`;
			});
		},
		toggleSearch() {
			if (window.innerWidth < 678) {
				this.showSearchInput = !this.showSearchInput;
			} else {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: black;
	width: 100%;
	z-index: 10000000000;
	height: 60px;
	overflow: hidden;

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
			color: #fff;
			display: none; /* Сховано за замовчуванням */

			&:focus {
				border: 2px solid #fff;
				border-radius: 500px;
				padding-left: 40px;
			}
		}

		button {
			width: 40px;
			height: 40px;
			background-color: #1f1f1f;
			border-radius: 500px;
			margin: 0px 40px 0 15px;
			cursor: pointer;

			&:hover {
				border: 2px solid #fff;
			}
		}

		&.show-search input {
			display: block; /* Відображення при натисканні на кнопку */
		}

		@media (min-width: 678px) {
			input {
				display: block; /* Постійне відображення інпуту на великих екранах */
				width: 350px;
			}
		}
	}
}
.search-results {
	position: absolute;
	top: 60px;
	z-index: 20000;
	background: #121212;
	color: aliceblue;
	height: 80vh;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	margin: 0px 20px 0px;
	border-radius: 10px;
	height: 85%;
	width: 90%;
	@media (min-width: 678px) {
		width: 62%;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		justify-content: space-around;
	}

	li {
		display: flex;
		align-items: center;
		padding: 0 15px ;
		width: 100%;
		cursor: pointer;
		transition: transform 0.3s ease;
		justify-content: start;
		height: 60px;
		margin: 0 10px;

		&:hover {
			transform: scale(1.05);
			background-color: #333;
		}

		img {
			width: 50px;
			height: 50px;
			margin-bottom: 10px;
		}

		h3 {
			display: flex;
			justify-content: start;
			margin: 0px 0 0px 15px;
			font-size: 16px;
			color: #fff;
		}

		p {
			margin: 0;
			font-size: 14px;
			color: #aaa;
			margin: 0 0 0 15px;
		}
	}

	.track-info {
	position: sticky;
	top: 0;
	background-color: rgba(31, 31, 31, 0.8); 
	background-image: url(''); 
	background-size: cover; 
	background-position: center; 
	padding: 20px;
	margin-bottom: 15px;
	color: #fff;
	text-align: center;
	z-index: 1;
	height: 300px;

	h2 {
		margin: 80px  0 0px;
		font-size: 4.5rem;
		font-weight: 900;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		display: flex;
		justify-content: start;
		
	}

	p {
		margin: 5px 0;
		font-size: 18px;
		display: flex;
		justify-content: start;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
	}

	img {
		display: none;
	}
}


	.close-btn {
		background: transparent;
		border: none;
		color: rgb(0, 0, 0);
		font-size: 30px;
		cursor: pointer;
		position: fixed;
		right: 20px;
		top: 70px;
		z-index: 30000;
	}
}
</style>
