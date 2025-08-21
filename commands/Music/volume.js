const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust the volume of the music.')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The volume level (0-200).')
                .setRequired(true)),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }

        const volume = interaction.options.getInteger('level');
        if (volume < 0 || volume > 200) {
            return interaction.reply({ content: 'The volume must be a number between 0 and 200.', ephemeral: true });
        }
        
        player.setVolume(volume);
        return interaction.reply({ content: `🔊 The volume has been set to \`${volume}\`.` });
    },
};