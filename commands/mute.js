const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MUTE_MEMBERS** permission in `Server settings > Roles > Skye > Permissions` to use this command.' });
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot mute a bot.' });
				if (memberField.permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: 'Error: This user cannot be muted.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const mutedRole = interaction.guild.roles.cache.find(mt => mt.name === 'Muted');
            if (!mutedRole) return interaction.reply({ content: 'Error: No existing mute role found. Create a new role, **Muted** in `Server settings > Roles` to use this command.' });
            if (memberField.roles.cache.has(mutedRole.id)) return interaction.reply({ content: 'Error: This user is already muted.' });

		const embedUserDM = new MessageEmbed()
            .setTitle('Mute')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'By', value: `\`${interaction.user.tag}\`` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Mute')
            .addFields(
                { name: 'User', value: `${memberField}` },
                { name: 'ID', value: `\`${memberField.user.id}\`` },
                { name: 'By', value: `\`${interaction.user.tag}\`` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        interaction.reply({ embeds: [embed] });
            memberField.send({ embeds: [embedUserDM] }).then(memberField.roles.add(mutedRole));
        }
};