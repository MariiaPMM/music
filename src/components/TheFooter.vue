<template>
	<footer>
		<div class="footer__container">
			<div class="footer__info">
				<ul>
					<li><strong>Компанія</strong></li>
					<a><li>Про нас</li></a>
					<a><li>Вакансії</li></a>
					<a><li>For the Record</li></a>
				</ul>
				<ul>
					<li><strong>Повідомлення</strong></li>
					<a><li>Для виконавців</li></a>
					<a><li>Для розробників</li></a>
					<a><li>Реклама</li></a>
					<a><li>Для інвесторів</li></a>
					<a><li>Для вендорів</li></a>
				</ul>
				<ul>
					<li><strong>Корисні посилання</strong></li>
					<a><li>Справка</li></a>
					<a><li>Безкоштовні мобільні додатки</li></a>
				</ul>
				<ul>
					<li><strong>Плани Spotufy</strong></li>
					<a><li>Індивідуальна підписка Premium Spotify</li></a>
					<a><li>Premium для двох</li></a>
					<a><li>Premium для сім'ї</li></a>
					<a><li>Premium для студентів</li></a>
					<a><li>Безкоштовна версія Spotify</li></a>
				</ul>
				<div class="footer__links">
					<a
						class="link__img"
						href="#"
					>
						<img
							src="../assets/images/instagram.png"
							alt="instagram"
						/>
					</a>
					<a
						class="link__img"
						href="#"
					>
						<img
							src="../assets/images/twitter.png"
							alt="twitter"
						/>
					</a>
					<a
						class="link__img"
						href="#"
					>
						<img
							src="../assets/images/facebook.png"
							alt="facebook"
						/>
					</a>
				</div>
			</div>
			<div class="footer__down">
				<ul>
					<a href="#">
						<li>Юридична інформація</li>
					</a>
					<a href="#">
						<li>Центр безпеки та конфіденційності</li>
					</a>
					<a href="#">
						<li>Політика конфіденційності</li>
					</a>
					<a href="#">
						<li>Файли cookie</li>
					</a>
					<a href="#">
						<li>Проо рекламу</li>
					</a>
					<a href="#">
						<li>Спеціальні можливості</li>
					</a>
				</ul>
				<div><p>© 2024 Spotify AB</p></div>
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'TheFooter'
};
</script>

<style scoped>
footer {
	color: #fff;
	padding: 0 20px 50px;
	text-align: center;
	height: 500px;
	display: flex;
}
.footer__container {
	display: flex;
	flex-direction: column;
	width: 100%;
	font-weight: 700;
}
.footer__info {
	border-bottom: 1px solid rgb(154, 154, 154);
	margin: 40px 0;
	color: rgb(197, 195, 195);
	display: flex;
	text-align: center;
	flex-direction: column;
	font-weight: 700;
	@media (min-width: 678px) {
		flex-direction: row;
		justify-content: space-between;
		text-align: start;
	}
	li {
		margin: 0 0 10px;
		
	}
	ul {
		display: flex;
		flex-direction: column;
		text-align: center;
		margin: 0 10px 20px 0;
		@media (min-width: 678px) {
			text-align: start;
			margin: 0 10px 20px 0;
		}
		a {
			margin: 0 0 10px;
			@media (min-width: 678px) {
				&:hover {
					color: #ffffff;
					cursor: pointer;
					text-decoration: underline;
				}
			}
		}
	}

	.footer__links {
		display: flex;
		justify-content: center;
	}

	.link__img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: rgb(42, 42, 42);
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 5px 20px;
	}
	img {
		width: 20px;
		height: 20px;
	}
}
.footer__down {
	display: flex;
	flex-direction: column;
	width: 100%;
	@media (min-width: 678px) {
		flex-direction: row;
	}
	/* justify-content: center; */
	li {
		margin: 0 10px 20px;
		color: rgb(197, 195, 195);
		&:hover {
					color: #ffffff;
				}
	}
	ul {
		display: flex;
		flex-direction: column;
		@media (min-width: 678px) {
			flex-direction: row;
			flex-wrap: wrap;
			margin: 0 10px 0 0;
		}
	}
}
</style>
