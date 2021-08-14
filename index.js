const newLocal = require('fs');
const fs = newLocal;
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const cooldowns = new Discord.Collection();

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'], partials: ['CHANNEL'] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log(`User : ${client.user.tag}\n${client.users.cache.size} users, ${client.channels.cache.size} channels, ${client.guilds.cache.size} guilds`);
	client.user.setPresence({ activities: [{ name: `${prefix}help ∙ ${client.users.cache.size} users, ${client.channels.cache.size} channels, ${client.guilds.cache.size} guilds` }], status: 'online' });
});

client.on('messageCreate', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName);

	/* ============================================= */

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'DM') {
		return message.channel.send('Error: This command cannot be executed in DMs.');
	}

	/* ============================================= */

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(`Error: Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	/* ============================================= */

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.channel.send('Error: There was a problem trying to execute that command!');
	}
});

client.login(token);