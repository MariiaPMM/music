import axios from 'axios';

const clientId = '4c04ac2da85841d88205d6f67c381293'; // Ваш Client ID
const clientSecret = '4ca0a877b6dc4a249fc9e43100687330'; // Ваш Client Secret

export async function fetchAccessToken() {
	try {
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			new URLSearchParams({
				grant_type: 'client_credentials'
			}),
			{
				headers: {
					Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);

		console.log('Access token:', response.data.access_token);
		return response.data.access_token;
	} catch (error) {
		console.error('Error fetching access token:', error);
		throw error;
	}
}
