import { Message } from 'discord.js';
import { readFileSync } from 'fs';
import StickyMessage from '../models/StickyMessage.js';
import checkUserPermission from '../utils/checkUserPermission.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';

const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export const run = async (message: Message) => {
  if (!checkUserPermission(message)) {
    await message.reply({
      content: '❌ | you must have `ManageMessages` permission to use this command!'
    });

    return await watchStickyMessage(message);
  }

  try {
    const stickyMessage = await StickyMessage.findOne({ serverId: message.guildId, channelId: message.channelId, active: true });
    if (!stickyMessage) return;

    let lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
    if (!lastStickyMessage) await message.channel.messages.fetch();
    lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
    if (lastStickyMessage?.deletable) await lastStickyMessage.delete();

    await StickyMessage.updateOne({ serverId: message.guildId, channelId: message.channelId }, {
      active: false
    });

    return await message.react('👌');
  } catch(e) {    
    console.log(e);
    return await message.react('❌');
  }
};

export const help = {
  name: 'stickstop',
  description: 'stops an active sticky message from this channel.',
  example: `${prefix} stickstop`
};
