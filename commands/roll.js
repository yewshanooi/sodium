const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'roll',
	description: 'Rolls a random dice with x sides',
	cooldown: '3',
	usage: '{sides}',
	execute (message, args) {
		let [limit] = args;
        if (!limit) limit = 6;
        const rand = Math.floor(Math.random() * limit + 1);
        if (!rand || limit <= 0) return this.sendErrorMessage(message, 0, 'Please provide a valid number of dice sides');
            const embed = new MessageEmbed()
            .setTitle('🎲  Dice Roll  🎲')
            .setDescription(`${message.member}, you rolled a **${rand}**!`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
            message.channel.send(embed);
        }
};