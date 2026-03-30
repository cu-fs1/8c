import { StatusCodes } from "http-status-codes";
import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";

  // Log the error using winston
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`, { 
      stack: err.stack,
      statusCode,
      method: req.method,
      url: req.originalUrl
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`, { 
      statusCode,
      method: req.method,
      url: req.originalUrl
    });
  }
  
  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
