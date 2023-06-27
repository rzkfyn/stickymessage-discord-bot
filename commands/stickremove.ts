import { Message } from 'discord.js';
import checkUserPermission from '../utils/checkUserPermission.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';
import StickyMessage from '../models/StickyMessage.js';

export const run = async (message: Message) => {
  if (!checkUserPermission(message)) {
    await message.reply({
      content: '❌ | you must have `ManageMessages` permission to use this command!'
    });

    return await watchStickyMessage(message);
  }

  try {
    const stickyMessage = await StickyMessage.findOneAndDelete({ serverId: message.guildId, channelId: message.channelId });
    if (!stickyMessage) return;

    let lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
    if (!lastStickyMessage) await message.channel.messages.fetch();
    lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
    if (lastStickyMessage?.deletable) await lastStickyMessage.delete();

    return await message.react('👌');
  } catch(e) {
    console.log(e);
    return await message.react('❌');
  }
};
