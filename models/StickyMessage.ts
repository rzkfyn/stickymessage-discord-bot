import { Schema, model } from 'mongoose';

const schema = new Schema({
  serverId: String,
  channelId: String,
  messageId: String,
  content: String,
  embed: Boolean,
  image: String,
  active: Boolean
}, {
  timestamps: true
});
const StickyMessage = model('StickyMessage', schema);

export default StickyMessage;
