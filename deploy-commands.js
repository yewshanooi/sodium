const { REST, Routes } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
	dotenv.config();
const chalk = require('chalk');

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
	.then(data => console.log(`\nSuccessfully deployed ${chalk.bold(`${data.length}`)} application commands\n`))
	.catch(console.error);

/*
 * To deploy application commands in a single guild, add a new variable 'GUILD_ID' in the .env file and use:
 * Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands }
 */