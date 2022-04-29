const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelrename')
        .setDescription('Rename the current channel')
        .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setRequired(true)),
    cooldown: '8',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const nameField = interaction.options.getString('name');
            if (nameField.length > '100') return interaction.reply({ content: 'Error: Channel name must be 100 characters or fewer.' });

        const embed = new MessageEmbed()
            .setDescription(`Successfully renamed channel to **${nameField}**`)
            .setColor(embedColor);
        interaction.reply({ embeds: [embed] }).then(interaction.channel.setName(nameField));
	}
};