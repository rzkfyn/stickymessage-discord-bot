import { Message } from 'discord.js';
import { readFileSync } from 'fs';

const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export default {
  once: false,
  name: 'messageCreate',
  execute: async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.channel.isDMBased()) return;
    if (message.content.slice(prefix.length).toLocaleLowerCase().trim() === 'ping') await message.channel.send({
      content: 'pong 🏓'
    });
  }
};
