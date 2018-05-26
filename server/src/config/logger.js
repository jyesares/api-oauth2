import morgan from 'morgan';
import winston from 'winston';
import Wdrf from 'winston-daily-rotate-file';

// logger for HTTP Request
export const loggerHttpRequest = morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev');

// logger for general purpose
const level = process.env.LOG_LEVEL || 'debug';
export const logger = new winston.Logger({
  level,
  transports: [
    new Wdrf({
      filename: `logs/${process.env.NODE_ENV}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      handleExceptions: true,
      json: true,
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    }),
  ],
});
