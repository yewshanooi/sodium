const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Get helpful links and invite the bot to your own server'),
    cooldown: '0',
    guildOnly: false,
    execute (interaction) {
        const embed = new MessageEmbed()
            .setTitle('Links')
            .setDescription('Get helpful links and invite the bot to your own server')
            .setColor(embedColor);

            const buttons = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setURL('https://skyebot.weebly.com')
                    .setLabel('Official Website')
                    .setStyle('LINK'))
                .addComponents(new MessageButton()
                    .setURL('https://github.com/yewshanooi/skye')
                    .setLabel('Code Repository')
                    .setStyle('LINK'));

            interaction.reply({ embeds: [embed], components: [buttons] });
        }
};