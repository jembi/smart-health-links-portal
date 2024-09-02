import { IAuthorization } from "./authorization.interface";
import BaseService from "./base-service.service";
import { IHapiFhirService, HapiFhirRequestOptions, FhirSearchResult } from "./hapi-fhir.interface";

export class ExternalDataFetchError extends Error {
    constructor(message: string, public code: number = 412) {
      super(message);
      this.name = 'ExternalDataFetchError';
    }
}

export class HapiFhirService<T> extends BaseService<T> implements IHapiFhirService<T>, IAuthorization {
    constructor(baseUrl: string){
        super(baseUrl, 'fhir/Patient')
    }
    async searchPatient(patientId: string): Promise<FhirSearchResult<T>> {
        return this.get('', {identifier: patientId}) as Promise<FhirSearchResult<T>>;
    }
    
    async getAccessToken(endpoint: string, clientId?: string, clientSecret?: string, username?: string, password?: string): Promise<T> {
        throw new Error("Method not implemented.");
    }

    async getPatientData(patientId: string, params: T, options?: HapiFhirRequestOptions): Promise<T> {
        return this.get(`${patientId}/$summary`, params);
    }
}