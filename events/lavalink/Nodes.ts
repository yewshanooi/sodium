import type { BotClient } from "../../Utils/types/Client";
import chalk from "chalk";

export function NodesEvents(client: BotClient) {
    /**
         * NODE EVENTS
         */
    client.lavalink.nodeManager.on("raw", (node, payload) => {
        //console.debug(node.id, " RAW ", payload);
    }).on("disconnect", (node, reason) => {
        console.log(chalk.yellow(`${node.id} [LAVALINK] Disconnected ${reason}`));
    }).on("connect", (node) => {
        console.log(chalk.green.bold(`${node.id} [LAVALINK] Connected`));
        // testPlay(client); // TEST THE MUSIC ONCE CONNECTED TO THE BOT
    }).on("reconnecting", (node) => {
        console.log(chalk.blue(`${node.id} [LAVALINK] Reconnecting`));
    }).on("create", (node) => {
        console.log(chalk.magenta(`${node.id} [LAVALINK] Created`));
    }).on("destroy", (node) => {
        console.log(chalk.red(`${node.id} [LAVALINK] Destroyed`));
    }).on("error", (node, error, payload) => {
        console.log(chalk.red(`${node.id} [LAVALINK] Errored: ${error} | Payload: ${payload}`));
    }).on("resumed", (node, payload, players) => {
        console.log(chalk.yellow(`${node.id} [LAVALINK] Resumed: ${Array.isArray(players) ? players.length : players} players still playing | Payload: ${payload}`));
    });
}
