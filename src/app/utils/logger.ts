import { getLogger } from '@/lib/logger';


export class Logger{
  route: string;

  constructor(route: string = "/api/v1") {
    this.route = route;
  }

  log(message = "api connected", type = "info", route = this.route){
    const logger = getLogger()

    logger.log({
      level: type,
      message: `[${route}]: ${message}`
    });
  }

}