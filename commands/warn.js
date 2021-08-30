const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '20',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply('Error: You have no permission to use this command.');

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply('Error: You cannot warn a bot.');
                if (memberField.permissions.has('MANAGE_MESSAGES')) return interaction.reply('Error: This user cannot be warned.');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const embedUser = new MessageEmbed()
            .setTitle('Warn')
            .addField('Guild', `\`${interaction.guild.name}\``)
            .addField('By', `\`${interaction.user.tag}\``)
            .addField('Reason', `\`${reasonField}\``)
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Warn')
            .addField('User', `${memberField}`)
            .addField('ID', `\`${memberField.user.id}\``)
            .addField('By', `\`${interaction.user.tag}\``)
            .addField('Reason', `\`${reasonField}\``)
            .setTimestamp()
            .setColor('#FF0000');

        memberField.send({ embeds: [embedUser] }).then(interaction.reply({ embeds: [embed] }));
	}
};