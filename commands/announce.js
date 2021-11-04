const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Get the bot to announce something')
        .addStringOption(option => option.setName('title').setDescription('Enter a title').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: '3',
    guildOnly: true,
    execute (interaction) {
        const titleField = interaction.options.getString('title');
        const messageField = interaction.options.getString('message');

        const embed = new MessageEmbed()
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ size: 64 }))
            .setTitle(titleField)
            .setDescription(messageField)
            .setTimestamp()
            .setColor(embedColor);

        interaction.reply({ embeds: [embed] });
    }
};