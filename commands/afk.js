const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set another user\'s status as AFK')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addBooleanOption(option => option.setName('option').setDescription('Select whether user is AFK').setRequired(true)),
    cooldown: '10',
    guildOnly: true,
    execute (interaction, configuration, errors) {
        if (!interaction.guild.members.me.permissions.has('ManageNicknames')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageNicknames')) return interaction.reply({ embeds: [errors[3] /*noPermission*/ ] });

            const userField = interaction.options.getMember('user');
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot set your own status as AFK.' });

            const optionField = interaction.options.getBoolean('option');
                if (optionField === true) {
                    const embed = new EmbedBuilder()
                        .setDescription(`You are now AFK in **${interaction.guild.name}**`)
                        .setColor(configuration.embedColor);

                    const successEmbed = new EmbedBuilder()
                        .setDescription(`**${userField.user.username}** is now AFK`)
                        .setColor(configuration.embedColor);

                    interaction.reply({ embeds: [successEmbed] }).then(userField.send({ embeds: [embed] }));
                    userField.setNickname(`[AFK] ${userField.user.username}`);
                }
                if (optionField === false) {
                    const embed = new EmbedBuilder()
                        .setDescription(`You are no longer AFK in **${interaction.guild.name}**`)
                        .setColor(configuration.embedColor);

                    const successEmbed = new EmbedBuilder()
                        .setDescription(`**${userField.user.username}** is no longer AFK`)
                        .setColor(configuration.embedColor);

                    interaction.reply({ embeds: [successEmbed] }).then(userField.send({ embeds: [embed] }));
                    userField.setNickname(userField.user.username);
                }
        }
};