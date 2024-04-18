const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('List all commands or specific information about a command')
		.addStringOption(option => option.setName('command').setDescription('Enter a command')),
	cooldown: '0',
	category: 'Utility',
	guildOnly: false,
	execute (interaction, configuration) {
		const { commands } = interaction.client;
        const commandField = interaction.options.getString('command');

		if (commandField) {
			const command = commands.get(commandField.toLowerCase());
			if (!command) return interaction.reply({ content: 'Error: No such command found.' });

			const { guildOnly } = command;
			let resultGuildOnly;
				if (guildOnly === true) resultGuildOnly = 'True';
				else resultGuildOnly = 'False';

			const commandEmbed = new EmbedBuilder()
				.setTitle(`/${command.data.name}`)
				.setDescription(`${command.data.description}`)
				.addFields(
					{ name: 'Category', value: `\`${command.category}\``, inline: true },
					{ name: 'Guild Only', value: `\`${resultGuildOnly}\``, inline: true },
					{ name: 'Cooldown', value: `\`${command.cooldown}\` second(s)` }
				)
				.setColor(configuration.embedColor);
			interaction.reply({ embeds: [commandEmbed] });
		}
		else {
			// Primary === 1, Secondary === 2, Success === 3, Danger === 4, Link === 5
			const buttons = [
				new ButtonBuilder()
					.setCustomId('ctgFun')
					.setLabel('Fun')
					.setStyle(2),
				new ButtonBuilder()
					.setCustomId('ctgModeration')
					.setLabel('Moderation')
					.setStyle(2),
				new ButtonBuilder()
					.setCustomId('ctgUtility')
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
					// 180 seconds timeout
					const collector = int.createMessageComponentCollector({ time: 180000 });

					collector.on('collect', async collected => {
						const value = collected.customId;

						if (value === 'ctgFun') {
							mainEmbed.data.fields[0] = { name: `Fun commands [${fun.map(commandA => commandA.data.name).length}]`, value: fun.map(commandB => `\`${commandB.data.name}\``).join('\n') };
							box.components[0].setDisabled(true);
							box.components[1].setDisabled(false);
							box.components[2].setDisabled(false);
						await collected.deferUpdate();
						interaction.editReply({ embeds: [mainEmbed], components: [box] });
					}
						else if (value === 'ctgModeration') {
							mainEmbed.data.fields[0] = { name: `Moderation commands [${moderation.map(commandC => commandC.data.name).length}]`, value: moderation.map(commandD => `\`${commandD.data.name}\``).join('\n') };
							box.components[0].setDisabled(false);
							box.components[1].setDisabled(true);
							box.components[2].setDisabled(false);
						await collected.deferUpdate();
						interaction.editReply({ embeds: [mainEmbed], components: [box] });
					}
						else if (value === 'ctgUtility') {
							mainEmbed.data.fields[0] = { name: `Utility commands [${utility.map(commandE => commandE.data.name).length}]`, value: utility.map(commandF => `\`${commandF.data.name}\``).join('\n') };
							box.components[0].setDisabled(false);
							box.components[1].setDisabled(false);
							box.components[2].setDisabled(true);
						await collected.deferUpdate();
						interaction.editReply({ embeds: [mainEmbed], components: [box] });
					}
					});

					collector.on('end', async (__, reason) => {
						if (reason === 'time') {
							await interaction.editReply({ embeds: [
								new EmbedBuilder()
									.setTitle('Help')
									.setDescription('Command has ended. Retype `/help` to get another one.')
									.setColor(configuration.embedColor)
								], components: [] });
							}
						interaction.editReply({ components: [] });
					});
				});

			}
		}
};