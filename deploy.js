const { REST, Routes } = require('discord.js');
const fs = require('fs');

const commands = [];
const commandsFolder = fs.readdirSync('./commands');

for (const categories of commandsFolder) {
	for (const cmdFile of fs.readdirSync(`commands/${categories}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./commands/${categories}/${cmdFile}`);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully deployed application commands'))
	.catch(console.error);

/*
 * To deploy application commands in a single guild only, add a new variable 'GUILD_ID' in the .env file and use:
 * Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
 */