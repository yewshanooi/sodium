const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');
// add { guildId } for guild application commands

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands }
		);

		/*
		 * Routes.applicationCommands(clientId), for global application commands
		 * Routes.applicationGuildCommands(clientId, guildId), for guild application commands
		 */

		console.log('Successfully registered application commands.');
	}
 catch (error) {
		console.error(error);
	}
})();