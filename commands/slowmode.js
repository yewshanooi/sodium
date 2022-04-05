const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the rate limit for the current channel')
        .addIntegerOption(option => option.setName('value').setDescription('Enter a value (between 0 and 21600)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const valueField = interaction.options.getInteger('value');
            if (valueField < 0 || valueField > 21600) return interaction.reply({ content: 'Error: You need to input an integer between `0` and `21600`.' });

            const embed = new MessageEmbed()
                .setTitle('Slowmode')
                .setDescription(`Successfully set ${interaction.channel} rate limit to **${valueField}** second(s)`)
                .setTimestamp()
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] }).then(interaction.channel.setRateLimitPerUser(valueField));
        }
};