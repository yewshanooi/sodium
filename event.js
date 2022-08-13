const reqEvent = event => require(`./events/${event}`);
module.exports = client => {
    client.once('ready', reqEvent('ready'));
    client.on('interactionCreate', reqEvent('interactionCreate'));
};