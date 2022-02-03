const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock every text channel in the guild to prevent users from sending messages')
        .addBooleanOption(option => option.setName('option').setDescription('Select an option').setRequired(true)),
    cooldown: '20',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

         const channels = interaction.guild.channels.cache.filter(ch => ch.type !== 'category');

            const booleanField = interaction.options.getBoolean('option');

            const embedTrue = new MessageEmbed()
                .setTitle('Guild Lockdown')
                .setDescription(`Successfully locked text channels in guild **${interaction.guild}**`)
                .setTimestamp()
                .setColor(embedColor);

            const embedFalse = new MessageEmbed()
                .setTitle('Guild Lockdown')
                .setDescription(`Successfully unlocked text channels in guild **${interaction.guild}**`)
                .setTimestamp()
                .setColor(embedColor);

            if (booleanField === true) {
                interaction.reply({ embeds: [embedTrue] }).then(channels.forEach(channel => {
                    channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                }));
            }

            else {
                interaction.reply({ embeds: [embedFalse] }).then(channels.forEach(channel => {
                    channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true
                    });
                }));
            }
        }
};