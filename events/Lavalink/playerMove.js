const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: 'playerMove',
  async execute(client, player, oldChannel, newChannel) {
    const guild = client.guilds.cache.get(player.guild)
    if (!guild) return;
    const channel = guild.channels.cache.get(player.textChannel);
    if (oldChannel === newChannel) return;
    if (newChannel === null || !newChannel) {
      if (!player) return;
      if (channel) await channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`**I have been disconnected from <#${oldChannel}>**`)] })
      return player.destroy();
    } else {
      player.voiceChannel = newChannel;
      if (player.paused) player.pause(false);
      if (channel) await channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedColor).setDescription(`**I have moved to <#${player.voiceChannel}>**`)] });
    }
  }
};