import logger from "../config/logger.js";

const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logDetails = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
    };

    const message = `${req.method} ${req.originalUrl} | ${res.statusCode} | ${duration}ms`;

    switch (true) {
      case res.statusCode >= 500:
        logger.error(message, logDetails);
        break;
      case res.statusCode >= 400:
        logger.warn(message, logDetails);
        break;
      default:
        logger.info(message, logDetails);
        break;
    }
  });

  next();
};

export default loggerMiddleware;
