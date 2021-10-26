const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Sends a private message to the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: '10',
    guildOnly: true,
    execute (interaction) {
		const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot send a message to the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot send a message to a bot.' });

        const stringField = interaction.options.getString('message');

            const embed = new MessageEmbed()
                .setTitle(`Incoming message from **${interaction.user.tag}**`)
                .setDescription(`\`${stringField}\``)
                .setColor(embedColor);

            const successEmbed = new MessageEmbed()
                .setDescription(`*Successfully send message to ${userField}*`)
                .setColor(embedColor);

            interaction.reply({ embeds: [successEmbed] }).then(userField.send({ embeds: [embed] }));
            // ephemeral: true will be added in a future update. Currently, bots cannot read those kind of messages yet and will output an error
        }
};