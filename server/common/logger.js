import winston from 'winston';
import * as os from 'os';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const myFormat = printf(info => {
  return `${info.timestamp} @${os.hostname()} @${os.type()} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    format.simple(),
    myFormat,
  ),
  transports: [new transports.Console()],
});

export default logger;
