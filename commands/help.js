const { MessageEmbed } = require('discord.js');
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

		if (!stringField) {
			const noStringEmbed = new MessageEmbed()
				.setTitle('Help')
				.setDescription('**Tip:** To get more info on a specific command use `/help {command}`')
				.addField('Commands', `${commands.map(command => command.data.name).join(', ')}`)
				.setColor(embedColor);
			interaction.reply({ embeds: [noStringEmbed] });
		}

		if (stringField) {
			const command = commands.get(stringField.toLowerCase());
				if (!command) return interaction.reply({ content: 'Error: Please provide a valid command.' });

				const { guildOnly } = command;
				let resultGuildOnly;
					if (guildOnly === true) resultGuildOnly = 'True';
					else resultGuildOnly = 'False';

				const stringEmbed = new MessageEmbed()
					.setTitle(`${command.data.name}`)
					.setDescription(`${command.data.description}`)
					.addFields(
						{ name: 'Cooldown', value: `\`${command.cooldown}\` second(s)`, inline: true },
						{ name: 'Guild Only', value: `\`${resultGuildOnly}\``, inline: true }
					)
					.setColor(embedColor);
				interaction.reply({ embeds: [stringEmbed] });
			}
		}
};