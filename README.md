<p align="center">
    <img src=".github/readme_icon.png" width="190" height="165"/>
</p>

<h1 align="center">
    Skye
    <br>
</h1>

<h4 align="center">Multi use discord bot with application commands and a user-friendly interface</h4>

<p align="center">
        <img alt="Release Version" src="https://img.shields.io/github/v/release/yewshanooi/skye?include_prereleases&style=flat-square">
    </a>
    &nbsp;
        <img alt="Repository Size" src="https://img.shields.io/github/repo-size/yewshanooi/skye?style=flat-square">
    </a>
    &nbsp;
        <img alt="Lines of Code" src="https://img.shields.io/tokei/lines/github/yewshanooi/skye?style=flat-square">
    </a>
    &nbsp;
        <img alt="License" src="https://img.shields.io/github/license/yewshanooi/skye?style=flat-square">
    </a>
    &nbsp;
        <img alt="Last Commit" src="https://img.shields.io/github/last-commit/yewshanooi/skye?style=flat-square">
    </a>
</p>

## Features
**50+** commands and counting across **3** different categories!
###### Fun
`8ball`, `achievement`, `beep`, `catfact`, `coinflip`, `color`, `compliment`, `diceroll`, `dogfact`, `fact`, `giphy`, `github`, `lyrics`, `say`, `urban`, `wikipedia`

###### Utility
`announce`, `avatar`, `botinfo`, `botnick`, `botstatus`, `chdelete`, `chrename`, `covid`, `delete`, `guildinfo`, `guildname`, `help`, `leave`, `links`, `message`, `nick`, `ping`, `roleadd`, `roleinfo`, `roleremove`, `thcreate`, `userinfo`

###### Moderation
`ban`, `chlock`, `chunlock`, `deafen`, `kick`, `lockdown`, `mute`, `slowmode`, `unban`, `undeafen`, `unmute`, `warn`

**Skye** also comes packed with other features, such as:
- Discord **Message Embed** constructor
- Enhanced **Privacy** [*(Read More)*](https://skyebot.weebly.com/privacy.html)
- Guild integrated **Application Commands** *(discord.js v13)*
- **Third Party API** support such as Covid-19 data from [`@mathdroid/covid-19-api`] <br/>
*and much more!*

## Installation
###### Node.js
**Node.js v16.6.0** or newer is required

###### Packages
**Required**
* [`@discordjs/builders@0.6.0`]
* [`@discordjs/rest@0.1.0-canary.0`]
* [`discord-api-types@0.23.1`]
* [`discord.js@13.1.0`]

**Optional**
* [`eslint@7.32.0`]
* [`nodemon@2.0.7`]

###### Guide
1. **Clone** this repository locally
```sh
git clone https://github.com/yewshanooi/skye.git
cd Skye
```
2. Install the required **npm packages**
```
npm install
```
3. Create a new **config.json** file and fill it with your own information
```json
{
  "token": "BOT-TOKEN",
  "clientId": "CLIENT-ID",
  "embedColor": "HEX-COLOR",
  "giphyAPIKey": "GIPHY-API-KEY",
  "geniusAPIKey": "GENIUS-API-KEY"
}
```
4. Run the **deploy.js** file to deploy application commands
```
node deploy.js
```
5. Run the **index.js** file to start the bot
```
node index.js
```

## License
This project is licensed under the **MIT License**
```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Contributors
###### Developer | Ooi Yew Shan
[GitHub](https://github.com/yewshanooi/) • [Instagram](https://instagram.com/yewshanooi/) • [Discord](https://discordapp.com/users/266124126584963082/)

<!----------------- LINKS ------------------>
[`@mathdroid/covid-19-api`]:        https://github.com/mathdroid/covid-19-api
[`@discordjs/builders@0.6.0`]:      https://github.com/discordjs/builders
[`@discordjs/rest@0.1.0-canary.0`]: https://github.com/discordjs/discord.js-modules
[`discord-api-types@0.23.1`]:       https://github.com/discordjs/discord-api-types
[`discord.js@13.1.0`]:              https://github.com/discordjs/discord.js/
[`eslint@7.32.0`]:                  https://github.com/eslint/eslint
[`nodemon@2.0.7`]:                  https://github.com/remy/nodemon
