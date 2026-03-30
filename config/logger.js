import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true })),
    }),
    new winston.transports.File({ 
      filename: "logs/error.log", 
      level: "error",
      format: combine(timestamp(), logFormat) 
    }),
    new winston.transports.File({ 
      filename: "logs/combined.log",
      format: combine(timestamp(), logFormat)
    }),
  ],
});

export default logger;
