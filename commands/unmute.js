const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) return interaction.reply('Error: You have no permission to use this command.');

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply('Error: You cannot unmute a bot.');
                if (memberField.permissions.has('MUTE_MEMBERS')) return interaction.reply('Error: This user cannot be unmuted.');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const mutedRole = interaction.guild.roles.cache.find(umt => umt.name === 'Muted');
            if (!mutedRole) return interaction.reply('Error: No existing mute role found. Create a new role, **Muted** in `Server settings > Roles` to use this command.');
            if (!memberField.roles.cache.has(mutedRole.id)) return interaction.reply('Error: This user is not muted.');

		const embedUser = new MessageEmbed()
            .setTitle('Unmute')
            .addField('Guild', `\`${interaction.guild.name}\``)
            .addField('By', `\`${interaction.user.tag}\``)
            .addField('Reason', `\`${reasonField}\``)
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Unmute')
            .addField('User', `${memberField}`)
            .addField('ID', `\`${memberField.user.id}\``)
            .addField('By', `\`${interaction.user.tag}\``)
            .addField('Reason', `\`${reasonField}\``)
            .setTimestamp()
            .setColor('#FF0000');

        interaction.reply({ embeds: [embed] });
        memberField.send({ embeds: [embedUser] }).then(memberField.roles.remove(mutedRole));
	}
};