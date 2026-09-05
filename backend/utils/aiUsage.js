const AIUsage = require('../models/aiUsageModel');

const getUtcDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

const recordAIUsage = async ({ userId, usage, model }) => {
  if (!userId || !usage) return;

  const inputTokens = Number(usage.prompt_tokens ?? usage.input_tokens ?? 0);
  const outputTokens = Number(usage.completion_tokens ?? usage.output_tokens ?? 0);
  const totalTokens = Number(usage.total_tokens ?? (inputTokens + outputTokens));

  if (!Number.isFinite(totalTokens) || totalTokens < 0) return;

  const date = getUtcDateKey();
  const modelKey = model || 'unknown';

  await AIUsage.findOneAndUpdate(
    { userId, date },
    {
      $inc: {
        inputTokens,
        outputTokens,
        totalTokens,
        requests: 1,
        [`models.${modelKey}`]: totalTokens,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = { recordAIUsage, getUtcDateKey };
