export interface HapiFhirRequestOptions{
    headers?: unknown;
    data?: unknown;
};

export interface IHapiFhirService {
    getPatientData(patientId: string, filterString: string, options?: HapiFhirRequestOptions): Promise<unknown>;
}