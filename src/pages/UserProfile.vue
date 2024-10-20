<template>
	<div
		v-if="isProfileVisible"
		class="user-profile"
	>
		<button
			class="back-btn"
			@click="closeProfile"
		>
			<img
				src="../assets/images/home.png"
				alt="Avatar"
			/>
		</button>
		<h2>{{ isLoggedIn ? 'Профіль ' : isRegistering ? 'Реєстрація' : 'Вхід' }}</h2>

		<div
			class="profile"
			v-if="isLoggedIn && !isEditing"
		>
			<img
				v-if="userProfile.avatar"
				:src="userProfile.avatar"
				alt="User Avatar"
				class="profile__avatar"
			/>
			<div class="profile__info">
				<p class="profile__name">{{ userProfile.username }}</p>
				<button
					class="profile__btn"
					@click="logout"
				>
					Вийти
				</button>
				<button
					class="profile__btn"
					@click="isEditing = true"
				>
					Редагувати профіль
				</button>
			</div>
		</div>

		<div
			class="form"
			v-else-if="!isLoggedIn"
		>
			<form @submit.prevent="handleSubmit">
				<div>
					<label for="username">Ім'я користувача:</label>
					<input 
						type="text"
						id="username"
						v-model="username"
						required
					/>
				</div>
				<div>
					<label for="email">Email:</label>
					<input
						type="email"
						id="email"
						v-model="email"
						required
					/>
				</div>
				<div>
					<label for="password">Пароль:</label>
					<input
						type="password"
						id="password"
						v-model="password"
						required
					/>
				</div>
				<div v-if="isRegistering">
					<label for="avatar">Аватар:</label>
					<input
						type="file"
						@change="handleAvatarUpload"
						accept="image/*"
					/>
				</div>
				<button class="form__btn" type="submit">{{ isRegistering ? 'Зареєструватись' : 'Увійти' }}</button>
			</form>
			<div>
				<button class="form__btn_info" @click="toggleRegister">
					{{ isRegistering ? 'Вже зареєстровані? Увійти' : 'Немає акаунту? Зареєструйтесь' }}
				</button>
			</div>
			<p
				v-if="errorMessage"
				class="error"
			>
				{{ errorMessage }}
			</p>
		</div>

		<!-- Форма редагування профілю -->
		<div
			v-if="isEditing"
			class="form"
		>
			<h3>Редагувати профіль</h3>
			<form @submit.prevent="updateProfile">
				<div>
					<label for="edit-username">Ім'я користувача:</label>
					<input
						type="text"
						id="edit-username"
						v-model="userProfile.username"
						required
					/>
				</div>
				<div>
					<label for="edit-email">Email:</label>
					<input
						type="email"
						id="edit-email"
						v-model="userProfile.email"
						required
					/>
				</div>
				<div>
					<label for="edit-avatar">Аватар:</label>
					<input
						type="file"
						@change="handleAvatarUpload"
						accept="image/*"
					/>
				</div>
				<button
					class="form__btn"
					type="submit"
				>
					Зберегти зміни
				</button>
				<button
					class="form__btn"
					@click="isEditing = false"
				>
					Скасувати
				</button>
			</form>
		</div>
	</div>
</template>

<script>
export default {
	name: 'UserProfile',
	data() {
		return {
			isProfileVisible: true,
			isLoggedIn: false,
			isRegistering: false,
			isEditing: false, // Додано для редагування
			username: '',
			email: '',
			password: '',
			userProfile: {
				avatar: '',
				username: '',
				email: ''
			},
			errorMessage: ''
		};
	},
	mounted() {
		const storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
		if (storedUserProfile) {
			this.userProfile = storedUserProfile;
			this.isLoggedIn = true;
		}
	},
	methods: {
		handleSubmit() {
			if (this.isLoggedIn) {
				this.logout();
			} else {
				this.isRegistering ? this.register() : this.login();
			}
		},
		toggleRegister() {
			this.isRegistering = !this.isRegistering;
			this.errorMessage = '';
		},
		login() {
			const storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
			if (
				storedUserProfile &&
				storedUserProfile.username === this.username &&
				storedUserProfile.password === this.password
			) {
				this.userProfile = storedUserProfile;
				this.isLoggedIn = true;
				this.errorMessage = '';
				this.$emit('updateAvatar', this.userProfile.avatar);
				this.goToProfile();
			} else {
				this.errorMessage = "Неправильне ім'я користувача або пароль.";
			}
		},
		register() {
			const storedUserProfile = JSON.parse(localStorage.getItem('userProfile'));
			if (!storedUserProfile) {
				this.userProfile = {
					username: this.username,
					email: this.email,
					password: this.password,
					avatar: this.userProfile.avatar
				};
				this.isLoggedIn = true;
				localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
				this.$emit('updateAvatar', this.userProfile.avatar);
				this.errorMessage = '';
			} else {
				this.errorMessage = "Користувач з таким ім'ям вже зареєстрований.";
			}
		},
		logout() {
			this.isLoggedIn = false;
			this.username = '';
			this.email = '';
			this.password = '';
			this.userProfile.avatar = '';
			this.$emit('updateAvatar', '');
		},
		handleAvatarUpload(event) {
			const file = event.target.files[0];
			if (file) {
				this.userProfile.avatar = URL.createObjectURL(file);
				this.$emit('updateAvatar', this.userProfile.avatar);
			} else {
				this.userProfile.avatar = '';
				this.$emit('updateAvatar', '');
			}
		},
		closeProfile() {
			this.isProfileVisible = false;
		},
		goToProfile() {
			this.isProfileVisible = true;
		},
		updateProfile() {
			// Оновлюємо профіль користувача
			localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
			this.isEditing = false; // Закриваємо режим редагування
			this.$emit('updateAvatar', this.userProfile.avatar); // Оновлюємо аватар в заголовку
		}
	}
};
</script>

