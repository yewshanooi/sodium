const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botsetnick')
        .setDescription('Change bot\'s nickname for current guild')
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setMaxLength(32).setRequired(true)),
    cooldown: '15',
    category: 'Utility',
    guildOnly: true,
	execute (interaction, client) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) return interaction.reply({ embeds: [global.errors[2]] });

        const nicknameField = interaction.options.getString('nickname');

        const embed = new EmbedBuilder()
            .setTitle('Bot Nickname')
            .setDescription(`Nickname successfully changed to **${nicknameField}**`)
            .setColor(client.config.embedColor);

        interaction.guild.members.me.setNickname(nicknameField).then(interaction.reply({ embeds: [embed] }));
    }
};