const chalk = require('chalk');

module.exports = client => {
	if (!process.env.FORTNITE_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('FORTNITE_API_KEY')} field in the .env file`);
	if (!process.env.GIPHY_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('GIPHY_API_KEY')} field in the .env file`);
	if (!process.env.GENIUS_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('GENIUS_API_KEY')} field in the .env file`);
	if (!process.env.NASA_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('NASA_API_KEY')} field in the .env file`);
	if (!process.env.NEWS_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('NEWS_API_KEY')} field in the .env file`);
	if (!process.env.OPENWEATHERMAP_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('OPENWEATHERMAP_API_KEY')} field in the .env file`);
	if (!process.env.RIOTGAMES_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} Missing ${chalk.bold('RIOTGAMES_API_KEY')} field in the .env file`);

	console.log(`\nConnected to Discord as ${chalk.bold(`${client.user.username}`)}\nServing ${chalk.bold(`${client.users.cache.size}`)} user(s) and ${chalk.bold(`${client.channels.cache.size}`)} channel(s) in ${chalk.bold(`${client.guilds.cache.size}`)} guild(s)\n`);
};