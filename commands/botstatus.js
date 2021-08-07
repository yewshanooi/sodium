const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const { embedColor } = require('../config.json');

module.exports = {
    name: 'botstatus',
    description: 'Change bot\'s current status globally',
    usage: 'botstatus {online | idle | dnd | invisible}',
    cooldown: '30',
    guildOnly: true,
    execute (message) {
        const setStatus = message.content.split(' ');

        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.channel.send('Error: You have no permission to use this command.');
        }

        else if (setStatus[1] === 'online') {
            const embedOnline = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Online**')
                .setTimestamp()
                .setColor(embedColor);
            message.client.user.setStatus('online').then(message.channel.send(embedOnline));
        }

        else if (setStatus[1] === 'idle') {
            const embedIdle = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Idle**')
                .setTimestamp()
                .setColor(embedColor);
            message.client.user.setStatus('idle').then(message.channel.send(embedIdle));
        }

        else if (setStatus[1] === 'dnd') {
            const embedDnd = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Do Not Disturb**')
                .setTimestamp()
                .setColor(embedColor);
            message.client.user.setStatus('dnd').then(message.channel.send(embedDnd));
        }

        else if (setStatus[1] === 'invisible') {
            const embedInvisible = new MessageEmbed()
                .setTitle('Bot Status')
                .setDescription('Status successfully changed to **Invisible**')
                .setTimestamp()
                .setColor(embedColor);
            message.client.user.setStatus('invisible').then(message.channel.send(embedInvisible));
        }

        else {
            return message.channel.send(`Error: You are missing some args.\n*(e.g: \`${prefix}botstatus online\` or \`${prefix}botstatus idle\`)*`);
        }
    }
};

// Need to wait for a little while before command can go through during first use (after restart or fresh startup)