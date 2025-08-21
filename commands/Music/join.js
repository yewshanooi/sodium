const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('The bot joins the voice channel.'),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const { channel } = interaction.member.voice;
        if (!channel) {
            return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
        }
        if (interaction.guild.members.cache.get(client.user.id).voice.channel) {
            return interaction.reply({ content: `I'm already in a voice channel.`, ephemeral: true });
        }
        
        const player = client.manager.create({
            guild: interaction.guild.id,
            voiceChannel: channel.id,
            textChannel: interaction.channel.id,
            volume: 100,
            selfDeafen: true,
        });
        player.connect();

        return interaction.reply({ content: `I've joined the voice channel <#${channel.id}>!`, ephemeral: true });
    },
};