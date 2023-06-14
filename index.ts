import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { readFileSync } from 'fs';

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
const { prefix } = JSON.parse(readFileSync('./config.json', 'utf-8'));

client.on('ready', (client) => {
  console.log(`client is ready as ${client.user.tag}.`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot || message.channel.isDMBased()) return;
  if (message.content.slice(prefix.length).toLocaleLowerCase().trim() === 'ping') await message.channel.send({
    content: 'pong 🏓'
  });
});

client.login(process.env.TOKEN);
