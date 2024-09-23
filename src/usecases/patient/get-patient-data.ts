import { UserModel } from '@/domain/models/user';
import { ServerConfigEntity } from '@/entities/server_config';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { mapModelToEntity } from '@/mappers/user-mapper';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import { FhirBundle, FhirPatient } from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';

export const getPatientDataUseCase = async (
  context: { repo: IServerConfigRepository; userRepo: IUserRepository },
  data: { user: UserModel },
): Promise<any> => {
  const serverConfigs = await context.repo.findMany();

  if (!serverConfigs.length) {
    throwMissingConfigError();
  }
  try {
    let result: FhirBundle<any>;
    if (!data.user.getServerConfigId()) {
      for (const serverConfig of serverConfigs) {
        try {
          result = await getData(serverConfig, data.user);

          if (result) {
            data.user.setServerConfigId(serverConfig.id);
            await context.userRepo.update(mapModelToEntity(data.user));
            break;
          }
        } catch {}
      }
    } else {
      try {
        const serverConfig = await serverConfigs.find(
          (x) => x.id === data.user.getServerConfigId(),
        );
        result = await getData(serverConfig, data.user);
      } catch {
        throwMissingConfigError();
      }
    }

    if (!result) {
      throw new ExternalDataFetchError('Unfullfilled request');
    }

    return result;
  } catch {
    throw new ExternalDataFetchError('Unfullfilled request');
  }
};

const throwMissingConfigError = () => {
  throw new ExternalDataFetchError('Missing Config error.');
};

const getData = (serverConfig: ServerConfigEntity, user: UserModel) => {
  const service = HapiFhirServiceFactory.getService(serverConfig);

  return service.getPatientData<FhirBundle<FhirPatient>>(
    user.getPatientId(),
    {},
  );
};
