const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('undeafen')
        .setDescription('Undeafen the selected user with or without a reason')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Enter a reason')),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('DeafenMembers')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Deafen Members** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('DeafenMembers')) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getMember('user');
                if (userField.user.bot === true) return interaction.reply({ content: 'Error: You cannot undeafen a bot.' });
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot undeafen yourself.' });

                const Guild = interaction.client.guilds.cache.get(interaction.guild.id);
                const Member = Guild.members.cache.get(userField.user.id);
                    if (!Member.voice.channel) return interaction.reply({ content: 'Error: This user is currently not in a voice channel.' });

            let reasonField = interaction.options.getString('reason');
                if (!reasonField) {
                    reasonField = 'None';
                }

        const embed = new EmbedBuilder()
            .setTitle('Undeafen')
            .addFields(
                { name: 'User', value: `${userField}` },
                { name: 'ID', value: `\`${userField.user.id}\`` },
                { name: 'By', value: `${interaction.member}` },
                { name: 'Reason', value: `\`${reasonField}\`` }
            )
            .setTimestamp()
            .setColor('#ff0000');

        interaction.reply({ embeds: [embed] }).then(userField.voice.setDeaf(false));
	}
};