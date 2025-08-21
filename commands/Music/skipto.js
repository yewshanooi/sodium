const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Jump to a specific song in the queue.')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The number of the song to jump to.')
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
        
        player.queue.remove(0, position - 1);
        player.stop();

        return interaction.reply({ content: `⏭️ The song number \`${position}\` has been skipped.` });
    },
};