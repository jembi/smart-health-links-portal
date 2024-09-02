export interface HapiFhirRequestOptions{
    headers?: unknown;
    data?: unknown;
};

export interface IHapiFhirService<T> {
    getPatientData(patientId: string, params: T, options?: HapiFhirRequestOptions): Promise<T>;
    searchPatient(patientId: string): Promise<FhirSearchResult<T>>;
}

interface FhirMeta {
    versionId?: string,
    lastUpdated?: Date,
    source?: string,
    profile?: string[] 
}

export interface FhirIdentifier {
    use: string,
    system: string,
    value: string
}

export interface FhirPatient {
    id: string,
    meta: FhirMeta,
    identifier: FhirIdentifier[],
    active: boolean,
}

export interface FhirSearchResult<T> {
    resourceType: string,
    id: string,
    meta: FhirMeta,
    type: 'searchset',
    total: number,
    link: {relation: string, url: string }[],
    entry?: FhirResource<T>[]
}

export interface FhirResource<T> {
    fullUrl: string,
    resource: T,
    search: {
        mode: string
    },
    resourceType: string,
}