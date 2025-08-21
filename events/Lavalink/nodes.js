module.exports = {
    name: 'lavalink',
    events: {
        nodeConnect: (client, node) => {
        console.log(node.options.host, "[🟢] Lavalink / Node Connected!", node.options.retryDelay);
        },
        nodeCreate: (client, node) => {
            console.log("[🟢] Lavalink / Node Player Created!");
        },
        nodeDisconnect: (client, node, reason) => {
            console.log(node.options.host, "[🔴] Lavalink / Node Disconnected. Reason:", reason);
        },
        nodeError: (client, node, error) => {
            if (error.message.includes("Unexpected op")) return;
            console.log("[🔴] Lavalink / Node Error! Reason:", error.message);
        },
        nodeReconnect: (client, node) => {
            console.log("[🟡] Lavalink / Node Reconnecting...");
        }
    }
};
