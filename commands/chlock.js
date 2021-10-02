const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('chlock')
		.setDescription('Lock the current channel'),
    cooldown: '20',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS')) return interaction.reply('Error: Bot permission denied. Enable **MANAGE_CHANNELS** permission in `Server settings > Roles > Skye > Permissions` to use this command.');
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.reply('Error: You have no permission to use this command.');

        const currentChannel = interaction.channel;

            const embed = new MessageEmbed()
                .setTitle('Channel Lock')
                .setDescription(`Successfully locked channel ${currentChannel}`)
                .setTimestamp()
                .setColor(embedColor);

            interaction.reply({ embeds: [embed] }).then(interaction.guild.roles.cache.forEach(role => {
                currentChannel.permissionOverwrites.create(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            }));
	}
};