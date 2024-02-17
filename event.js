const reqEvent = event => require(`./events/${event}`);
module.exports = client => {
    client.on('interactionCreate', reqEvent('interactionCreate'));
    client.once('ready', reqEvent('ready'));
};