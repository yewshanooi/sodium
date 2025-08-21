const fs = require('fs').promises;
const chalk = require('chalk');
const path = require('path');

module.exports = {
    name: 'ready',
    once: false,
    async execute(client) {
		client.manager.init(client.user.id);
		// Warning message for missing ./models folder
		try {
			await fs.access('./models');
		} catch (err) {
			console.log(`${chalk.yellow.bold('[Warning] Missing ./models folder in the root of the project.')}`);
		}

		try {
			await fs.access(path.resolve(__dirname, '../..', 'config.json'));
		} catch (err) {
			console.log(`${chalk.yellow.bold('[Warning] Missing config.json file in the root of the project.')}`);
		}

		// Warning messages for missing channel ID field
		if (!process.env.CHANNEL_ID) console.log(`${chalk.yellow.bold('[Warning] Missing \'CHANNEL_ID\' field in the .env file.')}`);

		// Warning messages for missing API keys
		if (!process.env.FORTNITE_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'FORTNITE_API_KEY\' field in the .env file.')}`);
		if (!process.env.GENIUS_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'GENIUS_API_KEY\' field in the .env file.')}`);
		if (!process.env.GIPHY_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'GIPHY_API_KEY\' field in the .env file.')}`);
		if (!process.env.GOOGLE_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'GOOGLE_API_KEY\' field in the .env file.')}`);
		if (!process.env.HYPIXEL_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'HYPIXEL_API_KEY\' field in the .env file.')}`);
		if (!process.env.NASA_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'NASA_API_KEY\' field in the .env file.')}`);
		if (!process.env.NEWS_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'NEWS_API_KEY\' field in the .env file.')}`);
		if (!process.env.OPENWEATHERMAP_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'OPENWEATHERMAP_API_KEY\' field in the .env file.')}`);
		if (!process.env.RIOTGAMES_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'RIOTGAMES_API_KEY\' field in the .env file.')}`);
		if (!process.env.STEAM_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'STEAM_API_KEY\' field in the .env file.')}`);
		if (!process.env.FAKEYOU_USERNAME) console.log(`${chalk.yellow.bold('[Warning] Missing \'FAKEYOU_USERNAME\' field in the .env file.')}`);
		if (!process.env.FAKEYOU_PASSWORD) console.log(`${chalk.yellow.bold('[Warning] Missing \'FAKEYOU_PASSWORD\' field in the .env file.')}`);
		if (!process.env.SPOTIFY_CLIENT_ID) console.log(`${chalk.yellow.bold('[Warning] Missing \'SPOTIFY_CLIENT_ID\' field in the .env file.')}`);
		if (!process.env.SPOTIFY_CLIENT_SECRET) console.log(`${chalk.yellow.bold('[Warning] Missing \'SPOTIFY_CLIENT_SECRET\' field in the .env file.')}`);

		console.log(`\nConnected to Discord as ${chalk.bold(`${client.user.username}`)}\nServing ${chalk.bold(`${client.users.cache.size}`)} user(s) and ${chalk.bold(`${client.channels.cache.size}`)} channel(s) in ${chalk.bold(`${client.guilds.cache.size}`)} guild(s) with ${chalk.bold(`${client.commands.size}`)} available command(s)\n`);
	}
};