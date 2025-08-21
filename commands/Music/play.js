const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { convertTime } = require('../../utils/convert.js');
const { ActivityType } = require('discord.js');

module.exports = {
    apis: ["ENABLE_LAVALINK"],
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or playlist.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The name of the song or YouTube/Spotify URL.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel you want the bot to join.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(false)),
    cooldown: '5',
    category: 'Music',
    guildOnly: true,
    async execute (interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const memberVoiceChannel = interaction.member.voice.channel;
        const targetVoiceChannel = interaction.options.getChannel('channel');

        let voiceChannelToJoin;

        // LLogic to determine which voice channel to join
        if (targetVoiceChannel) {
            // A channel was specified by ID
            if (targetVoiceChannel.members.size > 0) {
                voiceChannelToJoin = targetVoiceChannel;
            } else {
                return interaction.editReply({ content: 'The specified voice channel is empty. Please specify a channel with members or join one yourself.' });
            }
        } else if (memberVoiceChannel) {
            // The user is in a voice channel
            voiceChannelToJoin = memberVoiceChannel;
        } else {
            // The user is not in a channel, search for a default one
            // Assumes you have a default voice channel set up or find the first available one
            // This is just an example, you can modify it to fit your server
            voiceChannelToJoin = interaction.guild.channels.cache.find(c => 
                c.type === ChannelType.GuildVoice && c.members.size > 0
            );
            if (!voiceChannelToJoin) {
                return interaction.editReply({ content: 'You are not in a voice channel and no default voice channel with members could be found.' });
            }
        }

        let player = client.manager.get(interaction.guild.id);
        if (player && player.voiceChannel !== voiceChannelToJoin.id) {
             player.setVoiceChannel(voiceChannelToJoin.id);
        } else if (!player) {
            player = client.manager.create({
                guild: interaction.guild.id,
                voiceChannel: voiceChannelToJoin.id,
                textChannel: interaction.channel.id,
                volume: 100,
                selfDeafen: true,
            });
            player.connect();
        }

        const query = interaction.options.getString('query');
        let res;

        try {
            res = await player.search(query, interaction.user);
            if (res.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw res.exception;
            }
        } catch (err) {
            return interaction.editReply({ content: `There was an error searching for the song: ${err.message}` });
        }

        // Update the bot's Rich Presence
        client.user.setActivity(query, { type: ActivityType.Listening });

        switch (res.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                return interaction.editReply({ content: `No results found for \`${query}\`.` });

            case 'TRACK_LOADED':
            case 'SEARCH_RESULT':
                player.queue.add(res.tracks[0]);
                if (!player.playing && !player.paused && !player.queue.size) {
                    player.play();
                    return interaction.editReply({ content: `Now playing: **${res.tracks[0].title}**` });
                } else {
                    const track = res.tracks[0];
                    const embed = new EmbedBuilder()
                        .setColor(client.config.embedColor)
                        .setTimestamp()
                        .addFields(
                            { name: `Channel`, value: `${track.author}`, inline: true },
                            { name: `Added by`, value: `<@${track.requester.id}>`, inline: true },
                            { name: `Duration`, value: `**\`[${convertTime(track.duration)}]\`**`, inline: true }
                        )
                        .setAuthor({ name: `🎵 Song added to the queue`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                        .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
                        .setTitle(`**${track.title}**`)
                        .setURL(track.uri);
                    return interaction.editReply({ embeds: [embed] });
                }

            case 'PLAYLIST_LOADED':
                player.queue.add(res.tracks);
                if (!player.playing && !player.paused) player.play();
                const embed = new EmbedBuilder()
                    .setColor(client.config.embedColor)
                    .setTimestamp()
                    .setAuthor({ name: `🎵 Playlist added to the queue`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                    .setTitle(`**${res.tracks.length} songs** from the playlist \`${res.playlist.name}\` **~** \`[${convertTime(res.playlist.duration)}]\``)
                    .setURL(res.playlist.uri);
                return interaction.editReply({ embeds: [embed] });
        }
    },
};