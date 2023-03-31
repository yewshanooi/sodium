const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelrename')
        .setDescription('Rename the current channel')
        .addStringOption(option => option.setName('name').setDescription('Enter a name (max 100 characters)').setMaxLength(100).setRequired(true)),
    cooldown: '8',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('ManageChannels')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Channels** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageChannels')) return interaction.reply({ embeds: [global.errors[2]] });

        const nameField = interaction.options.getString('name');

        const embed = new EmbedBuilder()
            .setDescription(`Successfully renamed channel to **${nameField}**`)
            .setColor(configuration.embedColor);
        interaction.reply({ embeds: [embed] }).then(interaction.channel.setName(nameField));
	}
};