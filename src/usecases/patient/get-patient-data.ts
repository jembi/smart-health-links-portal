import { ServerConfigModel } from '@/domain/models/server-config';
import { UserModel } from '@/domain/models/user';
import { IServerConfigRepository } from '@/infrastructure/repositories/interfaces/server-config-repository';
import { IUserRepository } from '@/infrastructure/repositories/interfaces/user-repository';
import { mapEntityToModel } from '@/mappers/server-config-mapper';
import { mapModelToEntity } from '@/mappers/user-mapper';
import { HapiFhirServiceFactory } from '@/services/hapi-fhir-factory';
import { FhirBundle, FhirPatient } from '@/services/hapi-fhir.interface';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';

export const getPatientDataUseCase = async (
  context: { repo: IServerConfigRepository; userRepo: IUserRepository },
  data: { user: UserModel },
): Promise<any> => {
  const serverConfigs = (await context.repo.findMany()).map((x) =>
    mapEntityToModel(x),
  );

  if (!serverConfigs.length) {
    throwMissingConfigError();
  }
  try {
    let result: FhirBundle<FhirPatient>;
    if (!data.user.getServerConfigId()) {
      result = await fetchDataFromAllConfigs(serverConfigs, data.user, {
        userRepo: context.userRepo,
      });
    } else {
      result = await fetchDataFromUserConfig(serverConfigs, data.user);
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

const getData = (serverConfig: ServerConfigModel, user: UserModel) => {
  const service = HapiFhirServiceFactory.getService(serverConfig);

  return service.getPatientData<FhirBundle<FhirPatient>>(
    user.getPatientId(),
    {},
  );
};

const fetchDataFromAllConfigs = async (
  serverConfigs: ServerConfigModel[],
  user: UserModel,
  context: { userRepo: IUserRepository },
) => {
  for (const serverConfig of serverConfigs) {
    try {
      const result = await getData(serverConfig, user);

      if (result) {
        user.setServerConfigId(serverConfig.getId());
        await context.userRepo.update(mapModelToEntity(user));
        return result;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
};

const fetchDataFromUserConfig = async (
  serverConfigs: ServerConfigModel[],
  user: UserModel,
) => {
  const serverConfig = serverConfigs.find(
    (x) => x.getId() === user.getServerConfigId(),
  );
  if (!serverConfig) throwMissingConfigError();

  return getData(serverConfig, user);
};
