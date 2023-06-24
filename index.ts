import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
const eventFiles = readdirSync('./events');

eventFiles.forEach(async (eventFile) => {
  const { default: event }: {
    default: {
      once: boolean,
      name: string,
      execute: (...args: any[]) => Promise<void>
    }
  } = await import(`./events/${eventFile}`);
  
  if (event.once) {
    client.once(event.name, async (...args) => await event.execute(...args));
  } else {
    client.on(event.name, async (...args) => await event.execute(...args));
  }
});

client.login(process.env.TOKEN);
