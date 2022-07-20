const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('setnick')
        .setDescription('Change the selected user\'s nickname')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('ManageNicknames')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageNicknames')) return interaction.reply({ embeds: [noPermission] });

        const userField = interaction.options.getMember('user');
            if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot change your own nickname.' });

        const nicknameField = interaction.options.getString('nickname');

            if (nicknameField.length <= '32') {
                const embed = new EmbedBuilder()
                    .setDescription(`**${userField.user.username}**'s nickname successfully changed to **${nicknameField}**`)
                    .setColor(embedColor);

                interaction.reply({ embeds: [embed] }).then(userField.setNickname(nicknameField));
            }
            else {
                return interaction.reply({ content: 'Error: Nickname must be 32 characters or fewer.' });
            }
        }
};