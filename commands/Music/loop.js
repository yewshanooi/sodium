const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Set the loop mode')
		.addStringOption(option => option.setName('option').setDescription('Select an option').addChoices({ name: 'Track', value: 'track' }, { name: 'Queue', value: 'queue' }, { name: 'Off', value: 'off' }).setRequired(true)),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute(interaction, configuration) {
		await interaction.deferReply();

		if (!process.env.LAVALINK_HOST || !process.env.LAVALINK_PORT || !process.env.LAVALINK_PASSWORD) return interaction.editReply({ embeds: [global.errors[6]] });

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
		const optionField = interaction.options.getString('option');

		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		switch (optionField) {
			case 'off':
				player.setLoop('off');

				const embedOff = new EmbedBuilder()
					.setTitle('Loop disabled')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedOff] });

			case 'track':
				player.setLoop('track');

				const embedTrack = new EmbedBuilder()
					.setTitle('Track loop enabled')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedTrack] });

			case 'queue':
				player.setLoop('queue');

				const embedQueue = new EmbedBuilder()
					.setTitle('Queue loop enabled')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedQueue] });
		}
	}
};