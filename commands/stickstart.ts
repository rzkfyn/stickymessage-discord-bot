import { Message, EmbedBuilder } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';

export const run = async (message: Message) => {
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

    await StickyMessage.updateOne({ serverId: message.guildId, channelId: message.guildId }, {
      active: true, messageId: sentMessage.id
    });

    return await message.react('👌');
  } catch(e) {    
    console.log(e);
    return await message.react('❌');
  }
};
