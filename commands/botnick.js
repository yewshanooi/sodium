const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botnick')
		.setDescription('Change bot\'s nickname in the current server')
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setRequired(true)),
    cooldown: '20',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_NICKNAMES')) return interaction.reply('Error: Bot permission denied. Enable **MANAGE_NICKNAMES** permission in `Server settings > Roles > Skye > Permissions` to use this command.');
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) return interaction.reply('Error: You have no permission to use this command.');

        const stringField = interaction.options.getString('nickname');

        if (stringField.length <= '32') {
            const embed = new MessageEmbed()
                .setTitle('Bot Nickname')
                .setDescription(`Nickname successfully changed to **${stringField}**`)
                .setTimestamp()
                .setColor(embedColor);

            interaction.guild.me.setNickname(stringField).then(interaction.reply({ embeds: [embed] }));
        }
        else {
            return interaction.reply('Error: Nickname must be 32 characters or fewer.');
        }
	}
};