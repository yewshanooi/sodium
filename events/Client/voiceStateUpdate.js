const delay = require("delay");

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(client, oldState, newState) {
        const player = client.manager?.players.get(newState.guild.id);
        if (!player) return;

        // If the bot was manually disconnected
        if (oldState.id === client.user.id && !newState.channelId) {
            return player.destroy();
        }

        // If the bot's voice channel is empty
        if (oldState.guild.members.cache.get(client.user.id).voice?.channel && oldState.guild.members.cache.get(client.user.id).voice.channel.members.filter((m) => !m.user.bot).size === 0) {
            await delay(45000);
            const voiceMembers = oldState.guild.members.cache.get(client.user.id).voice.channel?.members.size;
            if (!voiceMembers || voiceMembers === 1) {
                const newPlayer = client.manager?.players.get(newState.guild.id);
                if (newPlayer) {
                    newPlayer.destroy();
                    try {
                        const channel = client.channels.cache.get(player.textChannel);
                        if (channel) {
                            channel.send({ content: `📤 **I have disconnected from the voice channel because I was alone for too long.**` });
                        }
                    } catch (err) {
                        console.log(err.message);
                    }
                }
            }
        }
    }
};