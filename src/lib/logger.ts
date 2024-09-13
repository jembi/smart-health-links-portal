import { format, transports, createLogger, Logger } from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";

import loggerConfig from '../../logger.config.json'

const { combine, timestamp, printf, colorize } = format;

function getTransporters(){
    const dailyRotateFileTransport = getTransportersFromConfig(loggerConfig);
    return [
        new transports.Console(),
        ...dailyRotateFileTransport
      ]
}

function getTransportersFromConfig(config:any){
    return config.transporters.map(x => {
        if(x.transporterType === 'file'){
            return new DailyRotateFile(x.options)
        }
    }).filter(x => x)
}

function getFormat(){
    return combine(
        ...getFormatFromConfig(loggerConfig)
    )
}

function getFormatFromConfig(config:any){
    return config.format.map(x => {
        if(x === "colorize"){
            return colorize();
        }
        if(x === "timestamp"){
            return timestamp();
        }
        if(Array.isArray(x) && typeof(x) !== "string"){
            return printf((formatObject) => {
                
                let logParts: string[] = [];
                
                x.forEach((formatPart: string) => {
                    if (formatPart === "level") logParts.push(`[${formatObject[formatPart]}]`);
                    else if(formatPart in formatObject) logParts.push(formatObject[formatPart])
                });
                return logParts.join(' ');
            });

        }
        
    }).filter(x => x)
}

export function getLogger(){
    const logger: Logger = createLogger({
        format: getFormat(),
        transports: getTransporters()
    });

    return logger
}