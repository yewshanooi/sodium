const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
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
        if (!interaction.guild.members.me.permissions.has('ManageChannels')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Channels** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageChannels')) return interaction.reply({ embeds: [noPermission] });

        const channelField = interaction.options.getChannel('channel');

        if (channelField === interaction.channel) {
            const userDmEmbed = new EmbedBuilder()
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
            const embed = new EmbedBuilder()
                .setDescription(`Successfully deleted **#${channelField.name}** channel`)
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(channelField.delete());
        }
    }
};