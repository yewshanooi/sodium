// Module
const fs = require('fs');

// Files
const reqEvent = event => require(`./events/${event}`);
const configuration = require('./config.json');
global.errors = require('./errors.js');

// Packages
const chalk = require('chalk');
const { Client, Collection, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js');
const dotenvx = require('@dotenvx/dotenvx');
	dotenvx.config();
const mongoose = require('mongoose');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });
client.commands = new Collection();

const commandsFolder = fs.readdirSync('./commands');

for (const categories of commandsFolder) {
	for (const cmdFile of fs.readdirSync(`commands/${categories}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./commands/${categories}/${cmdFile}`);
		client.commands.set(command.data.name, command);
	}
}

// Error messages for missing Client Token, MongoDB Token, Client ID, Guild ID, and embedColor fields
if (!process.env.TOKEN) throw new Error(`${chalk.red.bold('[Error] Missing \'TOKEN\' field in the .env file.')}`);
if (!process.env.MONGODB_TOKEN) throw new Error(`${chalk.red.bold('[Error] Missing \'MONGODB_TOKEN\' field in the .env file.')}`);
if (!process.env.CLIENT_ID) throw new Error(`${chalk.red.bold('[Error] Missing \'CLIENT_ID\' field in the .env file.')}`);
if (!process.env.GUILD_ID) throw new Error(`${chalk.red.bold('[Error] Missing \'GUILD_ID\' field in the .env file.')}`);

if (!configuration.embedColor) throw new Error(`${chalk.red.bold('[Error] Missing \'embedColor\' field in the config.json file.')}`);


// Discord events
client.on('interactionCreate', reqEvent('interactionCreate'));
client.once('clientReady', reqEvent('ready'));

function sendLogs(info, color) {
	const channel = client.channels.cache.get(process.env.CHANNEL_ID);

	if (!channel) return;

	const embed = new EmbedBuilder()
		.setDescription(info)
		.setColor(color);
	channel.send({ embeds: [embed] });
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

// Asynchronous process to connect to MongoDB
(async () => {
	await mongoose.connect(process.env.MONGODB_TOKEN).catch(console.error);
})();