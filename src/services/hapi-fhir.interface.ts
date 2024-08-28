export interface HapiFhirRequestOptions{
    headers?: unknown;
    data?: unknown;
};

export interface IHapiFhirInterface {
    getPatientData(patientId: string, params: any, options?: HapiFhirRequestOptions): Promise<unknown>;
}