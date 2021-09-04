const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channeldel')
        .setDescription('Delete the selected channel')
        .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)),
    cooldown: '25',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply('Error: You have no permission to use this command.');

        const channelField = interaction.options.getChannel('channel');

        if (channelField === interaction.channel) {
            const embedToDM = new MessageEmbed()
                .setTitle('Channel Delete')
                .setDescription(`Successfully deleted channel **#${channelField.name}** in **${interaction.guild.name}** guild`)
                .setTimestamp()
                .setColor(embedColor);

            interaction.user.send({ embeds: [embedToDM] }).then(channelField.delete());
        }
        else {
            const embed = new MessageEmbed()
                .setTitle('Channel Delete')
                .setDescription(`Successfully deleted channel **#${channelField.name}**`)
                .setTimestamp()
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(channelField.delete());
        }
    }
};