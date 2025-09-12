const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Adjust the player volume')
		.addIntegerOption(option => option.setName('amount').setDescription('Enter an amount (between 0 and 100)').setMinValue(0).setMaxValue(100).setRequired(true)),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
		const amountField = interaction.options.getInteger('amount');

		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		try {
			player.setVolume(amountField);
			
			const embed = new EmbedBuilder()
				.setTitle(`Volume set to ${amountField}%`)
				.setColor(configuration.embedColor);

			return interaction.editReply({ embeds: [embed] });
		} catch {
			return interaction.editReply({ content: 'Error: Failed to adjust the volume.' });
		}

	}
};