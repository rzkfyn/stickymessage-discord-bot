import { Schema, model } from 'mongoose';

const schema = new Schema({
  serverId: String,
  channelId: String,
  content: String
}, {
  timestamps: true
});
const StickyMessage = model('StickyMessage', schema);

export default StickyMessage;
