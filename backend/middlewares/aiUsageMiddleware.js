const axios = require('axios');
const { AsyncLocalStorage } = require('async_hooks');
const { recordAIUsage } = require('../utils/aiUsage');

const usageContext = new AsyncLocalStorage();
let patched = false;

const patchAxiosForUsage = () => {
  if (patched) return;
  patched = true;

  const originalPost = axios.post.bind(axios);
  axios.post = async (...args) => {
    const response = await originalPost(...args);
    const url = String(args[0] || '');
    const store = usageContext.getStore();

    if (store?.userId && /\/chat\/completions(?:\?|$)/.test(url)) {
      const usage = response?.data?.usage;
      const model = response?.data?.model;
      if (usage) {
        recordAIUsage({ userId: store.userId, usage, model }).catch((error) => {
          console.error('AI usage recording failed:', error.message);
        });
      }
    }

    return response;
  };
};

patchAxiosForUsage();

const aiUsageMiddleware = (req, res, next) => {
  if (!req.user?._id) return next();
  usageContext.run({ userId: req.user._id }, next);
};

module.exports = { aiUsageMiddleware };
