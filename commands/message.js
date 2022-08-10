const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Sends a Direct Message to the selected user')
        .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Enter a message').setRequired(true)),
    cooldown: '8',
    guildOnly: true,
    execute (interaction, configuration, errors) {
		const userField = interaction.options.getUser('user');
            if (userField === interaction.client.user) return interaction.reply({ content: 'Error: You cannot send a message to the bot.' });
            if (userField.bot === true) return interaction.reply({ content: 'Error: You cannot send a message to a bot.' });

            if (userField === interaction.user) return interaction.reply({ content: 'Error: You cannot send a message to yourself.' });

        const messageField = interaction.options.getString('message');

            const embed = new EmbedBuilder()
                .setTitle('Message')
                .setDescription(`${messageField}\n\n*from \`${interaction.user.tag}\`*`)
                .setColor(configuration.embedColor);

            const successEmbed = new EmbedBuilder()
                .setDescription(`Successfully send message to ${userField}`)
                .setColor(configuration.embedColor);

        userField.send({ embeds: [embed] })
            .then(() => {
                interaction.reply({ embeds: [successEmbed], ephemeral: true });
            })
            .catch(() => {
                interaction.reply({ embeds: [errors[4] /*privateDM*/ ] });
            });
        }
};