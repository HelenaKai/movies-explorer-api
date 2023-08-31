const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMS: 60000,
  max: 100,
  message: 'Превышел лимит запросов, попробуйте позже',
});

module.exports = rateLimiter;
