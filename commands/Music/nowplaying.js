const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('View current song details'),
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

		const createProgressBar = (current, total, length = 15) => {
			if (!total || isNaN(total) || total <= 0) return '▁'.repeat(length);
			const safeCurrent = Math.max(0, Math.min(current, total));
			const progress = Math.round((safeCurrent / total) * length);
			return '▬'.repeat(progress) + '🔘' + '▬'.repeat(Math.max(0, length - progress));
		};

		const loopType = player.loop.charAt(0).toUpperCase() + player.loop.slice(1);

		const embed = new EmbedBuilder()
			.setTitle('Now Playing')
			.setDescription(track.url ? `[${track.title}](${track.url})` : track.title)
			.addFields(
				{ name: 'Author', value: `${track.author || 'Not available'}`, inline: true },
				{ name: 'Loop', value: `${loopType}`, inline: true },
				{ name: 'Duration', value: `\`${formatDuration(track.position)} / ${formatDuration(track.duration)}\`\n${createProgressBar(track.position, track.duration)}` }
			)
			.setColor(configuration.embedColor);

			const thumb = track.artworkUrl || track.thumbnail || track.displayThumbnail || null;
				if (thumb) embed.setThumbnail(thumb);

		return interaction.editReply({ embeds: [embed] });
	}
};