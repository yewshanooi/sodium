const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roledel')
		.setDescription('Remove role from selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
	cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply('Error: You have no permission to use this command.');

            const memberField = interaction.options.getMember('user');

            const roleField = interaction.options.getRole('role');
                if (!memberField.roles.cache.has(roleField.id)) return interaction.reply('Error: This user doesn\'t have the role.');

            const embed = new MessageEmbed()
                .setTitle('Role Delete')
                .setDescription(`Successfully removed **${roleField}** role from user **${memberField}**`)
                .setTimestamp()
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] }).then(memberField.roles.remove(roleField.id));
        }
};