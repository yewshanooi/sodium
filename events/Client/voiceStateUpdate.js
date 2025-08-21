const delay = require("delay");

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(client, oldState, newState) {
        const player = client.manager?.players.get(newState.guild.id);
        if (!player) return;

        // Si el bot fue desconectado manualmente
        if (oldState.id === client.user.id && !newState.channelId) {
            return player.destroy();
        }

        // Si el canal de voz del bot está vacío
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
                            channel.send({ content: `📤 **Me he desconectado del canal de voz porque estuve solo por mucho tiempo.**` });
                        }
                    } catch (err) {
                        console.log(err.message);
                    }
                }
            }
        }
    }
};