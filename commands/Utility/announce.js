const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Use the bot to say something')
        .addStringOption(option => option.setName('title').setDescription('Enter a title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Enter a description').setRequired(true)),
    cooldown: '3',
    category: 'Utility',
    guildOnly: true,
    execute (interaction, client) {
        const titleField = interaction.options.getString('title');
        const descriptionField = interaction.options.getString('description');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ size: 64 })}` })
            .setTitle(titleField)
            .setDescription(descriptionField)
            .setColor(client.config.embedColor);

        interaction.reply({ embeds: [embed] });
    }
};