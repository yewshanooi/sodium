const { EmbedBuilder, ActivityType } = require("discord.js");
const { convertTime } = require('../../utils/convert.js');
module.exports = {
  name: 'trackStart',
  async execute(client, player, track, payload) {
    player.set("autoplay", false);

    // Update the bot activity to show the song information
    client.user.setActivity(track.title, { 
        type: ActivityType.Playing,
        details: track.title, // Song title
        state: `${track.author||"Unknow"} | ${convertTime(track.duration)}`,  // Channel/Artist name
    });
    console.log(`Playing: ${track.title} by ${track.author} (${track.uri})`);
    const embed = new EmbedBuilder()
      .setColor(client.config.embedColor).setTimestamp()
      .addFields([
        { name: `Channel/Author`, value: `${track.author}`, inline: true },
        { name: `Added by`, value: `${track?.requester ? `<@${track.requester.id}>` : "Autoplay"}`, inline: true },
        { name: `Duration`, value: `**\`[${convertTime(track.duration)}]\`**`, inline: true },
      ]).setAuthor({ name: `🎶 Now Playing`, iconURL: track?.requester ? track.requester.avatarURL({ dynamic: true }) : "https://cdn.discordapp.com/emojis/903985373259128873.gif?size=128&quality=lossless" })
      .setThumbnail(track.displayThumbnail("mqdefault"))
      .setTitle(`**${track.title}**`).setURL(`${track.uri}`)

    const channel = client.channels.cache.get(player.textChannel);
    channel.send({ embeds: [embed] });
  }
};