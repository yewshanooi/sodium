const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spoiler')
        .setDescription('Send your message as a spoiler')
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: '5',
    guildOnly: true,
    execute (interaction) {
        const textField = interaction.options.getString('message');

            const embed = new MessageEmbed()
                .setDescription(`**${interaction.user.username} said:** ||${textField}||`)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
};