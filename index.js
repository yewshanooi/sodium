const newLocal = require('fs');
const fs = newLocal;
const Discord = require('discord.js');
const { token } = require('./config.json');

const cooldowns = new Discord.Collection();

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'], partials: ['CHANNEL'] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log(`${client.user.tag}\n${client.users.cache.size} users, ${client.channels.cache.size} channels, ${client.guilds.cache.size} guilds`);
	client.user.setPresence({ activities: [{ name: '/help' }], status: 'online' });
});

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	if (command.guildOnly && interaction.channel.type === 'DM') {
		return interaction.reply('Error: This command cannot be executed in DMs.');
	}

	/* ============================================= */


	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.data.name}\` command.` });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	/* ============================================= */

	try {
		command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!' });
		// ephemeral: true will be added in a future update. Currently, bots cannot read those kind of messages yet and will output an error
	}
});

client.login(token);