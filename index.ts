import chalk from 'chalk';
import path from'path';
import { Client, Collection, EmbedBuilder, GatewayIntentBits, Partials, DefaultWebSocketManagerOptions } from "discord.js";
import mongoose from 'mongoose';
import FakeYou from "fakeyouapi.js";
import { LavalinkManager, MiniMap, parseLavalinkConnUrl } from "lavalink-client";
import { createClient } from "redis";

import { envConfig } from "./config";
import { loadCommands } from "./commands/commandLoader";
import { loadEvents } from "./events/eventsLoader";
import { JSONStore, myCustomStore, myCustomWatcher, PlayerSaver } from "./Utils/classes";
import { myCustomPlayer } from "./Utils/classes/customPlayerClass";
import { handleResuming } from "./Utils/handleResuming";
import { requesterTransformer, autoPlayFunction } from "./Utils/Optional";

import type { ManagerOptions } from "lavalink-client";
import type { BotClient } from "./Utils/types/Client";
import { e } from 'mathjs';

(DefaultWebSocketManagerOptions.identifyProperties as any).browser = 'Discord iOS';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping], partials: [Partials.Channel] }) as BotClient;

if (envConfig.redis.url && 1 < 0) { // little invalid if statement so the redis doesn't happen for testing purposes
    client.redis = createClient({ url: envConfig.redis.url, password: envConfig.redis.password });
    client.redis.connect(); // @ts-ignore
    client.redis.on("error", (err) => console.log(chalk.red.bold('[LAVALINK] Redis Client Error'), err));
} else if (envConfig.useJSONStore) {
    client.redis = new JSONStore();
} else client.redis = new MiniMap<string, string>();

client.defaultVolume = 100;
client.embedColor = envConfig.embedColor;
/**
 * ? In case you wanna provide node data via env, you can use the provided util for url parsing:
 * * Example for multiple Nodes Secure in ENV.
 * * URL-Pattern: lavalink://<nodeId>:<nodeAuthorization(Password)>@<NodeHost>:<NodePort>
 * !   Important PW + ID must be encoded.
 * !   "verySpecialPassword#1" -> "verySpecialPassword%231"
 *       (   do it in nodejs via: encodeURIComponent("verySpecialPassword#1")   )
 *          you can also use this website to encode your password: https://www.url-encode-decode.com/
*/
//const LavalinkNodesOfEnv = process.env.LAVALINKNODES?.split(" ").filter(v => v.length).map(url => parseLavalinkConnUrl(url));

