const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { embedColor } = require('../config.json');
const noPermission = require('../errors/noPermission.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set another user\'s status as AFK')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addBooleanOption(option => option.setName('option').setDescription('Select whether user is AFK').setRequired(true)),
    cooldown: '10',
    guildOnly: true,
    execute (interaction) {
        if (!interaction.guild.members.me.permissions.has('ManageNicknames')) return interaction.reply({ content: 'Error: Bot permission denied. Enable **Manage Nicknames** permission in `Server Settings > Roles` to use this command.' });
        if (!interaction.member.permissions.has('ManageNicknames')) return interaction.reply({ embeds: [noPermission] });

            const userField = interaction.options.getMember('user');
                if (userField === interaction.member) return interaction.reply({ content: 'Error: You cannot set your own status as AFK.' });

            const optionField = interaction.options.getBoolean('option');
                if (optionField === true) {
                    const embed = new EmbedBuilder()
                        .setDescription(`You are now AFK in **${interaction.guild.name}**`)
                        .setColor(embedColor);

                    const successEmbed = new EmbedBuilder()
                        .setDescription(`**${userField.user.username}** is now AFK`)
                        .setColor(embedColor);

                    interaction.reply({ embeds: [successEmbed] }).then(userField.send({ embeds: [embed] }));
                    userField.setNickname(`[AFK] ${userField.user.username}`);
                }
                if (optionField === false) {
                    const embed = new EmbedBuilder()
                        .setDescription(`You are no longer AFK in **${interaction.guild.name}**`)
                        .setColor(embedColor);

                    const successEmbed = new EmbedBuilder()
                        .setDescription(`**${userField.user.username}** is no longer AFK`)
                        .setColor(embedColor);

                    interaction.reply({ embeds: [successEmbed] }).then(userField.send({ embeds: [embed] }));
                    userField.setNickname(userField.user.username);
                }
        }
};