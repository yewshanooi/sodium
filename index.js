// Files
const { readCommands } = require('./commands.js');
global.errors = require('./errors.js');

// Packages
const { readdirSync } = require("fs");
const chalk = require('chalk');
const path = require('path');
const { Client, Collection, EmbedBuilder, GatewayIntentBits, Partials, DefaultWebSocketManagerOptions } = require('discord.js');
const dotenvx = require('@dotenvx/dotenvx');
	dotenvx.config();
const mongoose = require('mongoose');
const FakeYou = require("fakeyouapi.js");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");

DefaultWebSocketManagerOptions.identifyProperties.browser = 'Discord iOS';
const client = global.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });

client.commands = new Collection();
client.config = require("./config.json");
const managerConfig = {
    nodes: client.config.lavalink.nodes,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    autoPlay: true
};

if (client.config.lavalink.spotify && process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
    managerConfig.plugins = [
        new Spotify({
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        })
    ];
}

client.manager = new Manager(managerConfig);

client.on("raw", (d) => client.manager.updateVoiceState(d));
client.on("disconnect", () => console.log("Bot Disconnected!"));
client.on("reconnecting", () => console.log("Bot Reconnecting.."));
client.on('warn', error => console.log(error));
client.on('error', error => console.log(error));
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

// Load commands from commands.js
readCommands(path.join(__dirname, 'commands'), client);

// Error messages for missing Client Token, MongoDB Token, Client ID, Guild ID, and embedColor fields
if (!process.env.TOKEN) throw new Error(`${chalk.red.bold('[Error] Missing \'TOKEN\' field in the .env file.')}`);
if (!process.env.CLIENT_ID) throw new Error(`${chalk.red.bold('[Error] Missing \'CLIENT_ID\' field in the .env file.')}`);
if (!process.env.GUILD_ID) throw new Error(`${chalk.red.bold('[Error] Missing \'GUILD_ID\' field in the .env file.')}`);

// Discord events
readdirSync('./events/Client/').forEach(file => {
    const event = require(path.join(__dirname, 'events/Client', file));
    console.log(`[CLIENT] Event: ${event.name}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
});

// Lavalink v3 events
readdirSync('./events/Lavalink/').forEach(file => {
    const event = require(path.join(__dirname, 'events/Lavalink', file));
    console.log(`[LAVA] Event: ${event.name}`);

    if (event.events) {
        // multi-event
        for (const [eventName, handler] of Object.entries(event.events)) {
            client.manager.on(eventName, (...args) => handler(client, ...args));
            console.log(`   ↳ Registered Lavalink event: ${eventName}`);
        }
    } else {
        // single event
        client.manager.on(event.name, (...args) => event.execute(client, ...args));
        console.log(`   ↳ Registered Lavalink event: ${event.name}`);
    }
});


function sendLogs(info, color) {
	if (client.config.logsChannelID) {
		const channel = client.channels.cache.get(client.config.logsChannelID);
		if (!channel) return;
		const embed = new EmbedBuilder()
			.setDescription(info)
			.setColor(color);
		channel.send({ embeds: [embed] });
	}
}

client.on('debug', info => {
	// White color embed
	sendLogs(info, '#ffffff');
});

client.on('error', info => {
	// Red color embed
	sendLogs(info, '#ff5555');
});

client.on('warn', info => {
	// Orange color embed
	sendLogs(info, '#ffaa00');
});


// MongoDB events
mongoose.connection.on('connecting', () => {
	console.log(`${chalk.greenBright.bold('[MongoDB] Connecting to database')}`);
});

mongoose.connection.on('connected', () => {
	console.log(`${chalk.greenBright.bold('[MongoDB] Successfully connected to database')}`);
});

mongoose.connection.on('disconnected', () => {
	console.log(`${chalk.redBright.bold('[MongoDB] Error: Disconnected from database')}`);
});

mongoose.connection.on('error', err => {
	console.log(`${chalk.redBright.bold('[MongoDB] Error: There was a problem connecting to database')}\n`, err);
});


client.login(process.env.TOKEN);

// Asynchronous process
(async () => {
	if (!process.env.MONGODB_TOKEN) console.log(`${chalk.yellow.bold('[Warning] Missing \'MONGODB_TOKEN\' field in the .env file.')}`);
	await mongoose.connect(process.env.MONGODB_TOKEN).catch(console.error);

	try {
        console.log("Connecting to FakeYou...");
        const fy = new FakeYou.Client({
            usernameOrEmail: process.env.FAKEYOU_USERNAME,
            password: process.env.FAKEYOU_PASSWORD
        });
        await fy.start();
        client.fy = fy;
        console.log("Successfully connected to FakeYou.");
    } catch (error) {
        console.error("An error occurred during startup:", error);
    }
})();

/* Get lavalink nodes: https://lavalink.darrennathanael.com/  Credits: Darren Nathanael*/