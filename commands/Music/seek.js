const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('seek')
		.setDescription('Seek to a specific position in the current track')
		.addStringOption(option => option.setName('position').setDescription('Enter a position (e.g., 1:30 or 90)').setRequired(true)),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
			if (!player.current) return interaction.editReply({ content: 'Error: No music is playing.' });
			if (!player.current.isSeekable) return interaction.editReply({ content: 'Error: This track cannot be seeked.' });
		const positionField = interaction.options.getString('position');

		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		let milliseconds = 0;
		if (positionField.includes(':')) {
			const [minutes, seconds] = positionField.split(':');
			milliseconds = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
		} else {
			milliseconds = parseInt(positionField) * 1000;
		}

		function formatDuration(ms) {
			const seconds = Math.floor((ms / 1000) % 60);
			const minutes = Math.floor((ms / (1000 * 60)) % 60);
			const hours = Math.floor(ms / (1000 * 60 * 60));
		
			return `${hours ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}

		if (isNaN(milliseconds)) return interaction.editReply({ content: 'Error: Invalid time format.' });
		if (milliseconds > player.current.duration) return interaction.editReply({ content: `Error: Track is only ${formatDuration(player.current.duration)} long.` });

		try {
			player.seek(milliseconds);

			const embed = new EmbedBuilder()
				.setTitle(`Seeked to ${formatDuration(milliseconds)}`)
				.setColor(configuration.embedColor);

			return interaction.editReply({ embeds: [embed] });
		} catch {
			return interaction.editReply({ content: 'Error: Failed to seek current track.' });
		}

	}
};