(async () => {
    console.debug("[LAVALINK] Now initializing playerSaver...");
    // Player saver util class for saving the player data
    const playerSaver = new PlayerSaver();
    const nodeSessions = await playerSaver.getAllLastNodeSessions();

    console.debug("[LAVALINK] Creating lavalink manager...");

    client.lavalink = new LavalinkManager<myCustomPlayer>({
        playerClass: myCustomPlayer,
        nodes: envConfig.lavalink.nodes.map(node => {
            const nodeAny = node as any;
            const baseNode = nodeAny.sessionId? { ...node } : { ...node, sessionId: nodeSessions.get(node.id) };
            return {
                ...baseNode,
                requestSignalTimeoutMS: 3000,
                closeOnError: true,
                heartBeatInterval: 30_000,
                enablePingOnStatsCheck: true,
                retryDelay: 10e3,
                retryAmount: 5,
            };
        }),
        autoMove: true,
        sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
        autoSkip: true,
        client: { // client: client.user
            id: envConfig.clientId, // REQUIRED! (at least after the .init)
            username: "SODIUMBOT",
        },
        autoSkipOnResolveError: true, // skip song, if resolving an unresolved song fails
        emitNewSongsOnly: true, // don't emit "looping songs"
        playerOptions: {
            // These are the default prevention methods
            maxErrorsPerTime: {
                threshold: 10_000,
                maxAmount: 3,
            },
            // only allow an autoplay function to execute, if the previous function was longer ago than this number.
            minAutoPlayMs: 10_000,

            applyVolumeAsFilter: false,
            clientBasedPositionUpdateInterval: 50, // in ms to up-calc player.position
            defaultSearchPlatform: "ytmsearch",
            volumeDecrementer: 0.75, // on client 100% == on lavalink 75%
            requesterTransformer: requesterTransformer,
            onDisconnect: {
                autoReconnect: true, // automatically attempts a reconnect, if the bot disconnects from the voice channel, if it fails, it get's destroyed
                destroyPlayer: false // overrides autoReconnect and directly destroys the player if the bot disconnects from the vc
            },
            onEmptyQueue: {
                destroyAfterMs: 30_000, // 1 === instantly destroy | don't provide the option, to don't destroy the player
                autoPlayFunction: autoPlayFunction,
            },
            useUnresolvedData: true,
        },
        queueOptions: {
            maxPreviousTracks: 10,
            //queueStore: new myCustomStore(client.redis),
            queueChangesWatcher: new myCustomWatcher(client)
        },
        linksAllowed: true,
        // linksBlacklist: ["porn", "youtube.com", "youtu.be"],
        linksBlacklist: [],
        linksWhitelist: [],
        advancedOptions: {
            enableDebugEvents: true,
            maxFilterFixDuration: 600_000, // only allow instafixfilterupdate for tracks sub 10mins
            debugOptions: {
                noAudio: false,
                playerDestroy: {
                    dontThrowError: false,
                    debugLog: false,
                },
                logCustomSearches: false,
            }
        }
    } as Required<ManagerOptions<myCustomPlayer>>);

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

    // Error messages for missing Client Token, MongoDB Token, Client ID and Guild ID
    if (!envConfig.token) throw new Error(`${chalk.red.bold('[Error] Missing \'TOKEN_DISCORD\' field in the .env file.')}`);
    if (!envConfig.clientId) throw new Error(`${chalk.red.bold('[Error] Missing \'CLIENT_ID\' field in the .env file.')}`);
    if (!envConfig.devGuild) console.log(`${chalk.yellow.bold('[Error] Missing \'GUILD_ID\' field in the .env file.')}`);
    if (!envConfig.mongodb) throw new Error(`${chalk.red.bold('[Error] Missing \'MONGODB_TOKEN\' field in the .env file.')}`);

    // all what you need to do to enable resuming
    handleResuming(client, playerSaver);
    loadCommands(client);
    loadEvents(client, mongoose);

    function sendLogs(info, color) {
        if (envConfig.logsChannelID) {
            const channel = client.channels.cache.get(envConfig.logsChannelID) as import("discord.js").TextChannel | import("discord.js").NewsChannel | import("discord.js").DMChannel | import("discord.js").ThreadChannel | null;
            if (!channel) return;
            const embed = new EmbedBuilder()
                .setDescription(info)
                .setColor(color);
            channel.send({ embeds: [embed] });
        }
    }

    client.on("disconnect", () => console.log("Bot Disconnected!"));
    client.on("reconnecting", () => console.log("Bot Reconnecting.."));
    client.on('debug', info => {
        // White color embed
        sendLogs(info, '#ffffff');
    });
    client.on('error', info => {
        // Red color embed
        sendLogs(info, '#ff5555');
    });
    client.on('warn', info => {
        // Orange color embed
        sendLogs(info, '#ffaa00');
    });
    client.rest.on('rateLimited', console.debug)

    try {
        await mongoose.connect(process.env.MONGODB_TOKEN).catch(console.error);

        const fy = new FakeYou.Client({
            usernameOrEmail: process.env.FAKEYOU_USERNAME,
            password: process.env.FAKEYOU_PASSWORD
        });
        await fy.start();
        client.fy = fy;
        console.log(`${chalk.greenBright.bold('[FakeYou] Successfully connected to FakeYou API.')}`);
    } catch (error) {
        console.log(`${chalk.redBright.bold('[FakeYou / MongoDB] An error occurred during startup:')}`, error);
    }

    client.login(envConfig.token);

})();

// Template by @Tomato6966 https://github.com/Tomato6966/lavalink-client && modifications