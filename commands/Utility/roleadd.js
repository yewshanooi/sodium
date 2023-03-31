const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('roleadd')
        .setDescription('Add a role to the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)),
    cooldown: '5',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('ManageRoles')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Roles** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageRoles')) return interaction.reply({ embeds: [global.errors[2]] });

        const userField = interaction.options.getMember('user');
            if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot add a role to yourself.' });

        const roleField = interaction.options.getRole('role');
            if (userField.roles.cache.has(roleField.id)) return interaction.reply({ content: 'Error: Selected user already have that role.' });
            if (roleField.managed === true) return interaction.reply({ content: 'Error: This role cannot be added to the user.' });

            if (roleField === interaction.guild.roles.cache.find(role => role.name === '@everyone')) {
                interaction.reply({ content: 'Error: This role cannot be added to the user.' });
            }
            else {
                const embed = new EmbedBuilder()
                    .setDescription(`Successfully added **${roleField}** role to **${userField}** user`)
                    .setColor(configuration.embedColor);
                interaction.reply({ embeds: [embed] }).then(userField.roles.add(roleField.id));
            }
        }
};