const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botsetnick')
        .setDescription('Change bot\'s nickname in current server')
        .addStringOption(option => option.setName('nickname').setDescription('Enter a nickname (max 32 characters)').setRequired(true)),
    cooldown: '15',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.me.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MANAGE_NICKNAMES** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('MANAGE_NICKNAMES')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

        const nicknameField = interaction.options.getString('nickname');

        if (nicknameField.length <= '32') {
            const embed = new MessageEmbed()
                .setTitle('Bot Nickname')
                .setDescription(`Nickname successfully changed to **${nicknameField}**`)
                .setColor(embedColor);

            interaction.guild.me.setNickname(nicknameField).then(interaction.reply({ embeds: [embed] }));
        }
        else {
            return interaction.reply({ content: 'Error: Nickname must be 32 characters or fewer.' });
        }
	}
};