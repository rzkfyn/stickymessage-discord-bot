import { Client, EmbedBuilder, Message } from 'discord.js';
import { readdirSync, readFileSync } from 'fs';

const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export const run = async (message: Message, args: string[], client: Client) => {
  const commandFiles = readdirSync('./commands/');

  if (!args[0]) {
    let lists = '';
    for (const commandFile of commandFiles) {
      const { help } = await import(`./${commandFile}`) as {
        help: { name: string; description: string; example: string; }
      };
      lists += `\`${prefix} ${help.name}\` - ${help.description}\n`;
    }

    return await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({ iconURL: client.user?.displayAvatarURL({ size: 256 }) ?? client.user?.defaultAvatarURL, name: 'Command Lists' })
          .setColor('Purple')
          .setDescription(lists)
      ]
    });
  }

  for (const commandFile of commandFiles) {
    if (args[0].toLowerCase() === commandFile.replace(/(\.js|\.ts)/, '')) {
      const { help } = await import(`./${commandFile}`) as {
        help: { name: string; description: string; example: string }
      };

      return await message.reply({
        content: `\`\`\`command: ${help.name}\n\n${help.description}\n\nexample: ${help.example}\`\`\``
      });
    }
  }

  return message.reply({ content: `❌ oops. can't find a command named ${args[0]}.` });
};

export const help = {
  name: 'help <command?>',
  description: 'shows the bot commands or shows single command desc.',
  example: `${prefix} help stick`
};