<style scoped>
.user-profile {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: #1f1f1f;
	color: white;
	padding: 20px;
	z-index: 2000;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.profile {
	display: flex;
	color: rgb(255, 255, 255);
	width: 100%;

	padding: 20px;

	
	flex-direction: column;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border-top: 1px solid #ffffff;
	@media (min-width: 678px) {
		flex-direction: row;
		align-items: start;
	}
}
.profile__info {
	display: flex;
	flex-direction: column;
	margin: 0 30px 0;
}
.profile__name {
	font-size: 3rem;
	font-weight: 900;
	text-align: center;
	margin: 30px 0;
	@media (min-width: 678px) {
		font-size: 10rem;
		font-weight: 900;
	}
}

.profile__email {
	font-size: 40px;
	font-weight: 700;
	margin: 0 0 100px;
}

.profile__btn {
	display: flex;
	width: 200px;
	height: 30px;
	background: #4a4a4a;
	border: 1px solid white;
	color: rgb(255, 255, 255);
	font-size: 16px;
	margin: 10px;
	font-weight: 600;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 15px 5px rgb(85, 85, 85);
	&:hover {
		background: #838181;
		box-shadow: 0 0 20px 5px rgb(36, 36, 36);
	}
}

.profile__avatar {
	width: 150px;
	height: 150px;
	border-radius: 50%;
	object-fit: cover;
	margin-top: 20px;
	border: 3px solid #ffffff;
	box-shadow: 0 0 15px 4px rgb(85, 85, 85);
	@media (min-width: 678px) {
		width: 200px;
		height: 200px;
	}
}

.user-profile h2 {
	display: flex;
	color: #ffffffd8;
	font-size: 2rem;
	margin-bottom: 20px;
	font-weight: 800;
	@media (min-width: 678px) {
		font-size: 3rem;
	}
}

.user-profile h3 {
	margin-bottom: 20px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.form {
	display: flex;
	flex-direction: column;
	color: black;
	background: #ffffff;
	padding: 20px;
	width: 320px;
	justify-content: center;
	align-items: center;
  margin: 50px 0 0 0 ;
}

.user-profile form div {
	margin-bottom: 10px;
}

.user-profile form label {
	margin-bottom: 5px;
	font-size: 1.5rem; 
}

.user-profile form input {
	padding: 10px;
	border: none;
	border-radius: 4px;
	background-color:rgb(232, 240, 254);
	color: rgb(0, 0, 0);
	font-size: 1.5rem;
	width: 280px;
	font-size: 16px;
}
.form__btn {
	display: flex;
	width: 200px;
	height: 30px;
	background: #4a4a4a;
	border: 1px solid white;
	color: rgb(255, 255, 255);
	font-size: 16px;
	margin: 10px 0;
	font-weight: 600;
	border-radius: 5px;
	justify-content: center;
	align-items: center;
	width: 280px;
	&:hover {
		box-shadow: 0 0 15px 3px rgb(36, 36, 36);
	}
}

.user-profile form button:hover {
	background-color: #272727;
}

.error {
	color: red;
	margin-top: 10px;
	font-size: 1.5rem; 
}
.form__btn_info{
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}
.back-btn {
	position: absolute;
	top: 20px;
	left: 20px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: none;
	overflow: hidden;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		border: 2px solid rgb(255, 255, 255);
		box-shadow: 0 0 5px 2px white;
	}
}
.back-btn img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
