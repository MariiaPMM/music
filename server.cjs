const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

// Ендпоінт для отримання Spotify Access Token
app.post('/api/token', async (req, res) => {
	try {
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			'grant_type=client_credentials',
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${auth}`
				}
			}
		);
		res.json(response.data);
	} catch (error) {
		console.error(
			'Error fetching access token:',
			error.response ? error.response.data : error.message
		);
		res.status(500).send('Error fetching access token');
	}
});

// Запускаємо сервер
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
