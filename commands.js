const { REST, Routes } = require('discord.js');
const fs = require('fs');
const dotenvx = require('@dotenvx/dotenvx');
	dotenvx.config();
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

// This line of code has been destructured
const [, , option] = process.argv;

if (option === 'deploy') {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
        .then(data => console.log(`\nSuccessfully deployed ${chalk.bold(`${data.length}`)} application command(s)\n`))
        .catch(console.error);
} else if (option === 'delete') {
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
        .then(() => console.log('\nSuccessfully deleted all application commands\n'))
        .catch(console.error);
} else {
    console.log(`${chalk.red.bold('[Error] Invalid option. Please use either \'deploy\' or \'delete\' as an option.')}`);
}


/*
 * Due to Discord API's limitation, you can only deploy a maximum of 200 commands in a single guild per day.
 * Trying to deploy more than 200 commands will cause the deploy command to stuck.
 *
 * Commands will only be deployed/deleted for a single guild by default for development purpose.
 * Replace the specific line of code with the one given below to change this:
 *
 * To deploy globally:     Routes.applicationCommands(process.env.CLIENT_ID), { body: commands }
 * To delete globally:     Routes.applicationCommands(process.env.CLIENT_ID), { body: [] }
 */