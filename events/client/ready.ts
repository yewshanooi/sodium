import { Events } from "discord.js";
import { promises } from 'fs';
const chalk = require('chalk');
const path = require('path');

import { envConfig } from "../../config";

import type { ApplicationCommandDataResolvable } from "discord.js";
import type { Event } from "../../Utils/types/Client";

export default {
    name: Events.ClientReady,
    execute: async (client) => {
        // Warning message for missing ./models folder
		try {
			await promises.access('./models');
		} catch (err) {
			console.log(`${chalk.yellow.bold('[Warning] Missing ./models folder in the root of the project.')}`);
		}

		// Warning messages for missing channel ID field
		if (!envConfig.logsChannelID) console.log(`${chalk.yellow.bold('[Warning] Missing logs channel ID field in the config.ts file.')}`);

		// Warning messages for missing API keys
		if (!process.env.FORTNITE_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'FORTNITE_API_KEY\' field in the .env file.')}`);
		if (!process.env.GENIUS_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'GENIUS_API_KEY\' field in the .env file.')}`);
		if (!process.env.GIPHY_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'GIPHY_API_KEY\' field in the .env file.')}`);
		if (!process.env.GOOGLE_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'GOOGLE_API_KEY\' field in the .env file.')}`);
		if (!process.env.HYPIXEL_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'HYPIXEL_API_KEY\' field in the .env file.')}`);
		if (!process.env.NASA_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'NASA_API_KEY\' field in the .env file.')}`);
		if (!process.env.NEWS_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'NEWS_API_KEY\' field in the .env file.')}`);
		if (!process.env.OPENWEATHERMAP_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'OPENWEATHERMAP_API_KEY\' field in the .env file.')}`);
		if (!process.env.RIOTGAMES_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'RIOTGAMES_API_KEY\' field in the .env file.')}`);
		if (!process.env.STEAM_API_KEY) console.log(`${chalk.yellow.bold('[Warning] Missing \'STEAM_API_KEY\' field in the .env file.')}`);
		if (!process.env.FAKEYOU_USERNAME) console.log(`${chalk.yellow.bold('[Warning] Missing \'FAKEYOU_USERNAME\' field in the .env file.')}`);
		if (!process.env.FAKEYOU_PASSWORD) console.log(`${chalk.yellow.bold('[Warning] Missing \'FAKEYOU_PASSWORD\' field in the .env file.')}`);
		
		client.user.setPresence({ activities: [envConfig.activity], status: envConfig.status as any });

		console.log(`\nConnected to Discord as ${chalk.bold(`${client.user.username}`)}\nServing ${chalk.bold(`${client.users.cache.size}`)} user(s) and ${chalk.bold(`${client.channels.cache.size}`)} channel(s) in ${chalk.bold(`${client.guilds.cache.size}`)} guild(s) with ${chalk.bold(`${client.commands.size}`)} available command(s)\n`);
        await client.lavalink.init({ ...client.user!, shards: "auto" });

        if (envConfig.devGuild) {
            await client.guilds.cache.get(envConfig.devGuild)?.commands.set(client.commands.map(v => v.data.toJSON()) as ApplicationCommandDataResolvable[]);
            console.log("[Discord Bot] ✅ Dev commands loaded in guild:", envConfig.devGuild);
        } else {
            await client.application?.commands.set(client.commands.map(v => v.data.toJSON()) as ApplicationCommandDataResolvable[]);
            console.log("[Discord Bot]🌍 Global commands deployed");
        }
    }
} as Event;
