import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import Database from './db/Database.js';

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
      execute: (client: Client, ...args: any[]) => Promise<void>
    }
  } = await import(`./events/${eventFile}`);
  
  if (event.once) {
    client.once(event.name, async (...args) => await event.execute(client, ...args));
  } else {
    client.on(event.name, async (...args) => await event.execute(client, ...args));
  }
});

(async () => {
  try {
    await Database.init();
  } catch(e) {
    console.error(e);
  }
})();

client.login(process.env.TOKEN);
