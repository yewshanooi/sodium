const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Search a song to play or enter a YouTube URL')
        .addStringOption(option => option.setName('query').setDescription('Enter a song name or link').setRequired(true)),
    cooldown: '3',
    category: 'Music',
    guildOnly: true,
    async execute(interaction, configuration) {
        await interaction.deferReply();

        const client = interaction.client;
        const queryField = interaction.options.getString('query');

        if (!interaction.member.voice.channel) return interaction.editReply({ content: 'Error: You must join a voice channel to use this command.' });

        const player = client.manager.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: interaction.member.voice.channel.id,
            textChannelId: interaction.channel.id,
            autoPlay: true,
        });

        try {
            player.connect();

            const result = await client.manager.search({ query: queryField });
                if (!result.tracks.length) return interaction.editReply({ content: 'Error: No results found.' });

            player.queue.add(result.tracks[0]);
                if (!player.playing) player.play();

            const embed = new EmbedBuilder()
                .setTitle('Added to queue')
                .setDescription(`${result.tracks[0].title}`)
                .setColor(configuration.embedColor);

            return interaction.editReply({ embeds: [embed] });
        } catch (err) {
            return interaction.editReply({ content: 'Error: There was an error trying to play the song.' });
        }
    },
};