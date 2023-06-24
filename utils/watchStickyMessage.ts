import { Message } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';

const watchStickyMessage = async (message: Message) => {
  let stickyMessage;
  try {
    stickyMessage = await StickyMessage.findOne({
      channelId: message.channelId, serverId: message.guildId
    });  
    if (!stickyMessage) return;

    const lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
    if (lastStickyMessage) await lastStickyMessage.delete();

    const sentMessage = await message.channel.send(stickyMessage?.content as string);
    return await StickyMessage.updateOne({ channelId: message.channelId, serverId: message.guildId }, {
      messageId: sentMessage.id
    });
  } catch(e) {
    console.log(e);
  }
};

export default watchStickyMessage;
