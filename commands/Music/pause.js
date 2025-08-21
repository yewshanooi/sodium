const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current music.'),
    
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
        if (player.paused) {
            return interaction.reply({ content: 'The music is already paused.', ephemeral: true });
        }
        
        player.pause(true);
        return interaction.reply({ content: `⏸️ The music has been paused.` });
    },
};