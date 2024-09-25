import { ServerConfigModel } from '@/domain/models/server-config';

import { IHapiFhirService } from './hapi-fhir.interface';
import { HapiFhirService } from './hapi-fhir.service';

export class HapiFhirServiceFactory {
  static getService(serverConfig: ServerConfigModel): IHapiFhirService {
    return new HapiFhirService(serverConfig.getEndpointUrl());
  }
}
