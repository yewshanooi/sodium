const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roleadd')
		.setDescription('Add role to selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
	cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply('Error: Bot permission denied. Enable **MANAGE_ROLES** permission in `Server settings > Roles > Skye > Permissions` to use this command.');
        if (!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply('Error: You have no permission to use this command.');

            const memberField = interaction.options.getMember('user');

            const roleField = interaction.options.getRole('role');
                if (memberField.roles.cache.has(roleField.id)) return interaction.reply('Error: This user already have the role.');

            const embed = new MessageEmbed()
                .setTitle('Role Add')
                .setDescription(`Successfully added **${roleField}** role to user **${memberField}**`)
                .setTimestamp()
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] }).then(memberField.roles.add(roleField.id));
        }
};