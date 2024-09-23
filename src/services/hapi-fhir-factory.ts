import { IHapiFhirService } from './hapi-fhir.interface';
import { HapiFhirService } from './hapi-fhir.service';
import { ServerConfigModel } from '@/domain/models/server-config';

export class HapiFhirServiceFactory {
  static getService(serverConfig: ServerConfigModel): IHapiFhirService {
    return new HapiFhirService(serverConfig.getEndpointUrl());
  }
}
