const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Sends a direct message to the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: '8',
    guildOnly: true,
    execute (interaction) {
		const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot send a message to the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot send a message to a bot.' });

            if (userField === interaction.user) return interaction.reply({ content: 'Error: You cannot send a message to yourself.' });

        const messageField = interaction.options.getString('message');

            const embed = new MessageEmbed()
                .setTitle('Message')
                .setDescription(`${messageField}\n\n*from \`${interaction.user.tag}\`*`)
                .setColor(embedColor);

            const successEmbed = new MessageEmbed()
                .setDescription(`*Successfully send message to ${userField}*`)
                .setColor(embedColor);

        userField.send({ embeds: [embed] })
            .then(() => {
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(() => {
                interaction.reply({ content: 'Error: Cannot send messages to this user. User must enable **Allow direct messages from server members** in `User Settings > Privacy & Safety` to receive Direct Messages.' });
            });
        }
};