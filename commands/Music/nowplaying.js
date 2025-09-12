const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Show information about the current track'),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
			if (!player.current) return interaction.editReply({ content: 'Error: No music is playing.' });
		const track = player.current;

		const formatDuration = (ms) => {
			if (!ms || isNaN(ms)) return '00:00';
			const seconds = Math.floor((ms / 1000) % 60);
			const minutes = Math.floor((ms / (1000 * 60)) % 60);
			const hours = Math.floor(ms / (1000 * 60 * 60));

			return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		};

		const loopType = player.loop.charAt(0).toUpperCase() + player.loop.slice(1);

		const embed = new EmbedBuilder()
			.setTitle('Now Playing')
			.setThumbnail(track.artworkUrl || null)
			.setDescription(track.url ? `[${track.title}](${track.url})` : track.title)
			.addFields(
				{ name: 'Author', value: `${track.author || 'Not available'}`, inline: true },
				{ name: 'Loop', value: `${loopType}`, inline: true },
				{ name: 'Duration', value: `\`${formatDuration(track.position)} / ${formatDuration(track.duration)}\`` }
			)
			.setColor(configuration.embedColor);

		return interaction.editReply({ embeds: [embed] });
	}
};