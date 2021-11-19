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
			const noStringEmbed = new MessageEmbed()
				.setTitle('Help')
				.setDescription('*Use `/help {command}` to get more info on a specific command*')
				.addField('Commands', commands.map(command => command.data.name).join(', '))
				.setColor(embedColor);
			interaction.reply({ embeds: [noStringEmbed], components: [button] });
		}

		if (stringField) {
			const command = commands.get(stringField.toLowerCase());
				if (!command) return interaction.reply({ content: 'Error: Please provide a valid command.' });

				const guildOnlyCommand = command.guildOnly;
				let resultGuildOnly;
					if (guildOnlyCommand === true) resultGuildOnly = 'True';
					else resultGuildOnly = 'False';

				const stringEmbed = new MessageEmbed()
					.setTitle('Help')
					.addFields(
						{ name: 'Name', value: `\`${command.data.name}\`` },
						{ name: 'Description', value: `\`${command.data.description}\`` },
						{ name: 'Cooldown', value: `\`${command.cooldown || 3} second(s)\`` },
						{ name: 'Guild Only', value: `\`${resultGuildOnly}\`` }
					)
					.setColor(embedColor);
				interaction.reply({ embeds: [stringEmbed] });
			}
		}
};