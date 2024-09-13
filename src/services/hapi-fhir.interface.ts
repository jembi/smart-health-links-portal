export interface HapiFhirRequestOptions {
  headers?: unknown;
  data?: unknown;
}

export interface IHapiFhirService {
  getPatientData<T>(
    patientId: string,
    params: any,
    options?: HapiFhirRequestOptions,
  ): Promise<T>;
  searchPatient<T>(patientId: string): Promise<FhirSearchResult<T>>;
}

interface FhirMeta {
  versionId?: string;
  lastUpdated?: Date;
  source?: string;
  profile?: string[];
}

export interface FhirIdentifier {
  use?: string;
  system: string;
  value: string;
}

export interface FhirPatient {
  id: string;
  meta: FhirMeta;
  identifier: FhirIdentifier[];
  active: boolean;
}

export interface FhirSearchResult<T> {
  resourceType: string;
  id: string;
  meta: FhirMeta;
  type: 'searchset';
  total: number;
  link: { relation: string; url: string }[];
  entry?: FhirResource<T>[];
}

export interface FhirBundle<T> {
  resourceType: 'Bundle';
  indentifier: FhirIdentifier;
  type: string;
  timestamp: Date;
  entry: T[];
}

export interface FhirResource<T> {
  fullUrl: string;
  resource: T;
  search: {
    mode: string;
  };
  resourceType: string;
}
