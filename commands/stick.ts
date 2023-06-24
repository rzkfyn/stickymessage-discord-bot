import { Message } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';

export const run = async (message: Message, args: string[]) => {
  if (!args[0]) return;

  try {
    const stickyMessage = await StickyMessage.findOne({ serverId: message.guildId, channelId: message.channelId });
    const sentMessage = await message.channel.send(args.join(' '));

    if (stickyMessage) {
      const lasStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
      if (lasStickyMessage) await lasStickyMessage.delete();

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
