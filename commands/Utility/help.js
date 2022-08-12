const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List every commands or detailed info about a specific command')
		.addStringOption(option => option.setName('command').setDescription('Enter a command')),
	cooldown: '0',
	category: 'Utility',
	guildOnly: false,
	execute (interaction, configuration) {
		const { commands } = interaction.client;
        const commandField = interaction.options.getString('command');

		if (commandField) {
			const command = commands.get(commandField.toLowerCase());
			if (!command) return interaction.reply({ content: 'Error: Please provide a valid command.' });

			const { guildOnly } = command;
			let resultGuildOnly;
				if (guildOnly === true) resultGuildOnly = 'True';
				else resultGuildOnly = 'False';

			const commandEmbed = new EmbedBuilder()
				.setTitle(`/${command.data.name}`)
				.setDescription(`${command.data.description}`)
				.addFields(
					{ name: 'Cooldown', value: `\`${command.cooldown}\` second(s)`, inline: true },
					{ name: 'Guild Only', value: `\`${resultGuildOnly}\``, inline: true },
					{ name: 'Category', value: `\`${command.category}\``, inline: false }
				)
				.setColor(configuration.embedColor);
			interaction.reply({ embeds: [commandEmbed] });
		}
		else {
			// Primary === 1, Secondary === 2, Success === 3, Danger === 4, Link === 5
			const buttons = [
				new ButtonBuilder()
					.setCustomId('funCategory')
					.setLabel('Fun')
					.setStyle(2),
				new ButtonBuilder()
					.setCustomId('modCategory')
					.setLabel('Moderation')
					.setStyle(2),
				new ButtonBuilder()
					.setCustomId('utilityCategory')
					.setLabel('Utility')
					.setStyle(2)
				];

				const box = new ActionRowBuilder().addComponents(buttons);

				const fun = commands.filter(cmd => cmd.category === 'Fun');
				const moderation = commands.filter(cmd => cmd.category === 'Moderation');
				const utility = commands.filter(cmd => cmd.category === 'Utility');

				const mainEmbed = new EmbedBuilder()
					.setTitle('Help')
					.setDescription('💡 *To get more info on a specific command use `/help {command}`*')
					.addFields({ name: `There are ${commands.map(command => command.data.name).length} commands available`, value: 'Click on any of the buttons to see the commands' })
					.setColor(configuration.embedColor);

				interaction.reply({ embeds: [mainEmbed], components: [box] }).then(int => {
					const collector = int.createMessageComponentCollector();
					collector.on('collect', async collected => {
						const value = collected.customId;

						if (value === 'funCategory') {
							mainEmbed.data.fields[0] = { name: `Fun commands [${fun.map(commandA => commandA.data.name).length}]`, value: fun.map(commandB => `\`${commandB.data.name}\``).join('\n') };
							box.components[0].setDisabled(true);
							box.components[1].setDisabled(false);
							box.components[2].setDisabled(false);
						await collected.deferUpdate();
						interaction.editReply({ embeds: [mainEmbed], components: [box] });
					}
						else if (value === 'modCategory') {
							mainEmbed.data.fields[0] = { name: `Moderation commands [${moderation.map(commandC => commandC.data.name).length}]`, value: moderation.map(commandD => `\`${commandD.data.name}\``).join('\n') };
							box.components[0].setDisabled(false);
							box.components[1].setDisabled(true);
							box.components[2].setDisabled(false);
						await collected.deferUpdate();
						interaction.editReply({ embeds: [mainEmbed], components: [box] });
					}
						else if (value === 'utilityCategory') {
							mainEmbed.data.fields[0] = { name: `Utility commands [${utility.map(commandE => commandE.data.name).length}]`, value: utility.map(commandF => `\`${commandF.data.name}\``).join('\n') };
							box.components[0].setDisabled(false);
							box.components[1].setDisabled(false);
							box.components[2].setDisabled(true);
						await collected.deferUpdate();
						interaction.editReply({ embeds: [mainEmbed], components: [box] });
					}
					});
				});
			}
		}
};