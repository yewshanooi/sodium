module.exports = {
  name: 'trackStuck',
  async execute(client, player, track, payload) {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send({ content: `> **⚠️ A problem has occurred with the song being played.**` });
    if (!player.voiceChannel) player.destroy();
  }
};