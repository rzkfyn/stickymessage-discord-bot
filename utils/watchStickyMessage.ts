import { EmbedBuilder, Message } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';

const watchStickyMessage = async (message: Message) => {
  let stickyMessage;
  try {
    stickyMessage = await StickyMessage.findOne({
      channelId: message.channelId, serverId: message.guildId, active: true
    });  
    if (!stickyMessage) return;

    await message.channel.messages.fetch();
    const lastStickyMessage = message.channel.messages.cache.get(stickyMessage.messageId as string);
    if (lastStickyMessage?.deletable) await lastStickyMessage.delete();

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

    return await StickyMessage.updateOne({ channelId: message.channelId, serverId: message.guildId }, {
      messageId: sentMessage.id
    });
  } catch(e) {
    console.log(e);
  }
};

export default watchStickyMessage;
