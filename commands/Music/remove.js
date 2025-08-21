const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue.')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of the song in the queue.')
                .setRequired(true)),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }

        const position = interaction.options.getInteger('number');
        if (position < 1 || position > player.queue.size) {
            return interaction.reply({ content: `Please enter a valid song number (1-${player.queue.size}).`, ephemeral: true });
        }
        
        player.queue.remove(position - 1);
        return interaction.reply({ content: `✅ The song in position \`${position}\` has been removed.` });
    },
};