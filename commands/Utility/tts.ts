import { EmbedBuilder, MessageFlags, SlashCommandBuilder, ChannelType, GuildMember, VoiceChannel } from "discord.js";
import type { Command } from "../../Utils/types/Client";
import type { CommandInteractionOptionResolver } from "discord.js";

export default {
    apis: ["ENABLE_LAVALINK", "FAKEYOU_USERNAME", "FAKEYOU_PASSWORD"],
    gemini: true,
    data: new SlashCommandBuilder()
        .setName('tts')
        .setDescription('Generates a TTS audio and adds it to the queue. Voices with /voices')
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
    cooldown: 10,
    category: 'Utility',
    guildOnly: true,
    execute: async (client, interaction) => {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const member = interaction.member as GuildMember;
        const targetChannel = interaction.options.getChannel("channel") as VoiceChannel | null;
        const vcId = targetChannel?.id || member?.voice?.channelId;

        if (!vcId) {
            return interaction.editReply({ content: "You must be in a voice channel or specify one." });
        }

        const vc = targetChannel || (member.voice.channel as VoiceChannel);
        if (!vc.joinable || !vc.speakable) {
            return interaction.editReply({ content: "I can't join or speak in that voice channel." });
        }

        const voiceId = (interaction.options as CommandInteractionOptionResolver).getString("voice")!;
        const message = (interaction.options as CommandInteractionOptionResolver).getString("message")!;

        try {
            // Buscar modelo en FakeYou
            const models = await client.fy.searchModel(voiceId);
            if (models.size < 1) {
                return interaction.editReply({ content: `No voice found with ID: \`${voiceId}\`.` });
            }

            const voiceModel = models.first();
            const result = await client.fy.makeTTS(voiceModel, message);
            const audioURL = result.audioURL().replace(
                "storage.googleapis.com/vocodes-public",
                "cdn-2.fakeyou.com"
            );

            const player = await client.lavalink.createPlayer({
                guildId: interaction.guildId!,
                voiceChannelId: vcId,
                textChannelId: interaction.channelId,
                selfDeaf: true,
                selfMute: false,
                volume: 100
            });

            if (!player.connected) await player.connect();
            if (player.voiceChannelId !== vcId) {
                return interaction.editReply({ content: "You need to be in the same voice channel as me." });
            }

            // Buscar y añadir a la cola
            const res = await player.search(audioURL, interaction.user);
            if (!res || !res.tracks.length) {
                return interaction.editReply({ content: "I couldn't retrieve the audio from FakeYou. Please try again." });
            }

            const track: any = res.tracks[0];
            track.title = message;
            track.author = voiceModel.title;
            track.uri = audioURL;
            track.requester = interaction.user;
            track.info.title = message;
            track.info.author = voiceModel.title;
            track.info.uri = audioURL;
            

            player.queue.add(track);

            if (!player.playing) {
                await player.play({ volume: 100, paused: false });
            }

            const embed = new EmbedBuilder()
                .setColor(client.embedColor as any)
                .setDescription(`:microphone: **TTS added to the queue:** \n \`${message}\` by **${voiceModel.title}**`);

            await interaction.editReply({ embeds: [embed] });

        } catch (error: any) {
            console.error("Error generating TTS:", error);
            await interaction.editReply({ content: `An error occurred: ${error.message}` });
        }
    }
} as Command;
