import { Message } from 'discord.js';
import { readFileSync } from 'fs';
import watchStickyMessage from '../utils/watchStickyMessage.js';

const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export const run = async (message: Message) => {
  await message.channel.send('pong!');
  return await watchStickyMessage(message);
};

export const help = {
  name: 'ping',
  description: 'replies with pong!',
  example: `${prefix} ping`
};
