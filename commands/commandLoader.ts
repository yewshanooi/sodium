import { MiniMap } from "lavalink-client";
import chalk from "chalk";
import { readdirSync, lstatSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { envConfig } from "../config";

import type { BotClient, Command } from "../Utils/types/Client";

async function readCommands(dir: string, client: BotClient) {
    const files = readdirSync(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = lstatSync(filePath);

        if (stat.isDirectory()) {
            await readCommands(filePath, client);
        } else if (file.endsWith(".ts") || !file.endsWith(".js")) {
            if (file === "commandLoader.ts") continue;
            
            const command = await import(filePath).then(v => v.default) as Command;
            const parentFolder = basename(dirname(filePath));
            if (command.apis && Array.isArray(command.apis)) {
                const missing = command.apis.filter(api => {
                    if (api === "ENABLE_LAVALINK") {
                        return !envConfig.lavalink.enabled;
                    }
                    return !process.env[api];
                });

                if (missing.length > 0) {
                    console.log(`${chalk.yellow(`[COMMAND] ${command.category || parentFolder} > ${command.data?.name || file}: require -> ${missing.join(", ")}`)}`);
                    continue;
                }
            }

            if ("data" in command && "execute" in command) {
                if (client) {
                    client.commands.set(command.data.name, command);
                }
                console.log(`${chalk.green(`[COMMAND] ${command.category || parentFolder} > ${command.data.name}`)}`);
            } else {
                console.warn(`[WARNING] The Command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

export async function loadCommands(client: BotClient) {
    client.commands = new MiniMap();
    const commandsPath = join(process.cwd(), "commands");
    await readCommands(commandsPath, client);
}