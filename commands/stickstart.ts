import { Message, EmbedBuilder } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';
import checkUserPermission from '../utils/checkUserPermission.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';

export const run = async (message: Message) => {
  if (!checkUserPermission(message)) {
    await message.reply({
      content: '❌ | you must have `ManageMessages` permission to use this command!'
    });

    return await watchStickyMessage(message);
  }

  try {
    const stickyMessage = await StickyMessage.findOne({ serverId: message.guildId, channelId: message.channelId, active: false });
    if (!stickyMessage) return;

    let sentMessage;
    if (stickyMessage.embed) {
      sentMessage = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setDescription(stickyMessage?.content as string)
            .setColor('Purple')
            .setImage(stickyMessage.image ?? null)
        ]
      });
    } else {
      sentMessage = await message.channel.send(stickyMessage?.content as string);
    }

    await StickyMessage.updateOne({ serverId: message.guildId, channelId: message.channelId }, {
      active: true, messageId: sentMessage.id
    });

    return await message.react('👌');
  } catch(e) {    
    console.log(e);
    return await message.react('❌');
  }
};
