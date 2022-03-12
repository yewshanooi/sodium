const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('roleremove')
        .setDescription('Remove a role from the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
    cooldown: '5',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_ROLES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const memberField = interaction.options.getMember('user');

            if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot roleremove yourself.' });

        const roleField = interaction.options.getRole('role');
            if (!memberField.roles.cache.has(roleField.id)) return interaction.reply({ content: 'Error: This user doesn\'t have the role.' });

            if (roleField === interaction.guild.roles.cache.find(role => role.name === '@everyone')) {
                interaction.reply({ content: 'Error: This role cannot be removed from the user.' });
            }
            else {
                const embed = new MessageEmbed()
                    .setTitle('Role Remove')
                    .setDescription(`Successfully removed **${roleField}** role from user **${memberField}**`)
                    .setColor(embedColor);
                interaction.reply({ embeds: [embed] }).then(memberField.roles.remove(roleField.id));
            }

        }
};