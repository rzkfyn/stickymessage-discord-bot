import { Message } from 'discord.js';

const checkUserPermission = (message: Message) => {
  const userAsMember = message.guild?.members.cache.get(message.author.id);
  if (!userAsMember?.permissions.has('ManageMessages') && !userAsMember?.permissions.has('Administrator')) return false;
  return true;
};

export default checkUserPermission;
