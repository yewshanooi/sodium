const { REST, Routes } = require('discord.js');
const { readdirSync } = require("fs");
const path = require('path');
const dotenvx = require('@dotenvx/dotenvx');
	dotenvx.config();
const chalk = require('chalk');
const config = require("./config.json");

const slashCommands = [];

function readCommands(dir, client) {
    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
            readCommands(filePath, client);
        } else if (file.name.endsWith('.js')) {
            const command = require(filePath);

            if (command.apis && Array.isArray(command.apis)) {
                const missing = command.apis.filter(api => {
                    if (api === "ENABLE_LAVALINK") {
                        return !config.lavalink.enabled;
                    }
                    return !process.env[api];
                });

                if (missing.length > 0) {
                    console.log(`${chalk.yellow(`[COMMAND] ${file.parentPath.split('\\').pop()} > ${command.data?.name || file.name}: require -> ${missing.join(", ")}`)}`);
                    continue;
                }
            }

            if ('data' in command && 'execute' in command) {
                slashCommands.push(command.data.toJSON());
                if (client) {
                    client.commands.set(command.data.name, command);
                }
                console.log(`${chalk.green(`[COMMAND] ${file.parentPath.split('\\').pop()} > ${command.data.name}`)}`);
            } else {
                console.log(`${chalk.red(`[WARNING] Missing "data" or "execute" in ${filePath}`)}`);
            }
        }
    }
    return slashCommands;
}

if (require.main === module) {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const [, , option] = process.argv;

    // leer comandos para deploy/delete
    readCommands(path.join(__dirname, 'commands'));

    if (option === 'deploy') {
        rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: slashCommands }
        )
            .then(data => console.log(`\nSuccessfully deployed ${chalk.bold(`${data.length}`)} command(s)\n`))
            .catch(console.error);

    } else if (option === 'delete') {
        rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        )
            .then(() => console.log('\nSuccessfully deleted all commands\n'))
            .catch(console.error);

    } else {
        console.log(
            `${chalk.red.bold('[Error] Invalid option. Use "deploy" or "delete".')}`
        );
    }
}


module.exports = { readCommands, slashCommands };

/*
 * Due to Discord API's limitation, you can only deploy a maximum of 200 commands in a single guild per day.
 * Trying to deploy more than 200 commands will cause the deploy command to stuck.
 *
 * Commands will only be deployed/deleted for a single guild by default for development purpose.
 * Replace the specific line of code with the one given below to change this:
 *
 * To deploy globally:     Routes.applicationCommands(process.env.CLIENT_ID), { body: slashCommands }
 * To delete globally:     Routes.applicationCommands(process.env.CLIENT_ID), { body: [] }
 */