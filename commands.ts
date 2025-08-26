import { REST, Routes, ApplicationCommandDataResolvable } from "discord.js";
import { envConfig } from "./config";
import { readdirSync, lstatSync } from "node:fs";
import { join } from "node:path";
import chalk from "chalk";

const slashCommands: ApplicationCommandDataResolvable[] = [];
const commandsPath = join(__dirname, "commands");

function readCommands(dir: string) {
    const files = readdirSync(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = lstatSync(filePath);

        if (stat.isDirectory()) {
            readCommands(filePath);
        } else if (file.endsWith(".ts") || file.endsWith(".js")) {
            if (file === "commandLoader.ts" || file === "commandLoader.js") continue;

            const command = require(filePath)?.default;
            if (command.apis && Array.isArray(command.apis)) {
                const missing = command.apis.filter(api => {
                    if (api === "ENABLE_LAVALINK") {
                        return !envConfig.lavalink.enabled;
                    }
                    return !process.env[api];
                });
                if (missing.length > 0) {
                    continue;
                }
            }
            if (command && "data" in command) {
                slashCommands.push(command.data.toJSON());
            } else {
                console.warn(`[WARNING] The Command at ${filePath} is missing a required "data" property or is not a command file.`);
            }
        }
    }
}

readCommands(commandsPath);

const rest = new REST({ version: "10" }).setToken(envConfig.token);
const [, , option] = process.argv;

(async () => {
    try {
        if (option === 'deploy') {
            console.log(chalk.yellow("🔄 Initializing commands deployment..."));
            if (envConfig.devGuild) {
                await rest.put(
                    Routes.applicationGuildCommands(envConfig.clientId, envConfig.devGuild),
                    { body: slashCommands }
                ).then((data: any) => console.log(chalk.green.bold(`✅ ${chalk.bold(`${data.length}`)} commands loaded in guild: ${envConfig.devGuild}`)))
                .catch(console.error);
            } else {
                await rest.put(
                    Routes.applicationCommands(envConfig.clientId),
                    { body: slashCommands }
                ).then((data: any) => console.log(chalk.green.bold(`🌍 ${chalk.bold(`${data.length}`)} global commands updated.`)))
                .catch(console.error);
            }
        } else if (option === 'delete') {
            console.log(chalk.yellow("🗑️ Initializing commands deletion..."));
            if (envConfig.devGuild) {
                await rest.put(
                    Routes.applicationGuildCommands(envConfig.clientId, envConfig.devGuild),
                    { body: [] }
                ).then((data: any) => console.log(chalk.green.bold(`✅ Commands deleted from guild: ${envConfig.devGuild}`)))
                .catch(console.error);
            } else {
                await rest.put(
                    Routes.applicationCommands(envConfig.clientId),
                    { body: [] }
                ).then((data: any) => console.log(chalk.green.bold(`🌍 Global commands deleted.`)))
                .catch(console.error);
            }
        } else {
            console.log(chalk.red("❌ Invalid option. Use 'deploy' or 'delete' as an argument."));
        }
    } catch (error) {
        console.error(chalk.red("❌ Error registering commands:"), error);
    }
})();