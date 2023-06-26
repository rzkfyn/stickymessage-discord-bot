import { Message } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';

export const run = async (message: Message) => {
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
