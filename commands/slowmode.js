const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the rate limit for the current channel')
        .addIntegerOption(option => option.setName('duration').setDescription('Enter an integer (between 0 and 21600)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ embeds: [noPermission] });

        const durationField = interaction.options.getInteger('duration');
            if (durationField < 0 || durationField > 21600) return interaction.reply({ content: 'Error: You need to input a valid integer between `0` and `21600`.' });

            if (durationField === 0) {
                const embedDisabled = new MessageEmbed()
                    .setDescription('Successfully disabled slowmode for current channel')
                    .setColor(embedColor);
                interaction.reply({ embeds: [embedDisabled] }).then(interaction.channel.setRateLimitPerUser(0));
            }
            else {
                const embed = new MessageEmbed()
                    .setDescription(`Successfully set current channel's rate limit to **${durationField}** second(s)`)
                    .setColor(embedColor);
                interaction.reply({ embeds: [embed] }).then(interaction.channel.setRateLimitPerUser(durationField));
            }
        }
};