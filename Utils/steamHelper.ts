import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import { GuildModel } from './schemes';

async function getIDByName(name: string, apiKey: string): Promise<string | null> {
    const url = new URL(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${apiKey}&format=json`
    );
    url.searchParams.set('vanityurl', name);

    const res: any = await fetch(url);
    const data = await res.json();
    return data.response.steamid ?? null;
}

async function getIDByNameOrID(value: string, apiKey: string): Promise<string | { error: string }> {
    if (/^7656\d{13}$/u.test(value)) {
        return value;
    }
    const id = await getIDByName(value, apiKey);
    if (!id) {
        return { error: `No SteamID found for "${value}"` };
    }
    return id;
}

async function isPrivate(value: object): Promise<boolean> {
    return Object.keys(value).length === 0;
}

async function getUser(discordId: string, guildId: string): Promise<string | null> {
    try {
        const guildData = await GuildModel.findOne({ 'guild.id': guildId });
        if (!guildData) return null;

        const user = guildData.steam.find((u: { discord_id: string; steamid: string }) => u.discord_id === discordId);
        return user ? user.steamid : null;
    } catch (err) {
        console.error('Error fetching user from MongoDB:', err);
        return null;
    }
}

interface IsLinkParams {
    steamIdOrUsername?: string;
    interaction: { user: { id: string } };
    apiKey: string;
    guildId: string;
}

async function isLink({ steamIdOrUsername, interaction, apiKey, guildId }: IsLinkParams): Promise<{ steamid: string | null; error: string | null }> {
    let steamid: string | null = null;

    if (steamIdOrUsername) {
        const resolved = await getIDByNameOrID(steamIdOrUsername, apiKey);
        if ((resolved as any)?.error) return { steamid: null, error: (resolved as any).error };
        steamid = resolved as string;
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

async function newUser(steamid: string, discord_id: string, guildId: string): Promise<boolean> {
    try {
        const guildData = await GuildModel.findOne({ 'guild.id': guildId });
        if (!guildData) {
            console.error(`Guild with ID ${guildId} not found. Please run /mongodb initialize first.`);
            return false;
        }

        const userIndex = guildData.steam.findIndex((u: { discord_id:string }) => u.discord_id === discord_id);
        
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

export default {
	getIDByName,
	getIDByNameOrID,
	isPrivate,
	isLink,
	newUser,
	getUser
};