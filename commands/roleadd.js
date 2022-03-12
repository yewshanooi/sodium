const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('roleadd')
        .setDescription('Add a role to the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
    cooldown: '5',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_ROLES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');

                if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot roleadd yourself.' });

            const roleField = interaction.options.getRole('role');
                if (memberField.roles.cache.has(roleField.id)) return interaction.reply({ content: 'Error: This user already have the role.' });

            const embed = new MessageEmbed()
                .setTitle('Role Add')
                .setDescription(`Successfully added **${roleField}** role to user **${memberField}**`)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] }).then(memberField.roles.add(roleField.id));
        }
};