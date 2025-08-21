const { Client, Collection, GatewayIntentBits, Partials, ActivityType, DefaultWebSocketManagerOptions } = require("discord.js");
const FakeYou = require("fakeyouapi.js");
const { fakeYouUsernameOrEmail, fakeYouPassword } = require("./config.json");
const { readdirSync } = require("fs");
const path = require('path');
const { JsonDatabase } = require("five.db");
const { Manager } = require("erela.js");

DefaultWebSocketManagerOptions.identifyProperties.browser = 'Discord iOS';
const client = global.client = new Client({ intents: Object.keys(GatewayIntentBits), partials: Object.keys(Partials), allowedMentions: { repliedUser: true, parse: ["everyone", "roles", "users"] }, mobile: true });
const db = client.db = new JsonDatabase();

module.exports = client;
client.commands = new Collection();
client.config = require("./config.json");
client.categories = readdirSync("./commands/");

/* Credits: https://github.com/Bes-js/advanced-music-bot */
client.manager = new Manager({
    nodes: client.config.nodes,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    }
});

client.on("raw", (d) => client.manager.updateVoiceState(d));
client.on("disconnect", () => console.log("Bot Desconectado!"));
client.on("reconnecting", () => console.log("Bot Reconectando.."));
client.on('warn', error => console.log(error));
client.on('error', error => console.log(error));
process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

// Registra los eventos del cliente
readdirSync("./events/Client/").forEach(file => {
    const event = require(`./events/Client/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[CLIENTE] Evento ${eventName}`);
    client.on(eventName, event.bind(null, client));
});

// Registra los eventos de Lavalink
readdirSync("./events/Lavalink/").forEach(file => {
    const event = require(`./events/Lavalink/${file}`);
    let eventName = file.split(".")[0];
    console.log(`[LAVA] Evento ${eventName}`);
    client.manager.on(eventName, event.bind(null, client));
});

// Carga los comandos de todas las subcarpetas dentro de 'commands'
const slashCommands = [];
const commandsPath = path.join(__dirname, 'commands');

const readCommands = (dir) => {
    const files = readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
            readCommands(filePath);
        } else if (file.name.endsWith('.js')) {
            const command = require(filePath);

            if (command.apis && Array.isArray(command.apis)) {
                const missing = command.apis.filter(api => !process.env[api] && !client.config?.[api]);
                if (missing.length > 0) {
                    console.log(`[COMMAND SKIPPED] ${command.data?.name || file.name}: require APIs -> ${missing.join(", ")}`);
                    continue;
                }
            }

            if ('data' in command && 'execute' in command) {
                slashCommands.push(command.data.toJSON());
                console.log(`[COMMAND] ${command.data.name}`);
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} does not have the required "data" or "execute" properties.`);
            }
        }
    }
};

readCommands(commandsPath);

client.on('ready', async () => {
    await client.application.commands.set(slashCommands);
    console.log("Slash commands registrados.");
    try {
        console.log("Connecting to FakeYou...");
        const fy = new FakeYou.Client({
            usernameOrEmail: fakeYouUsernameOrEmail,
            password: fakeYouPassword
        });
        await fy.start();
        client.fy = fy;
        console.log("Successfully connected to FakeYou.");
    } catch (error) {
        console.error("An error occurred during startup:", error);
    }
});

client.login(client.config.token);

/* "nodes": [
    {
      "host": "lavalinkv3.devxcode.in",
      "port": 80,
      "password": "DevamOP",
      "secure": false
    },
    {
      "host": "lava-all.ajieblogs.eu.org",
      "port": 80,
      "password": "https://dsc.gg/ajidevserver",
      "secure": false
    },
    {
      "host": "lavalink_v3.muzykant.xyz",
      "port": 80,
      "password": "https://discord.gg/v6sdrD9kPh",
      "secure": false
    }*/