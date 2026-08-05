import mongoose from 'mongoose';

const botChatSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: true,
  },
  botReply: {
    type: String,
    required: true,
  },
  // expires: 604800 sets a TTL (Time To Live) index. 
  // 604800 seconds = exactly 7 days (1 week). MongoDB will automatically delete records older than this.
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 
  }
});

const BotChat = mongoose.models.BotChat || mongoose.model('BotChat', botChatSchema);

export default BotChat;
