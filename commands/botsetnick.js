const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('botsetnick')
        .setDescription('Change bot\'s nickname in current server')
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
	execute (interaction, configuration, errors) {
        if (!interaction.guild.members.me.permissions.has('ManageNicknames')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageNicknames')) return interaction.reply({ embeds: [errors[3]] });

        const nicknameField = interaction.options.getString('nickname');

        if (nicknameField.length <= '32') {
            const embed = new EmbedBuilder()
                .setTitle('Bot Nickname')
                .setDescription(`Nickname successfully changed to **${nicknameField}**`)
                .setColor(configuration.embedColor);

            interaction.guild.members.me.setNickname(nicknameField).then(interaction.reply({ embeds: [embed] }));
        }
        else {
            return interaction.reply({ content: 'Error: Nickname must be 32 characters or fewer.' });
        }
	}
};