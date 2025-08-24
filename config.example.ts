import { ActivityType } from "discord.js"; import { config } from "dotenv";config();
export const envConfig = {
    embedColor: "Random",
    activity: { name: `Test /help with Sodium Bot`, type: ActivityType.Custom, url: null }, 
    status: 'online',
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.CLIENT_ID as string,
    mongodb: process.env.MONGODB_TOKEN as string,
    redis: {
        url: process.env.REDIS_URL as string,
        password: process.env.REDIS_PASSWORD as string
    },
    useJSONStore: !process.env.REDIS_URL ? true : false,
    devGuild: process.env.GUILD_ID as string || null,
    lavalink: {
        enabled: true, // https://lavalink-list.appujet.site/
        nodes: [
            {
                authorization: "youshallnotpass", // password
                host: "localhost",
                port: 2333,
                id: "SodiumBot",
                secure: false,
                // sessionId: "lsvunq8h8bxx0m9w", // The sessionId is automatic but you have to add the sessionId in order to resume the session for the node, and then to recover the players listen to nodeManager#resumed.
            },
        ]
    },
    logsChannelID: ""
}
