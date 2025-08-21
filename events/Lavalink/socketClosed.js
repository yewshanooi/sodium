module.exports = {
  name: 'socketClosed',
  async execute(client, player, payload) {
    if (payload.byRemote !== true) return;
    console.log(`[⚠️] Socket Disconnected.`)
  }
};