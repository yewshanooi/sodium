const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const fivedb_path = './fivedb.json';

async function ensureDbFileExists() {
    try {
        await fs.access(fivedb_path);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.warn('Database file not found. Creating a new one.');
            await fs.writeFile(fivedb_path, '{}', 'utf8');
        } else {
            console.error('Error checking database file:', err);
            throw err;
        }
    }
}

// Reads and safely parses the database file.
async function readDbFile() {
    try {
        const data = await fs.readFile(fivedb_path, 'utf8');
        if (!data.trim()) {
            return { steam: [] };
        }
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.warn('Database file not found. Creating a new one.');
            return { steam: [] };
        }
        console.error('Error reading or parsing database file:', err);
        throw err;
    }
}

// Saves data to the database file.
async function writeDbFile(data) {
    try {
        await fs.writeFile(fivedb_path, JSON.stringify(data, null, 4), 'utf8');
    } catch (err) {
        console.error('Error writing to database file:', err);
        throw err;
    }
}

// Gets a guild's log.
async function getGuildLog(client, guildId) {
    const guildLog = client.db.get(guildId);
    return guildLog || null;
}

// Initializes a new moderation log for a guild.
async function initializeGuildLog(client, interaction) {
    const guildLog = {
        guild: {
            name: interaction.guild.name,
            id: interaction.guild.id
        },
        items: []
    };
    client.db.set(interaction.guild.id, guildLog);
    return guildLog;
}

// Adds a new log item to a guild.
async function addLogItem(client, guildId, type, user, staff, reason, duration) {
    let guildLog = await getGuildLog(client, guildId);
    if (!guildLog) {
        guildLog = await initializeGuildLog(client, { guild: { name: 'Unknown', id: guildId } });
    }

    const logItem = {
        _id: uuidv4(),
        type: type,
        user: {
            name: user.username,
            id: user.id
        },
        staff: {
            name: staff.username,
            id: staff.id
        },
        reason: reason,
        duration: duration || null,
        timestamp: new Date()
    };

    guildLog.items.push(logItem);
    client.db.set(guildId, guildLog);

    return logItem._id;
}

// Removes a log item by ID.
async function removeLogItem(client, guildId, logId) {
    const guildLog = await getGuildLog(client, guildId);
    if (!guildLog) return false;

    const initialLength = guildLog.items.length;
    guildLog.items = guildLog.items.filter(item => item._id !== logId);

    if (guildLog.items.length < initialLength) {
        client.db.set(guildId, guildLog);
        return true;
    }
    return false;
}

module.exports = {
    readDbFile,
    writeDbFile,
    getGuildLog,
    initializeGuildLog,
    addLogItem,
    removeLogItem,
    ensureDbFileExists
};