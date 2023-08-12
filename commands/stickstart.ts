import { Message, EmbedBuilder } from 'discord.js';
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

export const help = {
  name: 'stickstart',
  description: 'starts a stopped sticky message from this channel.',
  example: `${prefix} stickstart`
};
