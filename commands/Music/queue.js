const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('View song queue'),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
			if (!player.current && player.queue.size === 0) return interaction.editReply({ content: 'Error: There are no tracks in the queue.' });

		const formatDuration = (ms) => {
			const seconds = Math.floor((ms / 1000) % 60);
			const minutes = Math.floor((ms / (1000 * 60)) % 60);
			const hours = Math.floor(ms / (1000 * 60 * 60));

			return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		};

		const embed = new EmbedBuilder()
			.setTitle('Queue')
			.setColor(configuration.embedColor);

			if (player.current) {
				embed.addFields({
					name: 'Now Playing:',
					value: `[${player.current.title}](${player.current.url}) | \`${formatDuration(player.current.duration)}\``,
				})
			}

		if (player.queue.size > 0) {
			const tracks = player.queue.tracks.map((track, index) => {
				return `${index + 1}. [${track.title}](${track.url}) | \`${formatDuration(track.duration)}\``;
			});

			embed.addFields({
				name: 'Up Next:',
				value: tracks.slice(0, 10).join('\n'),
			});

			if (player.queue.size > 10) {
				embed.addFields({
					name: 'And more...',
					value: `${player.queue.size - 10} more tracks in the queue`,
				});
			}
		}

		return interaction.editReply({ embeds: [embed] });
	}
};