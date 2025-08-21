const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('clearqueue')
        .setDescription('Empty the playback queue.'),
    
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
        
        player.queue.clear();
        return interaction.reply({ content: '🗑️ The queue has been cleared.', ephemeral: true });
    },
};