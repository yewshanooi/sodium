const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the songs in the queue.'),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }
        
        player.queue.shuffle();
        return interaction.reply({ content: '🔀 The queue has been shuffled.' });
    },
};