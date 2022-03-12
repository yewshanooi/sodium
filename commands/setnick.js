const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('setnick')
        .setDescription('Change the selected user\'s nickname')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('nick').setDescription('Enter a nickname (max 32 characters)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_NICKNAMES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const memberField = interaction.options.getMember('user');
            if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot setnick yourself.' });

        const stringField = interaction.options.getString('nick');

            if (stringField.length <= '33') {
                const embed = new MessageEmbed()
                    .setTitle('Nickname')
                    .setDescription(`**${memberField.user.username}**'s nickname successfully changed to **${stringField}**`)
                    .setColor(embedColor);

                interaction.reply({ embeds: [embed] }).then(memberField.setNickname(stringField));
            }
            else {
                return interaction.reply({ content: 'Error: Nickname must be 32 characters or fewer.' });
            }
        }
};