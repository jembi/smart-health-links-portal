export interface HapiFhirRequestOptions{
    headers?: unknown;
    data?: unknown;
};

export interface IHapiFhirService {
    getPatientData(patientId: string, params: unknown, options?: HapiFhirRequestOptions): Promise<unknown>;
}