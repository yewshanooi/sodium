const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('The bot disconnects from the voice channel.'),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }
        if (interaction.member.voice.channel.id !== player.voiceChannel) {
            return interaction.reply({ content: 'You must be in the same voice channel as the bot.', ephemeral: true });
        }
        
        player.destroy();
        return interaction.reply({ content: '👋 I\'ve disconnected from the voice channel.', ephemeral: true });
    },
};