import { Attachment, EmbedBuilder, Message } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';
import checkUserPermission from '../utils/checkUserPermission.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';

export const run = async (message: Message, args: string[])  => {  
  if (!checkUserPermission(message)) {
    return await message.reply({
      content: '❌ | you must have `ManageMessages` permission to use this command!'
    });

    return await watchStickyMessage(message);
  }
  if (!args[0]) return;
  
  try {
    const stickyMessage = await StickyMessage.findOne({ serverId: message.guildId, channelId: message.channelId });

    let image = null;
    if (message.attachments.first()) {
      const { contentType, url } = message.attachments.first() as Attachment;
      image = contentType?.startsWith('image') ? url as string : null;
    }

    const sentMessage = await message.channel.send({ embeds: [
      new EmbedBuilder()
        .setColor('Purple')
        .setDescription(args.join(' '))
        .setImage(image)
    ] });

    if (stickyMessage) {
      let lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
      if (!lastStickyMessage) await message.channel.messages.fetch();
      lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
      if (lastStickyMessage?.deletable) await lastStickyMessage.delete();

      await StickyMessage.updateOne({ serverId: message.guildId, channelId: message.channelId }, {
        messageId: sentMessage.id, embed: true, active: true, image
      });
    } else {
      await StickyMessage.create({
        messageId: sentMessage.id,
        channelId: message.channelId,
        serverId: message.guildId,
        embed: true,
        image,
        content: args.join(' ')
      });
    }

    return await message.react('👌');
  } catch(e) {
    console.log(e);
    return await message.react('❌');
  }
};
