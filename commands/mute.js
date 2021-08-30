const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mute the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
		.addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
	cooldown: '25',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) return interaction.reply('Error: You have no permission to use this command.');

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply('Error: You cannot mute a bot.');
				if (memberField.permissions.has('MUTE_MEMBERS')) return interaction.reply('Error: This user cannot be muted.');

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const mutedRole = interaction.guild.roles.cache.find(mt => mt.name === 'Muted');
            if (!mutedRole) return interaction.reply('Error: No existing mute role found. Create a new role, **Muted** in `Server settings > Roles` to use this command.');
            if (memberField.roles.cache.has(mutedRole.id)) return interaction.reply('Error: This user is already muted.');

        /*
         * if (!mutedRole) {
         *     message.guild.roles.create({
         *         data: {
         *             name: 'Muted',
         *             color: '#FFFFFF',
         *             permissions: []
         *             }
         *         });
         *         message.guild.channels.cache.forEach(channel => {
         *             channel.createOverwrite(mutedRole, {
         *                 SEND_MESSAGES: false,
         *                 ADD_REACTIONS: false,
         *                 SPEAK: false,
         *                 CONNECT: false
         *             });
         *         });
         * }
         */

        // Bot will create new 'mutedRole' if guild doesn't have existing role in a future update.

		const embedUser = new MessageEmbed()
            .setTitle('Mute')
            .addField('Guild', `\`${interaction.guild.name}\``)
            .addField('By', `\`${interaction.user.tag}\``)
            .addField('Reason', `\`${reasonField}\``)
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Mute')
            .addField('User', `${memberField}`)
            .addField('ID', `\`${memberField.user.id}\``)
            .addField('By', `\`${interaction.user.tag}\``)
            .addField('Reason', `\`${reasonField}\``)
            .setTimestamp()
            .setColor('#FF0000');

        interaction.reply({ embeds: [embed] });
        memberField.send({ embeds: [embedUser] }).then(memberField.roles.add(mutedRole));
	}
};