const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('setnick')
        .setDescription('Change the selected user\'s nickname')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_NICKNAMES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const userField = interaction.options.getMember('user');
            if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot change your own nickname.' });

        const nicknameField = interaction.options.getString('nickname');

            if (nicknameField.length <= '33') {
                const embed = new MessageEmbed()
                    .setDescription(`**${userField.user.username}**'s nickname successfully changed to **${nicknameField}**`)
                    .setColor(embedColor);

                interaction.reply({ embeds: [embed] }).then(userField.setNickname(nicknameField));
            }
            else {
                return interaction.reply({ content: 'Error: Nickname must be 32 characters or fewer.' });
            }
        }
};