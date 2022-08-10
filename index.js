/* eslint-disable no-sync */
const newLocal = require('fs');
const fs = newLocal;
const dotenv = require('dotenv');
	dotenv.config();
const errors = require('./errors.js');

const { Client, Collection, EmbedBuilder, GatewayIntentBits, InteractionType, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const cooldowns = new Collection();

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}\nServing ${client.users.cache.size} users and ${client.channels.cache.size} channels in ${client.guilds.cache.size} guilds`);
});

client.on('interactionCreate', async interaction => {
	if (interaction.type !== InteractionType.ApplicationCommand) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	// Outputs an error message if user tries to use guildOnly commands in Direct Messages
	if (command.guildOnly && interaction.channel.type === 1) {
		return interaction.reply({ embeds: [errors[0]] });
	}

	// Outputs an error message if config.json file is missing
	if (!fs.existsSync('./config.json')) {
		return interaction.reply({ embeds: [errors[2]], ephemeral: true });
	}

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;

				const inCooldown = new EmbedBuilder()
					.setTitle('Cooldown')
					.setDescription(`Please wait \`${timeLeft.toFixed(1)}\` more second(s) before reusing the **${command.data.name}** command.`)
					.setColor('#5555ff');
				return interaction.reply({ embeds: [inCooldown], ephemeral: true });
			}
		}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		const configuration = require('./config.json');
		await command.execute(interaction, configuration);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Error: There was an error while executing this command!' });
	}
});

client.login(process.env.TOKEN);