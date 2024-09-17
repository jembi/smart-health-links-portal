import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import {
  FhirPatient,
  FhirSearchResult,
  IHapiFhirService,
} from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';
import { Patient } from 'fhir/r4';

export const searchPatientUseCase = async (
  context: { repo: IServerConfigRepository },
  data: { patientId: string; email: string },
): Promise<string> => {
  const serviceConfig = (await context.repo.findMany({})).find((x) => x);
  if (!serviceConfig) {
    throw new ExternalDataFetchError('Missing Config error.');
  }

  const service: IHapiFhirService =
    HapiFhirServiceFactory.getService(serviceConfig);
  const result = await service.searchPatient<FhirSearchResult<FhirPatient>>(
    data.patientId,
  );

  if (
    !result ||
    !result.entry?.length ||
    !findEmailAddress(
      result.entry[0].resource as unknown as Patient,
      data.email,
    )
  ) {
    throw new ExternalDataFetchError('Patient Data not found.', 404);
  }
  return result.entry[0].resource.id;
};

const findEmailAddress = (patient: Patient, email: string) => {
  return patient.telecom?.find(
    (x) => x.system === 'email' && x.value === email,
  );
};
