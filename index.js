const newLocal = require('fs');
const fs = newLocal;
const dotenv = require('dotenv');
	dotenv.config();
const chalk = require('chalk');
global.errors = require('./errors.js');
const configuration = require('./config.json');

const { Client, Collection, EmbedBuilder, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });
client.commands = new Collection();

const commandsFolder = fs.readdirSync('./commands');

for (const categories of commandsFolder) {
	for (const cmdFile of fs.readdirSync(`commands/${categories}`).filter(file => file.endsWith('.js'))) {
		const command = require(`./commands/${categories}/${cmdFile}`);
		client.commands.set(command.data.name, command);
	}
}

if (!process.env.TOKEN) throw new Error(`${chalk.redBright.bold('[Error]')} Missing ${chalk.bold('TOKEN')} field in the .env file`);
if (!process.env.CLIENT_ID) throw new Error(`${chalk.redBright.bold('[Error]')} Missing ${chalk.bold('CLIENT_ID')} field in the .env file`);
if (!process.env.GUILD_ID) throw new Error(`${chalk.redBright.bold('[Error]')} Missing ${chalk.bold('GUILD_ID')} field in the .env file`);

if (!configuration.embedColor) throw new Error(`${chalk.redBright.bold('[Error]')} Missing ${chalk.bold('embedColor')} field in the config.json file`);


client.on('debug', info => {
	const debugChannel = client.channels.cache.get(configuration.debugChannelId);

	if (!debugChannel) return;

	// White color embed
	const debugEmbed = new EmbedBuilder()
		.setDescription(info)
		.setColor('#ffffff');
	debugChannel.send({ embeds: [debugEmbed] });
});

client.on('error', info => {
	const errorChannel = client.channels.cache.get(configuration.errorChannelId);

	if (!errorChannel) return;

	// Red color embed
	const errorEmbed = new EmbedBuilder()
		.setDescription(info)
		.setColor('#ff5555');
	errorChannel.send({ embeds: [errorEmbed] });
});

client.on('warn', info => {
	const warnChannel = client.channels.cache.get(configuration.warningChannelId);

	if (!warnChannel) return;

	// Orange color embed
	const warnEmbed = new EmbedBuilder()
		.setDescription(info)
		.setColor('#ffaa00');
	warnChannel.send({ embeds: [warnEmbed] });
});


require('./event')(client);

client.login(process.env.TOKEN);