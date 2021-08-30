const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Enable slowmode for the current channel')
        .addIntegerOption(option => option.setName('value').setDescription('Enter an value').setRequired(true)),
	cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply('Error: You have no permission to use this command.');

        const integerField = interaction.options.getInteger('value');
            if (integerField < 0 || integerField > '21600') return interaction.reply('Error: You need to input a number between `0` and `21600`.');

        const embed = new MessageEmbed()
            .setTitle('Channel Slowmode')
            .setDescription(`Successfully set slowmode to **${integerField}** second(s)`)
            .setTimestamp()
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] }).then(interaction.channel.setRateLimitPerUser(integerField));
	}
};