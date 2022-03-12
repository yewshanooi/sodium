const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('undeafen')
        .setDescription('Undeafen the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.me.permissions.has('DEAFEN_MEMBERS')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **DEAFEN_MEMBERS** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('DEAFEN_MEMBERS')) return interaction.reply({ content: 'Error: You have no permission to use this command.' });

            const memberField = interaction.options.getMember('user');
                if (memberField.user.bot === true) return interaction.reply({ content: 'Error: You cannot undeafen a bot.' });
                if (memberField === interaction.member) return interaction.reply({ content: 'Error: You cannot undeafen yourself.' });

                const Guild = interaction.client.guilds.cache.get(interaction.guild.id);
                const Member = Guild.members.cache.get(memberField.user.id);
                    if (!Member.voice.channel) return interaction.reply({ content: 'Error: This user is currently not in a voice channel.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const embed = new MessageEmbed()
            .setTitle('Undeafen')
            .addFields(
                { name: 'User', value: `${memberField}` },
                { name: 'ID', value: `\`${memberField.user.id}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#FF0000');

        interaction.reply({ embeds: [embed] }).then(memberField.voice.setDeaf(false));
	}
};