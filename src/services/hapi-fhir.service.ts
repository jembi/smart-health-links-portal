import { IAuthorization } from './authorization.interface';
import BaseService from './base-service.service';
import {
  IHapiFhirService,
  HapiFhirRequestOptions,
} from './hapi-fhir.interface';

export class ExternalDataFetchError extends Error {
  constructor(
    message: string,
    public code: number = 412,
  ) {
    super(message);
    this.name = 'ExternalDataFetchError';
  }
}

export class HapiFhirService
  extends BaseService
  implements IHapiFhirService, IAuthorization
{
  constructor(baseUrl: string) {
    super(baseUrl, 'fhir/Patient');
  }
  async searchPatient<T>(patientId: string): Promise<T> {
    return this.get<T>('', { identifier: patientId });
  }

  async getAccessToken<T>(
    endpoint: string,
    clientId?: string,
    clientSecret?: string,
    username?: string,
    password?: string,
  ): Promise<T> {
    throw new Error('Method not implemented.');
  }

  async getPatientData<T>(
    patientId: string,
    params: T,
    options?: HapiFhirRequestOptions,
  ): Promise<T> {
    return this.get<T>(`${patientId}/$summary`, params);
  }
}
