const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const privateDM = require('../errors/privateDM.js');
const noPermission = require('../errors/noPermission.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channeldelete')
        .setDescription('Delete the selected channel')
        .addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)),
    cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ embeds: [noPermission] });

        const channelField = interaction.options.getChannel('channel');

        if (channelField === interaction.channel) {
            const userDmEmbed = new MessageEmbed()
                .setDescription(`Successfully deleted **#${channelField.name}** channel in **${interaction.guild.name}** guild`)
                .setColor(embedColor);

            interaction.user.send({ embeds: [userDmEmbed] })
                .then(() => {
                    channelField.delete();
                })
                .catch(() => {
                    interaction.reply({ embeds: [privateDM] });
                });
        }
        else {
            const embed = new MessageEmbed()
                .setDescription(`Successfully deleted **#${channelField.name}** channel`)
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(channelField.delete());
        }
    }
};