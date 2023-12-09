import limitter from 'express-rate-limit';

// restricts to perform only a limited amount of auth requests

export const registerLimitter = limitter({
  windowMs: 1 * 60 * 1000,
  max: 2,
  message: {
    message: "Too many requests, please try again later.",
  },
});
export const loginLimitter = limitter({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many requests, please try again later.",
  },
});
