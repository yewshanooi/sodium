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

        const userField = interaction.options.getMember('user');

            if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot add a role to yourself.' });

        const roleField = interaction.options.getRole('role');
            if (userField.roles.cache.has(roleField.id)) return interaction.reply({ content: 'Error: This user already have the role.' });

            if (roleField === interaction.guild.roles.cache.find(role => role.name === '@everyone')) {
                interaction.reply({ content: 'Error: This role cannot be added to the user.' });
            }
            else {
                const embed = new MessageEmbed()
                    .setTitle('Role Add')
                    .setDescription(`Successfully added **${roleField}** role to user **${userField}**`)
                    .setColor(embedColor);
                interaction.reply({ embeds: [embed] }).then(userField.roles.add(roleField.id));
            }
        }
};

// Added role check to make sure that '@everyone' role is not added to user.