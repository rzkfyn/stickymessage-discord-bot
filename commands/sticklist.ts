import { Client, EmbedBuilder, Message } from 'discord.js';
import StickyMessage from '../models/StickyMessage.js';
import watchStickyMessage from '../utils/watchStickyMessage.js';

export const run  = async (message: Message, _: string[], client: Client) => {
  try {
    const stickyMessages = await StickyMessage.find({ serverId: message.guildId });
    let desc = '';
  
    stickyMessages.forEach((stickyMessage) => {
      const channel = message.guild?.channels.cache.get(stickyMessage.channelId as string);
      let previewText = '';

      if (stickyMessage.content?.length as number > 40) {
        for (let i = 0; i < 40; i ++)  {
          previewText += stickyMessage.content?.split('')[i] as string;
        }
        previewText += '...';
      } else {
        previewText = stickyMessage.content as string;
      }

      desc += `**${stickyMessage.active ? 'Active' : 'Inactive' } ${stickyMessage.embed ? 'embed' : 'classic'} sticky message in #${channel?.name}**\n\`\`\`${previewText}\`\`\`\n`;
    });
  
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('Purple')
          .setTitle(`Sticky Messages in ${message.guild?.name} - (${stickyMessages.length})`)
          .setDescription(desc)
          .setFooter({ 
            iconURL: client.user?.displayAvatarURL(),
            text: `${client.user?.username} • github.com/rzkfyn`
          })
      ]
    });
  } catch(e) {
    console.log(e);
    return await message.react('❌');
  }

  return await watchStickyMessage(message);
};  
