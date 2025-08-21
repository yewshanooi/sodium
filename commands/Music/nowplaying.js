const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { convertTime } = require('../../utils/convert.js');
const { progressbar } = require('../../utils/progressbar.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Displays the currently playing song.'),
    
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        const player = client.manager.get(interaction.guild.id);
        if (!player || !player.queue.current) {
            return interaction.reply({ content: 'No music is currently playing.', ephemeral: true });
        }

        const song = player.queue.current;
        let embed = new EmbedBuilder()
            .setAuthor({ name: `🎶 Now Playing`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setTitle(`**${song.title}**`)
            .setURL(`${song.uri}`)
            .addFields(
                { name: `Channel`, value: `${song.author}`, inline: true },
                { name: `Added by`, value: `<@${song.requester.id}>`, inline: true },
                { name: `Duration`, value: `**\`[${convertTime(song.duration)}]\`**`, inline: true },
            )
            .setThumbnail(song.displayThumbnail("mqdefault"))
            .setColor(client.config.embedColor)
            .addFields(
                { name: "\u200b", value: progressbar(song.duration, player.position, 15, '▬', '🟢'), inline: false },
                { name: "\u200b", value: `\`${convertTime(player.position)} / ${convertTime(song.duration)}\``, inline: false }
            );

        return interaction.reply({ embeds: [embed] });
    },
};