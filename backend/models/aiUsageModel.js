const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
  },
  inputTokens: {
    type: Number,
    default: 0,
  },
  outputTokens: {
    type: Number,
    default: 0,
  },
  totalTokens: {
    type: Number,
    default: 0,
  },
  requests: {
    type: Number,
    default: 0,
  },
  models: {
    type: Map,
    of: Number,
    default: {},
  },
}, { timestamps: true });

aiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

const AIUsage = mongoose.model('AIUsage', aiUsageSchema);
module.exports = AIUsage;
