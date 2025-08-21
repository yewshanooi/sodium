const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove a role from the selected user')
        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a role to the selected user')
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
            .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a role from the selected user')
            .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
            .addRoleOption(option => option.setName('role').setDescription('Select a role').setRequired(true))),
    cooldown: '5',
    category: 'Moderation',
    guildOnly: true,
    execute (interaction, client) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Roles** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({ embeds: [global.errors[2]] });

        // role add Subcommand
        if (interaction.options.getSubcommand() === 'add') {
            const userField = interaction.options.getMember('user');
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot add a role to yourself.' });

            const roleField = interaction.options.getRole('role');
                if (userField.roles.cache.has(roleField.id)) return interaction.reply({ content: 'Error: Selected user already have that role.' });
                if (roleField.managed === true) return interaction.reply({ content: 'Error: This role cannot be added to the user.' });

                if (roleField === interaction.guild.roles.cache.find(role => role.name === '@everyone')) {
                    interaction.reply({ content: 'Error: This role cannot be added to the user.' });
                } else {
                    const embed = new EmbedBuilder()
                        .setDescription(`Successfully added **${roleField}** role to **${userField}** user`)
                        .setColor(client.config.embedColor);
                    interaction.reply({ embeds: [embed] }).then(userField.roles.add(roleField.id));
                }
        }

        // role remove Subcommand
        if (interaction.options.getSubcommand() === 'remove') {
            const userField = interaction.options.getMember('user');
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot remove a role from yourself.' });

            const roleField = interaction.options.getRole('role');
                if (!userField.roles.cache.has(roleField.id)) return interaction.reply({ content: 'Error: Selected user doesn\'t have that role.' });

                if (roleField === interaction.guild.roles.cache.find(role => role.name === '@everyone')) {
                    interaction.reply({ content: 'Error: This role cannot be removed from the user.' });
                } else {
                    const embed = new EmbedBuilder()
                        .setDescription(`Successfully removed **${roleField}** role from **${userField}** user`)
                        .setColor(client.config.embedColor);
                    interaction.reply({ embeds: [embed] }).then(userField.roles.remove(roleField.id));
                }
        }

    }
};