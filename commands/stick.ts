import { Message } from 'discord.js';
import { readFileSync } from 'fs';
import StickyMessage from '../models/StickyMessage.js';
import checkUserPermission from '../utils/checkUserPermission.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';

const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export const run = async (message: Message, args: string[]) => {
  if (!checkUserPermission(message)) {
    await message.reply({
      content: '❌ | you must have `ManageMessages` permission to use this command!'
    });

    return await watchStickyMessage(message);
  }
  if (!args[0]) return message.react('❌');

  try {
    const stickyMessage = await StickyMessage.findOne({ serverId: message.guildId, channelId: message.channelId });
    const sentMessage = await message.channel.send(args.join(' '));

    if (stickyMessage) {
      let lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
      if (!lastStickyMessage) await message.channel.messages.fetch();
      lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
      if (lastStickyMessage?.deletable) await lastStickyMessage.delete();

      await StickyMessage.updateOne({ serverId: message.guildId, channelId: message.channelId }, {
        content: args.join(' '), messageId: sentMessage.id, embed: false, active: true
      });
    } else {
      await StickyMessage.create({
        serverId: message.guildId,
        channelId: message.channelId,
        messageId: sentMessage.id,
        content: args.join(' '),
        embed: false,
        active: true,
      });
    }

    return await message.react('👌');
  } catch(e) {
    console.log(e);
    await message.react('❌');
  }
};

export const help = {
  name: 'stick <message>',
  description: 'sticks a message.',
  example: `${prefix} stick hello, world`
};
