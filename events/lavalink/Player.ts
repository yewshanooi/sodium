import { type ActionRow, type MessageActionRowComponent, ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, MessageCreateOptions, TextChannel, VoiceChannel } from "discord.js";
import { DebugEvents, Player } from "lavalink-client";
import { envConfig } from "../../config";
import { BotClient, CustomRequester } from "../../Utils/types/Client";
import { formatMS_HHMMSS } from "../../Utils/Time";

const messagesMap = new Map<string, Message>();

export function PlayerEvents(client:BotClient) {
    client.lavalink.on("playerCreate", (player) => {
        logPlayer(client, player, "[LAVALINK] Created a Player");
    })
    .on("playerDestroy", (player, reason) => {
        updatePlayerEmbed(player.guildId, "👋 Disconnected");
        logPlayer(client, player, "[LAVALINK] Player got Destroyed");
        /*sendPlayerMessage(client, player, {
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Player Destroyed")
                .setDescription(`Reason: ${reason || "Unknown"}`)
                .setTimestamp()
            ]
        });*/
        client.user.setPresence({ activities: [envConfig.activity], status: envConfig.status as any });
    })
    .on("playerDisconnect", (player, voiceChannelId) => {
        logPlayer(client, player, "[LAVALINK] Player disconnected the Voice Channel", voiceChannelId);
    })
    .on("playerMove", (player, oldVoiceChannelId, newVoiceChannelId) => {
        logPlayer(client, player, "[LAVALINK] Player moved from Voice Channel", oldVoiceChannelId, " To ", newVoiceChannelId);
    })
    .on("playerSocketClosed", (player, payload) => {
        logPlayer(client, player, "[LAVALINK] Player socket got closed from lavalink", payload);
    })
    .on("playerUpdate", (player) => {
        // use this event to udpate the player in the your cache if you want to save the player's data(s) externally!
        /**
         *
        */
    })
    .on("playerMuteChange", (player, selfMuted, serverMuted) => {
        logPlayer(client, player, "INFO: playerMuteChange", { selfMuted, serverMuted });
        // e.g. what you could do is when the bot get's server muted, you could pause the player, and unpause it when unmuted again
        if(serverMuted) {
            player.set("paused_of_servermute", true);
            player.pause();
        } else {
            if(player.get("paused_of_servermute") && player.paused) player.resume();
        }
        // e.g. "unmute the player again"
        // if(serverMuted === true)  client.guilds.cache.get(player.guildId)?.members.me?.voice.setMute(false, "Auto unmute the player");
    })
    .on("playerDeafChange", (player, selfDeaf, serverDeaf) => {
        logPlayer(client, player, "INFO: playerDeafChange");
        // e.g. "re-deaf the player" because ppl think this way the bot saves traffic
        // if(serverDeaf === false) client.guilds.cache.get(player.guildId)?.members.me?.voice.setDeaf(true, "Auto re-deaf the player");
    })
    .on("playerSuppressChange", (player, suppress) => {
        logPlayer(client, player, "INFO: playerSuppressChange");
        // e.g. you could automatically unsuppress the bot so he's allowed to speak
    })
    .on("playerQueueEmptyStart", async (player, delayMs) => {
        logPlayer(client, player, "INFO: playerQueueEmptyStart");
        /*const msg = await sendPlayerMessage(client, player, {
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Player queue got empty, will disconnect <t:${Math.round((Date.now() + delayMs) / 1000)}:R>`)
            ]
        });
        if(msg) messagesMap.set(`${player.guildId}_queueempty`, msg);*/
    })
    .on("playerQueueEmptyEnd", (player) => {
        logPlayer(client, player, "INFO: playerQueueEmptyEnd");
        // you can e.g. edit the saved message
        const msg = messagesMap.get(`${player.guildId}_queueempty`);
        if(msg?.editable) {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Player got destroyed because of queue Empty`)
                ]
            })
        }
    })
    .on("playerQueueEmptyCancel", (player) => {
        logPlayer(client, player, "INFO: playerQueueEmptyEnd");
        // you can e.g. edit the saved message
        const msg = messagesMap.get(`${player.guildId}_queueempty`);
        if(msg?.editable) {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Player queue empty timer got cancelled. Because i got enqueued a new track`)
                ]
            })
        }
    })
    .on("playerVoiceLeave", (player, userId) => {
        logPlayer(client, player, "INFO: playerVoiceLeave: ", userId);
    })
    .on("playerVoiceJoin", (player, userId) => {
        logPlayer(client, player, "INFO: playerVoiceJoin: ", userId);
    })
    .on("debug", (eventKey, eventData) => {
        // skip specific log
        if(eventKey === DebugEvents.NoAudioDebug && eventData.message === "Manager is not initated yet") return;
        // skip specific event log of a log-level-state "log"
        if(eventKey === DebugEvents.PlayerUpdateSuccess && eventData.state === "log") return;
        return;
        console.group("Lavalink-Client-Debug:");
        console.log("-".repeat(20));
        console.debug(`[${eventKey}]`);
        console.debug(eventData)
        console.log("-".repeat(20));
        console.groupEnd();
    });;

    /**
     * Queue/Track Events
     */
    client.lavalink.on("trackStart", async (player, track) => {
    const avatarURL = (track?.requester as CustomRequester)?.avatar || undefined;

    const embed = new EmbedBuilder()
        .setColor(client.embedColor as any)
        .setTitle(`🎶 ${track?.info?.title}`.substring(0, 256))
        .setThumbnail(track?.info?.artworkUrl || track?.pluginInfo?.artworkUrl || null)
        .setDescription([
        `> - **Author:** ${track?.info?.author}`,
        `> - **Duration:** ${formatMS_HHMMSS(track?.info?.duration || 0)} | Ends <t:${Math.floor((Date.now() + (track?.info?.duration || 0)) / 1000)}:R>`,
        track?.info?.sourceName ? `> - **Source:** ${track?.info?.sourceName}` : undefined,
        player.queue.tracks.length > 1 ? `> - **In queue:** ${player.queue.tracks.length - 1}` : undefined,
        `> - **Requester:** <@${(track?.requester as CustomRequester)?.id}>`,
        track?.pluginInfo?.clientData?.fromAutoplay ? `> *From Autoplay* ✅` : undefined
        ].filter(Boolean).join("\n"))
        .addFields({ name: "Status", value: "▶️ Playing" })
        .setFooter({
        text: `Requested by ${(track?.requester as CustomRequester)?.username}`,
        iconURL: /^https?:\/\//.test(avatarURL || "") ? avatarURL : undefined,
        })
        .setTimestamp();

    if (track?.info?.uri && /^https?:\/\//.test(track?.info?.uri)) embed.setURL(track.info.uri);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
        new ButtonBuilder().setCustomId("player_stop").setStyle(ButtonStyle.Danger).setEmoji("⏹"),
        new ButtonBuilder().setCustomId("player_pause").setStyle(ButtonStyle.Secondary).setEmoji("⏯️"),
        new ButtonBuilder().setCustomId("player_skip").setStyle(ButtonStyle.Primary).setEmoji("⏭"),
        new ButtonBuilder().setCustomId("player_playlist").setStyle(ButtonStyle.Success).setEmoji("📜"),
        );
    //Set bot activity
    client.user.setActivity(track?.info?.title, {
        type: ActivityType.Playing,
        details: track?.info?.title, // Título de la canción
        state: `${track?.info?.author || "XD"} | ${formatMS_HHMMSS(track?.info?.duration || 0)}`,
    } as unknown as any);
    
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if (!channel) return;

    const msg = await channel.send({ embeds: [embed], components: [row] });
    messagesMap.set(player.guildId, msg);
    })
    .on("trackEnd", async(player, track, payload) => {
        disableButtons(player);
        try{await updatePlayerEmbed(player.guildId!, "⏹️ Finished");}catch{};
        logPlayer(client, player, "[LAVALINK] Finished Playing", track?.info?.title)
        client.user.setPresence({ activities: [envConfig.activity], status: envConfig.status as any });
    })
    .on("trackError", (player, track, payload) => {
        logPlayer(client, player, "[LAVALINK] Errored while Playing", track?.info?.title, "ERROR DATA:", payload)
    })
    .on("trackStuck", (player, track, payload) => {
        logPlayer(client, player, "[LAVALINK] Got Stuck while Playing", track?.info?.title, "STUCKED DATA:", payload)
    })
    .on("queueEnd", async(player, track, payload) => {
        disableButtons(player);
        try{await updatePlayerEmbed(player.guildId!, "⏹️ Finished");}catch{};
        logPlayer(client, player, "[LAVALINK] No more tracks in the queue, after playing", track?.info?.title || track)
        /*sendPlayerMessage(client, player, {
            embeds: [
                new EmbedBuilder()
                .setColor(client.embedColor as any)
                .setTitle("❌ Queue Ended")
                .setTimestamp()
            ]
        });*/
    })

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const player = client.lavalink.getPlayer(interaction.guildId!);
    if (!player) return;

    let commandName: string | null = null;

    switch (interaction.customId) {
        case "player_stop":
        commandName = "stop";
        await updatePlayerEmbed(interaction.guildId!, "⏹️ Stopped", interaction.user.id);
        try{disableButtons(player)}catch{};
        break;
        case "player_pause":
        player.paused ? commandName = "resume" : commandName = "pause";
        await updatePlayerEmbed(interaction.guildId!, player.paused ? "▶️ Playing | Resumed " : "⏸️ Paused", interaction.user.id);
        break;
        case "player_skip":
        commandName = "skip";
        await updatePlayerEmbed(interaction.guildId!, "⏭️ Skipped", interaction.user.id);
        break;
        case "player_playlist":
        commandName = "listqueue";
        break;
    }
    if (!commandName) return;
    const command = client.commands.get(commandName);
    if (!command) {
        await interaction.reply({ content: "⚠️ This command is not available.", ephemeral: true });
        return;
    }
    try {
        if (typeof command.execute === "function") {
            await (command as any).execute(client, interaction);
        } else if (typeof (command as any).execute === "object" && typeof (command as any).execute.execute === "function") {
            await (command as any).execute.execute(client, interaction);
        } else {
            await interaction.reply({ content: "⚠️ The command handler is not invokable.", ephemeral: true });
        }
    } catch (err) { console.error(err);}
    });


  async function disableButtons(player: Player) {
    const msg = messagesMap.get(player.guildId);
    if (!msg || !msg.editable) return;
    
    const existingRow = msg.components[0] as ActionRow<MessageActionRowComponent>;
    if (!existingRow) return;

    // Construir un nuevo ActionRowBuilder a partir de los componentes del mensaje
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        existingRow.components.map(c =>
        ButtonBuilder.from(c as any).setDisabled(true)
        )
    );

    await msg.edit({ components: [row] });
    }
}

