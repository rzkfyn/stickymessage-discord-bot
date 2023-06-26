import { Message } from 'discord.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';

export const run = async (message: Message) => {
  await message.channel.send('pong!');
  return await watchStickyMessage(message);
};
