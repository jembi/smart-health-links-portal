import * as fs from 'fs';
import * as path from 'path';

import { format, transports, createLogger, Logger } from 'winston';
import DailyRotateFile from "winston-daily-rotate-file";

const getConfig = (): { transporters: any[], format: any[] } => {  
    const defaultFormat = ['timestamp', 'json'];
    try {
        const configPath = path.resolve('./logger.config.json');

        if (!fs.existsSync(configPath)) {
            throw new Error("Configuration file missing");
        }

        const rawData = fs.readFileSync(configPath, 'utf-8');
        let logConfig = JSON.parse(rawData);
        logConfig.transporters = logConfig.transporters || [];
        logConfig.format = logConfig.format || defaultFormat;

        return logConfig;
    } catch (error) {
        console.warn("Using default configuration due to error:", error.message);

        return {
            transporters: [],
            format: defaultFormat
        };
    }
};

const loggerConfig = getConfig();

const { combine, timestamp, printf, colorize, json } = format;

function getTransporters(){
    return [
        new transports.Console(),
        ...getTransportersFromConfig(loggerConfig)
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

const formatFunctions = {
    timestamp: timestamp,
    colorize: colorize,
    json: json,
  };

function getFormatFromConfig(config:any){
    return config.format.map(x => {
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
        else if (typeof x === 'string' && x in formatFunctions) {
            return formatFunctions[x]();
        }
    }).filter(x => x)
}

export function getLogger(module:string){
    
    const logger: Logger = createLogger({
        defaultMeta:{   
            service:'share_link_api_service',
            module:module
        },
        format: getFormat(),
        transports: getTransporters()
    });

    return logger;
}


export class LogHandler{
  private logger:Logger;

  constructor(module:string) {
    this.logger = getLogger(module);
  }

  log(message:string, type:'info'|'warn'|'error' = "info"){
    this.logger.log({
      level: type,
      message
    });
  }

}