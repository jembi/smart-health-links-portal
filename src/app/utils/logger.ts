import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file'; 


const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});


const dailyRotateFileTransport = new DailyRotateFile({
  filename: 'logs/logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger: Logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console(),
    dailyRotateFileTransport
  ],
});

export default logger;
