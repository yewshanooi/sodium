const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip current track'),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
			if (!player.current) return interaction.editReply({ content: 'Error: No music is playing.' });

		if (!interaction.member.voice.channel) return interaction.editReply({ content: 'Error: You must join a voice channel to use this command.' });
		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		try {
			player.skip();

			const embed = new EmbedBuilder()
				.setTitle('Skipped')
				.setDescription(`${player.current.title}`)
				.setColor(configuration.embedColor);

            return interaction.editReply({ embeds: [embed] });
		} catch {
			return interaction.editReply({ content: 'Error: Failed to skip the track.' });
		}

	}
};