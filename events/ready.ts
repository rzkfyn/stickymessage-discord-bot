import { Client } from 'discord.js';

export default {
  name: 'ready',
  once: true,
  execute: async (client: Client) => {
    console.log(`client is ready as ${client.user?.tag}`);
  }
};
