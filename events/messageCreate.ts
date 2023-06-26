import { Client, Message } from 'discord.js';
import { readFileSync, readdirSync } from 'fs';
import watchStickyMessage from '../utils/watchStickyMessage.js';

const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));
const commandFiles = readdirSync('./commands');

export default {
  once: false,
  name: 'messageCreate',
  execute: async (client: Client, message: Message) => {
    if (message.author.id !== client.user?.id && !message.content.startsWith(prefix)) await watchStickyMessage(message);
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.isDMBased()) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ /g);
    const command = args.shift()?.toLowerCase();

    for (const commandFile of commandFiles) {
      if (command === commandFile.replace(/(.ts|.js)/, '')) {
        const { run } = await import(`../commands/${commandFile}`) as { run: (message: Message, args: string[]) => Promise<void> };
        return await run(message, args);
      }
    }
  }
};
