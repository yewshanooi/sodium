const { EmbedBuilder, ChannelType, SlashCommandBuilder } = require("discord.js");

module.exports = {
    apis: ["ENABLE_LAVALINK", "FAKEYOU_USERNAME", "FAKEYOU_PASSWORD"],
    data: new SlashCommandBuilder()
        .setName('tts')
        .setDescription('Generates a TTS audio and adds it to the queue.')
        .addStringOption(option =>
            option.setName('voice')
                .setDescription('Voice model to speak with (ID). Use /voices to list available voices.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to speak.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel you want the bot to join.')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(false)),
    cooldown: '10',
    category: 'Utility',
    guildOnly: true,
    async execute (interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const memberVoiceChannel = interaction.member?.voice.channel;
        const targetVoiceChannel = interaction.options.getChannel('channel');

        let voiceChannelToJoin;
        if (targetVoiceChannel) {
            if (targetVoiceChannel.members.size > 0) {
                voiceChannelToJoin = targetVoiceChannel;
            } else {
                return interaction.editReply({ content: 'The specified voice channel is empty. Please specify a channel with members or join one yourself.' });
            }
        } else if (memberVoiceChannel) {
            voiceChannelToJoin = memberVoiceChannel;
        } else {
            voiceChannelToJoin = interaction.guild.channels.cache.find(c =>
                c.type === ChannelType.GuildVoice && c.members.size > 0
            );
            if (!voiceChannelToJoin) {
                return interaction.editReply({ content: 'You are not in a voice channel and no default voice channel with members could be found.' });
            }
        }

        if (!voiceChannelToJoin.permissionsFor(interaction.client.user).has("CONNECT") || !voiceChannelToJoin.permissionsFor(interaction.client.user).has("SPEAK")) {
            return interaction.editReply({ content: "I don't have permission to join or speak in this voice channel." });
        }

        const voiceId = interaction.options.getString("voice");
        const message = interaction.options.getString("message");

        try {
            const models = await client.fy.searchModel(voiceId);

            if (models.size < 1) {
                return interaction.editReply({ content: `No voice found with ID: \`${voiceId}\`.` });
            }
            
            const voiceModel = models.first();
            const result = await client.fy.makeTTS(voiceModel, message);
            const audioURL = result.audioURL().replace('storage.googleapis.com/vocodes-public', 'cdn-2.fakeyou.com');
            let player = client.manager.get(interaction.guild.id);
            if (player && player.voiceChannel !== voiceChannelToJoin.id) {
                player.setVoiceChannel(voiceChannelToJoin.id);
            } else if (!player) {
                player = client.manager.create({
                    guild: interaction.guild.id,
                    voiceChannel: voiceChannelToJoin.id,
                    textChannel: interaction.channel.id,
                    volume: 100,
                    selfDeafen: true
                });
                player.connect();
            }
            
            const res = await player.search(audioURL, interaction.user);
            
            if (!res || !res.tracks.length) {
                return interaction.editReply({ content: "I couldn't retrieve the audio from FakeYou. Please try again." });
            }

            const track = res.tracks[0];
            track.title = message;
            track.author = voiceModel.title;
            track.uri = audioURL;
            track.requester = interaction.user;

            player.queue.add(track);

            if (!player.playing && !player.paused && !player.queue.size) {
                player.play();
            }

            const embed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setDescription(`:microphone: **TTS added to the queue:** \n \`${message}\` by **${voiceModel.title}**`);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Error generating TTS:", error);
            await interaction.editReply({ content: `An error occurred while processing your request: ${error.message}` });
        }
    },
};