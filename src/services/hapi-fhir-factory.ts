import { ServerConfigEntity } from "@/entities/server_config";
import { IHapiFhirService } from "./hapi-fhir.interface";
import { HapiFhirService } from "./hapi-fhir.service";

export class HapiFhirServiceFactory {
    static getService(serverConfig: ServerConfigEntity): IHapiFhirService<any> {
        return new HapiFhirService<any>(serverConfig.endpoint_url);
    }
}