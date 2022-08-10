const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Use the bot to announce something')
        .addStringOption(option => option.setName('title').setDescription('Enter a title').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Enter a description').setRequired(true)),
    cooldown: '3',
    guildOnly: true,
    execute (interaction, configuration) {
        const titleField = interaction.options.getString('title');
        const descriptionField = interaction.options.getString('description');

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ size: 64 })}` })
            .setTitle(titleField)
            .setDescription(descriptionField)
            .setColor(configuration.embedColor);

        interaction.reply({ embeds: [embed] });
    }
};