const chalk = require('chalk');

module.exports = {
    name: 'lavalink',
    events: {
        nodeConnect: (client, node) => {
        console.log(node.options.host, chalk.greenBright.bold("[🟢] Lavalink / Node Connected!"), node.options.retryDelay);
        },
        nodeCreate: (client, node) => {
            console.log(chalk.greenBright.bold("[🟢] Lavalink / Node Player Created!"));
        },
        nodeDisconnect: (client, node, reason) => {
            console.log(node.options.host, chalk.redBright.bold("[🔴] Lavalink / Node Disconnected. Reason:"), reason);
        },
        nodeError: (client, node, error) => {
            if (error.message.includes("Unexpected op")) return;
            console.log(chalk.redBright.bold("[🔴] Lavalink / Node Error! Reason:"), error.message);
        },
        nodeReconnect: (client, node) => {
            console.log(chalk.yellowBright.bold("[🟡] Lavalink / Node Reconnecting..."));
        }
    }
};
