const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autoplay')
		.setDescription('Set the player autoplay')
		.addStringOption(option => option.setName('option').setDescription('Select an option').addChoices({ name: 'Enable', value: 'enable' }, { name: 'Disable', value: 'disable' }).setRequired(true)),
	cooldown: '3',
	category: 'Music',
	guildOnly: true,
	async execute (interaction, configuration) {
		await interaction.deferReply();

        if (!process.env.LAVALINK_HOST || !process.env.LAVALINK_PORT || !process.env.LAVALINK_PASSWORD) return interaction.editReply({ embeds: [global.errors[6]] });

        const client = interaction.client;
        const player = client.manager.players.get(interaction.guild.id);
            if (!player) return interaction.editReply({ content: 'Error: There is no music player available.' });
        const optionField = interaction.options.getString('option');

        if (interaction.member.voice.channel.id !== player.voiceChannelId) return interaction.editReply({ content: 'Error: You must be in the same voice channel as the bot.' });

        try {
            if (optionField === 'enable') {
                player.set('autoplay', true);

                const embedEnable = new EmbedBuilder()
                    .setTitle('Autoplay Enabled')
                    .setColor(configuration.embedColor);

                return interaction.editReply({ embeds: [embedEnable] });
            } else if (optionField === 'disable') {
                player.set('autoplay', false);

                const embedDisable = new EmbedBuilder()
                    .setTitle('Autoplay Disabled')
                    .setColor(configuration.embedColor);

                return interaction.editReply({ embeds: [embedDisable] });
            } else {
                return interaction.editReply({ content: 'Error: Invalid autoplay option selected.' });
            }
        } catch {
            return interaction.editReply({ content: 'Error: Failed to update autoplay setting.' });
        }

	},
};