import { UserModel } from '@/domain/models/user';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import { FhirBundle } from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';

export const getPatientDataUseCase = async (
  context: { repo: IServerConfigRepository },
  data: { user: UserModel },
): Promise<any> => {
  const serverConfigs = await context.repo.findMany();

  if (!serverConfigs.length) {
    throw new ExternalDataFetchError('Missing Config error.');
  }
  try {
    let result: FhirBundle<any>;
    for (const serverConfig of serverConfigs) {
      try {
        const service = HapiFhirServiceFactory.getService(serverConfig);
        result = await service.getPatientData<FhirBundle<any>>(
          data.user.getPatientId(),
          {},
        );
        if (result) break;
      } catch {}
    }

    if (!result) {
      throw new ExternalDataFetchError('Unfullfilled request');
    }

    return result;
  } catch {
    throw new ExternalDataFetchError('Unfullfilled request');
  }
};