async function updatePlayerEmbed(guildId: string, newState: string, userId?: string) {
  const msg = messagesMap.get(guildId);
  if (!msg) return;

  const embed = EmbedBuilder.from(msg.embeds[0]);
  const fields = embed.data.fields ?? [];
  const stateIndex = fields.findIndex(f => f.name === "Status");

  if (stateIndex !== -1) {
    fields[stateIndex].value = newState + (userId ? ` by <@${userId}>` : "");
  } else {
    fields.push({ name: "Status", value: newState + (userId ? ` by <@${userId}>` : "") });
  }

  embed.setFields(fields);

  await msg.edit({ embeds: [embed] });
}


// structured - grouped logging
function logPlayer(client:BotClient, player:Player, ...messages) {
    console.group("Player Event");
        console.log(`| Guild: ${player.guildId} | ${client.guilds.cache.get(player.guildId)?.name}`);
        console.log(`| Voice Channel: #${(client.channels.cache.get(player.voiceChannelId!) as VoiceChannel)?.name || player.voiceChannelId}`);
        console.group("| Info:")
            console.log(...messages);
        console.groupEnd();
    console.groupEnd();
    return;
}

async function sendPlayerMessage(client:BotClient, player:Player, messageData:MessageCreateOptions) {
    const channel = client.channels.cache.get(player.textChannelId!) as TextChannel;
    if(!channel) return;

    return channel.send(messageData);
}
