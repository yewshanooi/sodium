const fetch = require('node-fetch').default;
const fs = require('fs').promises;

const Guild = require('../schemas/guild');

/**
 * Convert the Vanity username to SteamID
 */
async function getIDByName(name, apiKey) {
	const url = new URL(
		`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&format=json`
	);
	url.searchParams.set('vanityurl', name);

	const res = await fetch(url);
	const data = await res.json();
	return data.response.steamid ?? null;
}

/**
 * If it's a valid ID, return it. If it's a name, convert it to ID.
 */
async function getIDByNameOrID(value, apiKey) {
	if (/^7656\d{13}$/u.test(value)) {
		return value;
	}
	const id = await getIDByName(value, apiKey);
	if (!id) {
		return { error: `No SteamID found for "${value}"` };
	}
	return id;
}

async function isPrivate(value) {
	return Object.keys(value).length === 0;
}

/**
 * Get the SteamID saved by Discord ID
 */
async function getUser(discordId, guildId) {
    try {
        const guildData = await Guild.findOne({ 'guild.id': guildId });
        if (!guildData) return null;

        const user = guildData.steam.find(u => u.discord_id === discordId);
        return user ? user.steamid : null;
    } catch (err) {
        console.error('Error fetching user from MongoDB:', err);
        return null;
    }
}

/**
 * Validates if there is a value, resolves it to steamIdOrUsername, or uses the linked one
 */
async function isLink({ steamIdOrUsername, interaction, apiKey, guildId }) {
    let steamid = null;

    if (steamIdOrUsername) {
        const resolved = await getIDByNameOrID(steamIdOrUsername, apiKey);
        if (resolved?.error) return { steamid: null, error: resolved.error };
        steamid = resolved;
    } else {
        steamid = await getUser(interaction.user.id, guildId);
        if (!steamid) {
            return {
                steamid: null,
                error: `You need to link your Discord account to your SteamID with /steam link, or provide either SteamID64 or username.`,
            };
        }
    }
    return { steamid, error: null };
}

/**
 * Save SteamID linked to Discord ID
 */
async function newUser(steamid, discord_id, guildId) {
    try {
        const guildData = await Guild.findOne({ 'guild.id': guildId });
        if (!guildData) {
            console.error(`Guild with ID ${guildId} not found. Please run /mongodb initialize first.`);
            return false;
        }

        const userIndex = guildData.steam.findIndex(u => u.discord_id === discord_id);
        if (userIndex > -1) {
            guildData.steam[userIndex].steamid = steamid;
        } else {
            guildData.steam.push({ steamid, discord_id });
        }

        await guildData.save();
        return true;
    } catch (err) {
        console.error('Error saving new user to MongoDB:', err);
        return false;
    }
}

module.exports = {
	getIDByName,
	getIDByNameOrID,
	isPrivate,
	isLink,
	newUser,
	getUser
};
