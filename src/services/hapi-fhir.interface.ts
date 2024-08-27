import { IAuthorization } from "./authorization.interface";

export interface HapiFhirRequestOptions{
    headers?: unknown;
    data?: unknown;
};

export interface IHapiFhirInterface {
    getPatientData(filterString: string, options?: HapiFhirRequestOptions): Promise<unknown>;
}