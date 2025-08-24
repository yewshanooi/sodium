<p align="center">
	<a href="https://skyelements.github.io/sodium.html">
		<img src=".github/images/sodium.png" height="128">
		<h1 align="center">Sodium</h1>
		<p align="center">Open source discord bot with application commands and a user-friendly interface</p>
	</a>
</p>

<p align="center">
	<a href="https://skyelements.github.io/commands.html"><strong>Preview</strong></a> ·
	<a href="https://github.com/yewshanooi/sodium/releases"><strong>Releases</strong></a>
</p>
<br/>

## ✨ What’s New

Simple **music player** powered by Lavalink v4
Queue up tracks, playlists, and radio-length sessions with buttery-smooth seeking, looping, shuffling, and rock-solid reconnection. Built on erela.js with first-class Spotify & YouTube support.

## Features
- **AI Chatbot** *(powered by Google Gemini)*
- **Moderation Logs & Leaderboard** *(stored using MongoDB Atlas)*
- **Text Summarizer** *(powered by Hugging Face Transformers)*
- **Third Party API** commands *(such as Giphy, Wikipedia, and more!)*
- **Watch Together** *(with YouTube activity)*
- 🎵 **Music (New)** Lavalink v4 backend for low-latency playback
*Supports YouTube, Spotify, SoundCloud & direct URLs*
<sub>*Spotify search/playlist import requires erela.js-spotify + API keys.</sub>
<br/>

## Commands
<table>
	<tr>
		<td><b>Fun</b></td>
		<td><b>Moderation</b></td>
		<td><b>Utility</b></td>
		<td><b>Music</b></td>
	</tr>
	<tr>
		<td>8ball, achievement, beep, coinflip, color, compliment, diceroll, fact <b>[cat | dog | general | useless]</b>, fortnite, giphy, hypixel, leagueoflegends, lyrics, meme, minecraft, nasa, neko, pokemon, rps, say, spotify, urban, word, wynncraft, youtube</td>
		<td>ban, channel <b>[delete | lock | rename | unlock]</b>, deafen, kick, logs <b>[add | remove | reset | view]</b>, purge, role <b>[add | remove]</b>, setnick, slowmode, timeout, unban, undeafen, untimeout, warn</td>
    <td>afk, announce, botpresence, botsetnick, calculator, crypto, dictionary, eval, example, floweryTts, gemini, github, guildrename, help, info <b>[channel | client | guild | role | user]</b>, invite, leaderboard <b>[add | remove | reset | view]</b>, leave, message, mongodb <b>[initialize | delete]</b>, news, npm, ping, qrcode, sound, steam, summarize, thread, tts, voices, weather, wikipedia</td>
		<td>addUnresolved, audioOutput, equalizer, filter, join, lavaSearch, listqueue, localfile, loop, pause, play, reconnectSync, resume, resumeFixed, seek, skip, stop, stopPlaying, volume</td>
	</tr>
</table>
<br/>

## Dependencies
###### Node.js
Node.js version **≥22.0.0** is required

