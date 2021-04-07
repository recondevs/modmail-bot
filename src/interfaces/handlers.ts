import ModMailBot from '../client/client';
import { Message } from 'discord.js';
import { ClientEvents } from 'discord.js';

interface CommandRun {
    (client: ModMailBot, message: Message, args: string[]);
}

interface EventRun {
    (client: ModMailBot, ...args: any[]);
}

export interface Command {
    name: string;
    description?: string;
    usage: string;
    devOnly?: boolean;
    aliases?: string[];
    run: CommandRun;
}

export interface Event {
    name: keyof ClientEvents;
    run: EventRun;
}