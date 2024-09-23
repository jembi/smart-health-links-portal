import { Patient } from 'fhir/r4';

import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import {
  FhirPatient,
  FhirSearchResult,
  IHapiFhirService,
} from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';
import { mapEntityToModel } from '@/mappers/server-config-mapper';
import { ServerConfigModel } from '@/domain/models/server-config';

export const searchPatientUseCase = async (
  context: { repo: IServerConfigRepository },
  data: { patientId: string; email: string },
) => {
  const serviceConfigs = (await context.repo.findMany({})).map((x) =>
    mapEntityToModel(x),
  );
  if (!serviceConfigs.length) {
    throw new ExternalDataFetchError('Missing Config error.');
  }

  let result: FhirSearchResult<FhirPatient>;
  let serverConfig: ServerConfigModel;
  for (const serviceConfig of serviceConfigs) {
    try {
      serverConfig = serviceConfig;
      const service: IHapiFhirService =
        HapiFhirServiceFactory.getService(serviceConfig);
      result = await service.searchPatient<FhirSearchResult<FhirPatient>>(
        data.patientId,
      );
      if (result) break;
    } catch {}
  }

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
  return { patient: result.entry[0].resource, serverConfig };
};

export const findEmailAddress = (patient: Patient, email: string) => {
  return patient.telecom?.find(
    (x) => x.system === 'email' && x.value === email,
  );
};
