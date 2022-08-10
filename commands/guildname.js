const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('guildname')
        .setDescription('Rename the current guild')
        .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setRequired(true)),
    cooldown: '20',
    guildOnly: true,
    execute (interaction, configuration, errors) {
        if (!interaction.guild.members.me.permissions.has('ManageGuild')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Guild** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageGuild')) return interaction.reply({ embeds: [errors[3]] });

        const nameField = interaction.options.getString('name');
            if (nameField.length > '100') return interaction.reply({ content: 'Error: Guild name must be 100 characters or fewer.' });

        const embed = new EmbedBuilder()
            .setDescription(`Successfully renamed guild to **${nameField}**`)
            .setColor(configuration.embedColor);
        interaction.reply({ embeds: [embed] }).then(interaction.guild.setName(nameField));
    }
};