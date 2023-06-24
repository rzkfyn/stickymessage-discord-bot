import { Message } from 'discord.js';

export const run = async (message: Message) => {
  return await message.channel.send('pong!');
};
