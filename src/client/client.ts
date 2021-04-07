import { Client, Collection } from 'discord.js';
import { Command, Event, Config } from '../interfaces';
import BotConfig from '../config/config.json';
import fs from 'fs';
import path from 'path';

class ModMailBot extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, Command> = new Collection();
    public config: Config = BotConfig;
    public async init(): Promise<void> {
        this.login(this.config.token);

        const commandPath = path.join(__dirname, '..', 'handlers', 'commands');
        fs.readdirSync(commandPath).forEach((dir) => {
            const commands = fs.readdirSync(`${commandPath}/${dir}`).filter(file => file.endsWith('ts'));
            for (const file of commands) {
                const { command } = require(`${commandPath}/${dir}/${file}`);
                if (!command.name) {
                    throw new Error('Command file is empty');
                }
                this.commands.set(command.name, command);
                if (command.aliases && command.aliases.length !== 0) {
                    command.aliases.forEach((aliase: string) => {
                        this.aliases.set(aliase, command);
                    });
                }
            }
        });

        const eventPath = path.join(__dirname, '..', 'handlers', 'events');
        fs.readdirSync(eventPath).forEach(async file => {
            const { event } = await import(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            this.on(event.name, event.run.bind(null, this));
        });
    }
}   

export default ModMailBot;
export { ModMailBot };