###### npm Packages
###### npm Packages
| Package | Version |
|---|---|
| [@google/genai](https://www.npmjs.com/package/@google/genai) | 1.15.0 |
| [@redis/client](https://www.npmjs.com/package/@redis/client) | 1.6.0 |
| [@types/node](https://www.npmjs.com/package/@types/node) | 22.15.18 |
| [@types/ws](https://www.npmjs.com/package/@types/ws) | 8.18.1 |
| [chalk](https://www.npmjs.com/package/chalk) | 4.1.2 |
| [discord.js](https://www.npmjs.com/package/discord.js) | 14.22.1 |
| [dotenv](https://www.npmjs.com/package/dotenv) | 16.5.0 |
| [fakeyouapi.js](https://www.npmjs.com/package/fakeyouapi.js) | 1.1.9 |
| [lavalink-client](https://www.npmjs.com/package/lavalink-client) | 2.6.0 |
| [mathjs](https://www.npmjs.com/package/mathjs) | 14.6.0 |
| [mongodb](https://www.npmjs.com/package/mongodb) | 6.18.0 |
| [mongoose](https://www.npmjs.com/package/mongoose) | 8.17.2 |
| [node-fetch](https://www.npmjs.com/package/node-fetch) | 3.3.2 |
| [redis](https://www.npmjs.com/package/redis) | 4.7.0 |
| [ts-node](https://www.npmjs.com/package/ts-node) | 10.9.2 |
| [uuid](https://www.npmjs.com/package/uuid) | 11.1.0 |
| [ws](https://www.npmjs.com/package/ws) | 8.18.2 |

###### devDependencies
| Package | Version |
|---|---|
| [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) | 4.2.0 |
| [tslib](https://www.npmjs.com/package/tslib) | 2.8.1 |
| [typescript](https://www.npmjs.com/package/typescript) | 5.8.3 |

## Guides
###### Configuration Files
1. **Clone** this repository to your local drive
```sh
git clone https://github.com/yewshanooi/sodium.git
cd sodium
```
2. Install the required **npm packages**
```
npm install
```
3. Install the **nodemon** npm package globally or skip if you already have nodemon installed
```
npm install -g nodemon
```
4. Create a new file named **config.ts** and fill it with your own information<br/>
```
import { ActivityType } from "discord.js"; import { config } from "dotenv";config();
export const envConfig = {
    embedColor: "Random",
    activity: { name: `Test /help with Sodium Bot`, type: ActivityType.Custom, url: null }, 
    status: 'online',
    token: process.env.DISCORD_TOKEN as string,
    clientId: process.env.CLIENT_ID as string,
    mongodb: process.env.MONGODB_TOKEN as string,
    redis: {
        url: process.env.REDIS_URL as string,
        password: process.env.REDIS_PASSWORD as string
    },
    useJSONStore: !process.env.REDIS_URL ? true : false,
    devGuild: process.env.GUILD_ID as string || null,
    lavalink: {
        enabled: true, // https://lavalink-list.appujet.site/
        nodes: [
            {
                authorization: "youshallnotpass", // password
                host: "localhost",
                port: 2333,
                id: "SodiumBot",
                secure: false,
                // sessionId: "lsvunq8h8bxx0m9w", // The sessionId is automatic but you have to add the sessionId in order to resume the session for the node, and then to recover the players listen to nodeManager#resumed.
            },
        ]
    },
    logsChannelID: ""
}

```
5. Create a new file named **.env** and fill it with your own variables<br/>
> [!WARNING]
> The TOKEN, MONGODB_TOKEN, CLIENT_ID, and GUILD_ID fields are required, while the rest are optional. With missing fields, certain features might not work as intended
```
# https://discord.com/developers/applications
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=

# Example: MONGODB_TOKEN= mongodb+srv://<user>:<password>@<domain>.mongodb.net/
MONGODB_TOKEN=

# _______________ API AND TOKENS KEYS (Optional) _______________
# https://fortniteapi.com/
FORTNITE_API_KEY=
# https://docs.genius.com/
GENIUS_API_KEY=
# https://developers.giphy.com/
GIPHY_API_KEY=
# https://aistudio.google.com/apikey
GOOGLE_API_KEY=
# https://hypixel.net/
HYPIXEL_API_KEY=
# https://api.nasa.gov/
NASA_API_KEY=
# https://newsapi.org/
NEWS_API_KEY=
# https://openweathermap.org/api
OPENWEATHERMAP_API_KEY=
# https://developer.riotgames.com/
RIOTGAMES_API_KEY=
# https://developer.valvesoftware.com/wiki/Steam_Web_API
STEAM_API_KEY=
# https://www.fakeyou.com/
FAKEYOU_USERNAME=
FAKEYOU_PASSWORD=
# https://developer.spotify.com/documentation/web-api
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
# If no redis URL is provided, the bot is configured to use a custom json store for queue data
REDIS_URL=
REDIS_PASSWORD=

# Lavalink Nodes and more must be configured in config.ts
```
6. Run the **commands.js** file to deploy or delete application commands for a single guild by default
```
npm run deploy    -or-    npm run delete
```
7. Run the **index.js** file to start the bot<br/>
```
npm start    -or-    ts-node index.ts    -or-    nodemon
```

###### Machine Learning
1. View this [guide](https://github.com/yewshanooi/huggingface-guide) to install the summarization model
> [!TIP]
> For best results, we suggest using the facebook/bart-large-cnn model. The model size is approximately 6.65GB in half precision (FP16) format

###### Bot & Application
1. Visit [Discord Developer Portal](https://discord.com/developers/applications) to create a new application

2. In Installation tab, enable `Guild Install` option under Authorization Methods

3. In Bot tab, enable `Presence Intent` and `Server Members Intent` options under Privileged Gateway Intents

4. Paste this OAuth2 URL template in your browser's address bar and replace `{CLIENT_ID}` with your **Client ID** to invite the bot to your guild
```url
https://discord.com/oauth2/authorize?client_id={CLIENT_ID}&permissions=1497295481975&integration_type=0&scope=bot+applications.commands
```

###### OAuth2 URL Scopes & Bot Permissions
<p align="left">
	<img src=".github/images/oauth2.png" width="750"/>
</p>
<br/>

## Attributions
###### License
This project is licensed under the **MIT License**
```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

###### Contributors
- [yewshanooi](https://github.com/yewshanooi)
- [Manz-bot](https://github.com/Manz-bot)
