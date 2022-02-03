const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set another user\'s status as AFK')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addBooleanOption(option => option.setName('option').setDescription('Select whether user is AFK').setRequired(true)),
    cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_NICKNAMES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                // if (memberField.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: This user\'s nickname cannot be changed.' });

                if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot set your own status as AFK.' });

            const booleanField = interaction.options.getBoolean('option');
                if (booleanField === true) {
                    const embed = new MessageEmbed()
                        .setDescription(`***${memberField.user.username}** is now AFK*`)
                        .setColor(embedColor);

                    interaction.reply({ embeds: [embed] }).then(memberField.setNickname(`[AFK] ${memberField.user.username}`));
                }
                if (booleanField === false) {
                    const embed = new MessageEmbed()
                        .setDescription(`***${memberField.user.username}** is no longer AFK*`)
                        .setColor(embedColor);

                    interaction.reply({ embeds: [embed] }).then(memberField.setNickname(memberField.user.username));
                }
        }
};