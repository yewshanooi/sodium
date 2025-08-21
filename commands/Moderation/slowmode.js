const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set the rate limit for current channel')
        .addIntegerOption(option => option.setName('duration').setDescription('Enter a duration in seconds (between 0 and 21600)').setMinValue(0).setMaxValue(21600).setRequired(true)),
    cooldown: '15',
    category: 'Moderation',
    guildOnly: true,
    execute (interaction, client) {
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Channels** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ embeds: [global.errors[2]] });

        const durationField = interaction.options.getInteger('duration');

            if (durationField === 0) {
                const embedFalse = new EmbedBuilder()
                    .setDescription('Successfully disabled slowmode for current channel')
                    .setColor(client.config.embedColor);
                interaction.reply({ embeds: [embedFalse] }).then(interaction.channel.setRateLimitPerUser(0));
            } else {
                const embedTrue = new EmbedBuilder()
                    .setDescription(`Successfully set current channel's rate limit to **${durationField}** second(s)`)
                    .setColor(client.config.embedColor);
                interaction.reply({ embeds: [embedTrue] }).then(interaction.channel.setRateLimitPerUser(durationField));
            }
        }
};