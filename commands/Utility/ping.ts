import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../Utils/types/Client";

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Calculates Discord API and WebSocket latency'),
	cooldown: 3,
	category: 'Utility',
	guildOnly: false,
    execute: async (client, interaction) => {
		const embed = new EmbedBuilder()
			.setDescription('*Calculating latency..*')
			.setColor(client.embedColor as any);

		await interaction.reply({ embeds: [embed] });

		const itr = await interaction.fetchReply();

		const timestamp = itr.createdTimestamp - interaction.createdTimestamp;
		const newEmbed = new EmbedBuilder()
			.setTitle('Ping')
			.addFields(
				{ name: 'API Latency', value: `\`${timestamp}\`ms` },
				{ name: 'WebSocket Latency', value: `\`${interaction.client.ws.ping}\`ms` }
			)
			.setColor(client.embedColor as any);

		await interaction.editReply({ embeds: [newEmbed] });
	}

} as Command;