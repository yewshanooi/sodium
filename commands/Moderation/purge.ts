import { EmbedBuilder, SlashCommandBuilder, MessageFlags, PermissionsBitField } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Remove messages from the guild text channel')
		.addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 1 and 99)').setMinValue(1).setMaxValue(99).setRequired(true)),
	cooldown: 15,
	category: 'Moderation',
	guildOnly: true,
	execute: (client, interaction) => {
		if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Messages** permission in `Server Settings > Roles` to use this command.' });
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ embeds: [client.errors.noPermission] });

		const amountField = interaction.options.getInteger('amount');

			const embed = new EmbedBuilder()
				.setDescription(`Succesfully removed **${amountField}** message(s)`)
				.setColor(client.embedColor as any);
			interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).then(() => interaction.channel.bulkDelete(amountField, true));
		}
} as Command;