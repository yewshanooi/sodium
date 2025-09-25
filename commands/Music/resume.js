const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume playback if paused'),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		if (!process.env.LAVALINK_HOST || !process.env.LAVALINK_PORT || !process.env.LAVALINK_PASSWORD) return interaction.editReply({ embeds: [global.errors[6]] });

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
			if (!player.paused) return interaction.editReply({ content: 'Error: The player is not paused.' });

		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		try {
			player.resume();

			const embed = new EmbedBuilder()
				.setTitle('Resumed player')
				.setColor(configuration.embedColor);

			return interaction.editReply({ embeds: [embed] });
		} catch {
			return interaction.editReply({ content: 'Error: Failed to resume the player.' });
		}

	}
};