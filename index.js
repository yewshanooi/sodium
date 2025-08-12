// Module
const fs = require('fs');
const { JsonDatabase } = require("five.db");
const { ensureDbFileExists } = require('./scheme.js');

// Files
const reqEvent = event => require(`./events/${event}`);
const configuration = require('./config.json');
global.errors = require('./errors.js');

// Packages
const chalk = require('chalk');
const { Client, Collection, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js');
const dotenvx = require('@dotenvx/dotenvx');
	dotenvx.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });
client.commands = new Collection();
client.db = new JsonDatabase('fivedb.json');

const commandsFolder = fs.readdirSync('./commands');

for (const categories of commandsFolder) {
	for (const cmdFile of fs.readdirSync(`commands/${categories}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./commands/${categories}/${cmdFile}`);
		client.commands.set(command.data.name, command);
	}
}

// Error messages for missing Client Token, MongoDB Token, Client ID, Guild ID, and embedColor fields
if (!process.env.TOKEN) throw new Error(`${chalk.red.bold('[Error] Missing \'TOKEN\' field in the .env file.')}`);
if (!process.env.CLIENT_ID) throw new Error(`${chalk.red.bold('[Error] Missing \'CLIENT_ID\' field in the .env file.')}`);
if (!process.env.GUILD_ID) throw new Error(`${chalk.red.bold('[Error] Missing \'GUILD_ID\' field in the .env file.')}`);

if (!configuration.embedColor) throw new Error(`${chalk.red.bold('[Error] Missing \'embedColor\' field in the config.json file.')}`);


// Discord events
client.on('interactionCreate', reqEvent('interactionCreate'));
client.once('ready', reqEvent('ready'));

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

(async function startBot() {
    // Check and create the database file if it doesn't exist.
    await ensureDbFileExists();
    client.login(process.env.TOKEN);
})();