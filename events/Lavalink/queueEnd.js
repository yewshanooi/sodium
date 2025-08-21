const { ActivityType } = require('discord.js');

module.exports = {
  name: 'queueEnd',
  async execute(client, player) {
	const channel = client.channels.cache.get(player.textChannel);
	const message = await channel.send(`**👌 The queue has ended!**`);
	setTimeout(async () => {
		try {
			await message.delete();
		} catch {}
	}, 30000);

	client.user.setActivity();
  }
};