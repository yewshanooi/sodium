const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **MUTE_MEMBERS** permission in `Server Settings > Roles > Skye > Permissions` to use this command.' });
        if (!interaction.member.permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot unmute a bot.' });
                // if (memberField.permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: 'Error: This user cannot be unmuted.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const mutedRole = interaction.guild.roles.cache.find(umt => umt.name === 'Muted');
            if (!mutedRole) return interaction.reply({ content: 'Error: No existing mute role found. Create a new role, **Muted** in `Server Settings > Roles` to use this command.' });
            if (!memberField.roles.cache.has(mutedRole.id)) return interaction.reply({ content: 'Error: This user is not muted.' });

		const embedUserDM = new MessageEmbed()
            .setTitle('Unmute')
            .addFields(
                { name: 'Guild', value: `\`${interaction.guild.name}\`` },
                { name: 'By', value: `\`${interaction.user.tag}\`` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        const embed = new MessageEmbed()
            .setTitle('Unmute')
            .addFields(
                { name: 'User', value: `${memberField}` },
                { name: 'ID', value: `\`${memberField.user.id}\`` },
                { name: 'By', value: `\`${interaction.user.tag}\`` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        memberField.send({ embeds: [embedUserDM] })
            .then(() => {
                interaction.reply({ embeds: [embed] }).then(memberField.roles.remove(mutedRole));
            })
            .catch(() => {
                interaction.reply({ content: 'Error: Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.' });
            });
        }
};