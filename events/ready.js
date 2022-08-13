module.exports = client => {
	if(!process.env.BRAINSHOP_BID) console.log('⚠️ > The environmental variable BRAINSHOP_BID is not set');
	if(!process.env.BRAINSHOP_API_KEY) console.log('⚠️ > The environmental variable BRAINSHOP_API_KEY is not set');
	if(!process.env.FORTNITE_API_KEY) console.log('⚠️ > The environmental variable FORTNITE_API_KEY is not set');
	if(!process.env.GIPHY_API_KEY) console.log('⚠️ > The environmental variable GIPHY_API_KEY is not set');
	if(!process.env.GENIUS_API_KEY) console.log('⚠️ > The environmental variable GENIUS_API_KEY is not set');
	if(!process.env.NASA_API_KEY) console.log('⚠️ > The environmental variable NASA_API_KEY is not set');
	if(!process.env.NEWS_API_KEY) console.log('⚠️ > The environmental variable NEWS_API_KEY is not set');
	if(!process.env.OPENWEATHERMAP_API_KEY) console.log('⚠️ > The environmental variable OPENWEATHERMAP_API_KEY is not set');
	console.log(`✔️ > Logged in as ${client.user.tag}\n✔️ > Serving ${client.users.cache.size} users and ${client.channels.cache.size} channels in ${client.guilds.cache.size} guilds`);
};