const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('threadarchive')
        .setDescription('Archive an existing thread channel')
        .addChannelOption(option => option.setName('thread').setDescription('Select a thread channel').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_THREADS')) return interaction.reply('Error: Bot permission denied. Enable **MANAGE_THREADS** permission in `Server Settings > Roles` to use this command.');
        if (!interaction.member.permissions.has('MANAGE_THREADS')) return interaction.reply('Error: You have no permission to use this command.');

            const threadField = interaction.options.getChannel('thread');

            if (threadField.type === 'GUILD_PUBLIC_THREAD' || threadField.type === 'GUILD_PRIVATE_THREAD') {
                const embed = new MessageEmbed()
                    .setDescription(`Successfully archived **${threadField}** channel`)
                    .setColor(embedColor);

                threadField.setArchived(true)
                    .then(() => {
                        interaction.reply({ embeds: [embed] });
                    })
                    .catch(() => {
                        interaction.reply('Error: There was an error trying to archive this thread channel.');
                    });
                }
            else {
                interaction.reply('Error: This is not a thread channel.');
            }

        }
};