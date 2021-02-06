module.exports = {
    name: 'react',
    description: 'Reacts to your message',
    execute (message, args) {
        if (!args.length) {
            message.react('😄');
        }
    }
};