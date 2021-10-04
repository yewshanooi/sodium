const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List every commands or detailed info about a specific command')
        .addStringOption(option => option.setName('command').setDescription('Enter a command')),
	cooldown: '0',
	guildOnly: false,
	execute (interaction) {
		const { commands } = interaction.client;
        const stringField = interaction.options.getString('command');

			const button = new MessageActionRow()
				.addComponents(new MessageButton()
					.setURL('https://skyebot.weebly.com/commands.html')
					.setLabel('Detailed Guide')
					.setStyle('LINK'));

		if (!stringField) {
			const embed1 = new MessageEmbed()
				.setTitle('Help')
				.setDescription('*Use `/help {command}` to get more info on a specific command*')
				.addField('Commands', commands.map(command => command.data.name).join(', '))
				.setColor(embedColor);
			interaction.reply({ embeds: [embed1], components: [button] });
		}

		if (stringField) {
			const command = commands.get(stringField.toLowerCase());
				if (!command) return interaction.reply('Error: Please provide a valid command.');

				const guildOnlyCommand = command.guildOnly;
				let resultGuildOnly;
				if (guildOnlyCommand === true) resultGuildOnly = 'True';
				else resultGuildOnly = 'False';

				const embed2 = new MessageEmbed()
					.setTitle('Help')
					.addField('Name', `\`${command.data.name}\``)
					.addField('Description', `\`${command.data.description}\``)
					.addField('Cooldown', `\`${command.cooldown || 3} second(s)\``)
					.addField('Guild Only', `\`${resultGuildOnly}\``)
					.setColor(embedColor);
				interaction.reply({ embeds: [embed2] });
			}
		}
};