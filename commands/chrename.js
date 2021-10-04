const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chrename')
		.setDescription('Rename the current channel')
        .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setRequired(true)),
	cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply('Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server settings > Roles > Skye > Permissions` to use this command.');
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply('Error: You have no permission to use this command.');

        const stringField = interaction.options.getString('name');
            if (stringField.length > '100') return interaction.reply('Error: Channel name must be 100 characters or fewer.');

        const embed = new MessageEmbed()
            .setTitle('Channel Rename')
            .setDescription(`Successfully renamed channel to **${stringField}**`)
            .setTimestamp()
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] }).then(interaction.channel.setName(stringField));
	}
};