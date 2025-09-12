const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('filter')
		.setDescription('Apply an audio filter')
		.addStringOption(option => option.setName('option').setDescription('Select an option').addChoices({ name: 'Reset', value: 'reset' }, { name: 'Bassboost', value: 'bassboost' }, { name: 'Nightcore', value: 'nightcore' }, { name: 'Vaporwave', value: 'vaporwave' }, { name: '8d', value: '8d' }, { name: 'Tremolo', value: 'tremolo' }, { name: 'Vibrato', value: 'vibrato' }, { name: 'Karaoke', value: 'karaoke' }).setRequired(true)),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

		const client = interaction.client;
		const player = client.manager.players.get(interaction.guild.id);
			if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
		const optionField = interaction.options.getString('option');

		if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

		switch (optionField) {
			case 'reset':
				player.filters.resetFilters();

				const embedReset = new EmbedBuilder()
					.setTitle('All filters reset')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedReset] });

			case 'bassboost':
				player.filters.setEqualizer([
					{ band: 0, gain: 0.6 }, // 25 Hz
					{ band: 1, gain: 0.7 }, // 40 Hz
					{ band: 2, gain: 0.8 }, // 63 Hz
					{ band: 3, gain: 0.55 }, // 100 Hz
					{ band: 4, gain: 0.25 }, // 160 Hz
				]);
				
				const embedBassboost = new EmbedBuilder()
					.setTitle('Bassboost filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedBassboost] });
				
			case 'nightcore':
				player.filters.setTimescale({
					speed: 1.2, // 20% faster
					pitch: 1.2, // 20% higher pitch
					rate: 1.0 // Normal rate
				});
				
				const embedNightcore = new EmbedBuilder()
					.setTitle('Nightcore filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedNightcore] });
				
			case 'vaporwave':
				player.filters.setTimescale({
					speed: 0.8, // 20% slower
					pitch: 0.8, // 20% lower pitch
					rate: 1.0 // Normal rate
				});
				
				const embedVaporwave = new EmbedBuilder()
					.setTitle('Vaporwave filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedVaporwave] });
				
			case '8d':
				player.filters.setRotation({
					rotationHz: 0.2 // Rotation speed
				});
				
				const embed8d = new EmbedBuilder()
					.setTitle('8d filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embed8d] });
				
			case 'tremolo':
				player.filters.setTremolo({
					frequency: 4.0, // Variation speed
					depth: 0.75 // Effect intensity
				});
				
				const embedTremolo = new EmbedBuilder()
					.setTitle('Tremolo filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedTremolo] });
				
			case 'vibrato':
				player.filters.setVibrato({
					frequency: 4.0, // Variation speed
					depth: 0.75 // Effect intensity
				});
				
				const embedVibrato = new EmbedBuilder()
					.setTitle('Vibrato filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedVibrato] });
				
			case 'karaoke':
				player.filters.setKaraoke({
					level: 1.0, // Effect level
					monoLevel: 1.0, // Mono channel level
					filterBand: 220.0, // Frequency band
					filterWidth: 100.0 // Width of effect
				});
				
				const embedKaraoke = new EmbedBuilder()
					.setTitle('Karaoke filter applied')
					.setColor(configuration.embedColor);

				return interaction.editReply({ embeds: [embedKaraoke] });
		}

	}
};