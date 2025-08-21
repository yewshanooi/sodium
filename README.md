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

Simple **music player** powered by Lavalink v3
Queue up tracks, playlists, and radio-length sessions with buttery-smooth seeking, looping, shuffling, and rock-solid reconnection. Built on erela.js with first-class Spotify & YouTube support.

## Features
- **AI Chatbot** *(powered by Google Gemini)*
- **Moderation Logs & Leaderboard** *(stored using MongoDB Atlas)*
- **Text Summarizer** *(powered by Hugging Face Transformers)*
- **Third Party API** commands *(such as Giphy, Wikipedia, and more!)*
- **Watch Together** *(with YouTube activity)*
- 🎵 **Music (New)** Lavalink v3 backend for low-latency playback
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
		<td>afk, announce, botpresence, botsetnick, calculator, crypto, dictionary, gemini, github, guildrename, help, info <b>[channel | client | guild | role | user]</b>, invite, leaderboard <b>[add | remove | reset | view]</b>, leave, message, mongodb <b>[initialize | delete]</b>, news, npm, ping, qrcode, summarize, thread, weather, wikipedia</td>
		<td>clearqueue, join, leave, loop, lyrics, nowplaying, pause, play, queue, remove, resume, shuffle, skip, skipto, stop, volume</td>
	</tr>
</table>
<br/>

## Dependencies
###### Node.js
Node.js version **≥22.0.0** is required

###### npm Packages
<table>
  <tr>
    <td><a href="https://www.npmjs.com/package/@dotenvx/dotenvx">@dotenvx/dotenvx@1.49.0</a></td>
    <td><a href="https://www.npmjs.com/package/@google/genai">@google/genai@1.15.0</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/@huggingface/transformers">@huggingface/transformers@3.7.2</a></td>
    <td><a href="https://www.npmjs.com/package/chalk">chalk@4.1.2</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/delay">delay@6.0.0</a></td>
    <td><a href="https://www.npmjs.com/package/discord.js">discord.js@14.21.0</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/erela.js">erela.js@2.4.0</a></td>
    <td><a href="https://www.npmjs.com/package/erela.js-spotify">erela.js-spotify@1.2.0</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/fakeyouapi.js">fakeyouapi.js@1.1.9</a></td>
    <td><a href="https://www.npmjs.com/package/lodash">lodash@4.17.21</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/mathjs">mathjs@14.6.0</a></td>
    <td><a href="https://www.npmjs.com/package/mongodb">mongodb@6.18.0</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/mongoose">mongoose@8.17.2</a></td>
    <td><a href="https://www.npmjs.com/package/node-fetch">node-fetch@2.7.0</a></td>
  </tr>
  <tr>
    <td><a href="https://www.npmjs.com/package/pretty-ms">pretty-ms@9.2.0</a></td>
    <td><a href="https://www.npmjs.com/package/uuid">uuid@11.1.0</a></td>
  </tr>
</table>
<br/>

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
4. Create a new file named **config.json** and fill it with your own information<br/>
```
{
  "embedColor": "",
  "channelID": "",
  "lavalink": {
    "enabled": true,
    "nodes": [
      {
        "host": "localhost",
        "port": 2333,
        "password": "youshallnotpass",
        "secure": false
      }
    ],
    "spotify": true
  }
}
```
5. Create a new file named **.env** and fill it with your own variables<br/>
> [!WARNING]
> The TOKEN, MONGODB_TOKEN, CLIENT_ID, and GUILD_ID fields are required, while the rest are optional. With missing fields, certain features might not work as intended
```
# https://discord.com/developers/applications
TOKEN=
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
```
6. Run the **commands.js** file to deploy or delete application commands for a single guild by default
```
npm run commands	-or-	node commands.js deploy    -or-    node commands.js delete
```
7. Run the **index.js** file to start the bot<br/>
```
npm start    -or-    node index.js    -or-    nodemon
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
