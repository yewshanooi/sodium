const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song.'),
    
    cooldown: '2',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }
        
        player.stop();
        return interaction.reply({ content: '⏭️ The song has been skipped.' }) && setTimeout(async () => { try { await interaction.deleteReply();} catch {}}, 30000);
    },
};