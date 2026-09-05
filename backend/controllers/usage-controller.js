const AIUsage = require('../models/aiUsageModel');
const { getUtcDateKey } = require('../utils/aiUsage');

const getAIUsage = async (req, res) => {
  try {
    const today = getUtcDateKey();
    const rows = await AIUsage.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(30)
      .lean();

    const todayRow = rows.find((row) => row.date === today);

    return res.status(200).json({
      today: {
        date: today,
        inputTokens: todayRow?.inputTokens || 0,
        outputTokens: todayRow?.outputTokens || 0,
        totalTokens: todayRow?.totalTokens || 0,
        requests: todayRow?.requests || 0,
      },
      history: rows.map((row) => ({
        date: row.date,
        inputTokens: row.inputTokens || 0,
        outputTokens: row.outputTokens || 0,
        totalTokens: row.totalTokens || 0,
        requests: row.requests || 0,
      })),
    });
  } catch (error) {
    console.error('AI usage error:', error);
    return res.status(500).json({ message: 'Unable to load AI usage.' });
  }
};

module.exports = { getAIUsage };
