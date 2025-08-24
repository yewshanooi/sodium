import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
	data: new SlashCommandBuilder()
		.setName('beep')
		.setDescription('Boops back at you!'),
	cooldown: 3,
	category: 'Fun',
	guildOnly: false,
	execute: (client, interaction) => {
		const embed = new EmbedBuilder()
			.setDescription('**Boop!** ✨')
			.setColor(client.embedColor as any);
		interaction.reply({ embeds: [embed] });
	}
} as Command;