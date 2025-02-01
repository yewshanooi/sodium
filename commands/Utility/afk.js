const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set another user\'s status as away')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('option').setDescription('Select whether user is AFK').addChoices({ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' }).setRequired(true)),
    cooldown: '10',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, configuration) {
        if (!interaction.guild.members.me.permissions.has('ManageNicknames')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageNicknames')) return interaction.reply({ embeds: [global.errors[2]] });

            const userField = interaction.options.getUser('user');
            const memberUserField = interaction.options.getMember('user');

                // Can use 'memberUserField.user.bot' or 'userField.bot'
                if (memberUserField.user.bot === true) return interaction.reply({ content: 'Error: You cannot set a bot\'s status as AFK.' });

                if (memberUserField === interaction.member) return interaction.reply({ content: 'Error: You cannot set your own status as AFK.' });

            const optionField = interaction.options.getString('option');
                if (optionField === 'true') {
                    const successEmbed = new EmbedBuilder()
                        .setDescription(`**${userField.username}** is now AFK`)
                        .setColor(configuration.embedColor);

                    interaction.reply({ embeds: [successEmbed] }).then(memberUserField.setNickname(`[AFK] ${userField.displayName}`));
                }
                if (optionField === 'false') {
                    const successEmbed = new EmbedBuilder()
                        .setDescription(`**${userField.username}** is no longer AFK`)
                        .setColor(configuration.embedColor);

                    interaction.reply({ embeds: [successEmbed] }).then(memberUserField.setNickname(userField.displayName));
                }
        }
};