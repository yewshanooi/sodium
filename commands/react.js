module.exports = {
    name: 'react',
    description: 'Reacts then reply to your message',
    execute (message, args) {
        if (!args.length) {
            message.react('😄').then(message.channel.send('Hey there!'));
        }
    }
};