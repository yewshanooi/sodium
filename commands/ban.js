const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '25',
    guildOnly: true,
	execute (interaction) {
        if (!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **BAN_MEMBERS** permission in `Server settings > Roles > Skye > Permissions` to use this command.' });
        if (!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot ban a bot.' });
				// if (memberField.permissions.has('BAN_MEMBERS')) return interaction.reply({ content: 'Error: This user cannot be banned.' });

            let reasonField = interaction.options.getString('reason');
				if (!reasonField) {
					reasonField = 'None';
				}

        const embed = new MessageEmbed()
            .setTitle('Ban')
            .addFields(
                { name: 'User', value: `${memberField}` },
                { name: 'ID', value: `\`${memberField.user.id}\`` },
                { name: 'By', value: `\`${interaction.user.tag}\`` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        interaction.reply({ embeds: [embed] }).then(memberField.ban({ reason: reasonField }));
	}
};