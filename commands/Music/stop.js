const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop playback and clear the queue'),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });

		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		try {
			player.stop();

			if (player.queue && typeof player.queue.clear === 'function') player.queue.clear();

			const embed = new EmbedBuilder()
				.setTitle('Stopped player & cleared the queue')
				.setColor(configuration.embedColor);

			return interaction.editReply({ embeds: [embed] });
		} catch {
			return interaction.editReply({ content: 'Error: Failed to stop the player.' });
		}

	}
};