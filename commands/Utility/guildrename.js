const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guildrename')
        .setDescription('Rename the current guild')
        .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setMaxLength(100).setRequired(true)),
    cooldown: '20',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Guild** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ embeds: [global.errors[2]] });

        const nameField = interaction.options.getString('name');

        const embed = new EmbedBuilder()
            .setDescription(`Successfully renamed guild to **${nameField}**`)
            .setColor(configuration.embedColor);
        interaction.reply({ embeds: [embed] }).then(interaction.guild.setName(nameField));
    }
};