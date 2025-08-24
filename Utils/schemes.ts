import { Schema, model, Document } from 'mongoose';

interface Guild {
    _id: Schema.Types.ObjectId;
    guild: {
        name: string;
        id: string;
    };
    leaderboards: Leaderboard[];
    logs: Log[];
    steam: {
        steamid: string;
        discord_id: string;
    }[];
    language?: string;
}

interface Leaderboard {
    _id: Schema.Types.ObjectId;
    user: {
        name?: string | null;
        id: string;
    };
    points?: number;
}

interface Log {
    _id: Schema.Types.ObjectId;
    type?: string;
    user: {
        name?: string | null;
        id: string;
    };
    staff?: {
        name: string;
        id: string;
    };
    reason?: string;
    timestamp?: Date;
}

const leaderboardSchema = new Schema<Leaderboard>({
    _id: Schema.Types.ObjectId,
    user: {
        name: { type: String, default: null },
        id: String
    },
    points: { type: Number, default: 0 }
});

const logSchema = new Schema<Log>({
    _id: Schema.Types.ObjectId,
    type: String,
    user: {
        name: { type: String, default: null },
        id: String
    },
    staff: {
        name: String,
        id: String
    },
    reason: String,
    timestamp: { type: Date, default: Date.now }
});

const guildSchema = new Schema<Guild>({
   _id : Schema.Types.ObjectId,
   guild : {
       name : String,
       id : String
   },
   leaderboards : [leaderboardSchema],
   logs : [logSchema],
   steam : [
       {
           steamid : String,
           discord_id : String
       }
   ],
   language : {
       type : String,
       default : 'en'
   }
});

export const GuildModel = model<Guild>('Guild', guildSchema, 'guilds');
export const LeaderboardModel = model<Leaderboard>('Leaderboard', leaderboardSchema, 'leaderboards');
export const LogModel = model<Log>('Log', logSchema, 'logs');