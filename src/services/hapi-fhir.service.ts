import { IAuthorization } from "./authorization.interface";
import BaseService from "./base-service.service";
import { IHapiFhirService, HapiFhirRequestOptions } from "./hapi-fhir.interface";

export class HapiFhirService<T> extends BaseService<T> implements IHapiFhirService, IAuthorization {
    constructor(baseUrl: string){
        super(baseUrl, 'fhir/Patient')
    }
    
    async getAccessToken(endpoint: string, clientId?: string, clientSecret?: string, username?: string, password?: string): Promise<unknown> {
        throw new Error("Method not implemented.");
    }

    async getPatientData(patientId: string, params: any, options?: HapiFhirRequestOptions): Promise<unknown> {
<<<<<<< Updated upstream
        return this.get(patientId, params);
=======
        return this.get(`${patientId}`, params);
>>>>>>> Stashed changes
    }
}