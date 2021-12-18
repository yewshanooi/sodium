const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
	dotenv.config();
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log('Started deploying application commands.');

		await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands }
		);

		console.log('Successfully deployed application commands.');
	}
	catch (error) {
		console.error(error);
	}
})();