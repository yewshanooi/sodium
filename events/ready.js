const chalk = require('chalk');

module.exports = client => {
	if (!process.env.FORTNITE_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('FORTNITE_API_KEY')} is not set`);
	if (!process.env.GIPHY_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('GIPHY_API_KEY')} is not set`);
	if (!process.env.GENIUS_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('GENIUS_API_KEY')} is not set`);
	if (!process.env.NASA_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('NASA_API_KEY')} is not set`);
	if (!process.env.NEWS_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('NEWS_API_KEY')} is not set`);
	if (!process.env.OPENAI_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('OPENAI_API_KEY')} is not set`);
	if (!process.env.OPENWEATHERMAP_API_KEY) console.log(`${chalk.yellowBright.bold('[Warning]')} The enviromental variable ${chalk.bold('OPENWEATHERMAP_API_KEY')} is not set`);

	console.log(`\nConnected to Discord as ${chalk.bold(`${client.user.tag}`)}\nServing ${chalk.bold(`${client.users.cache.size}`)} user(s) and ${chalk.bold(`${client.channels.cache.size}`)} channel(s) in ${chalk.bold(`${client.guilds.cache.size}`)} guild(s)\n`);
};