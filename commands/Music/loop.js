const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Alternate the repetition of the music.')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('The repetition mode (track or queue)')
                .setRequired(false)
                .addChoices(
                    { name: 'track', value: 'track' },
                    { name: 'queue', value: 'queue' },
                )),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }
        if (!player.queue.current) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }

        const mode = interaction.options.getString('mode');

        if (mode === 'queue') {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "🟢" : "🔴";
            return interaction.reply({ content: `The queue repeat mode is now: ${queueRepeat}`, ephemeral: true });
        } else {
            player.setTrackRepeat(!player.trackRepeat);
            const trackRepeat = player.trackRepeat ? "🟢" : "🔴";
            return interaction.reply({ content: `The track repeat mode is now: ${trackRepeat}`, ephemeral: true });
        }
    },
};