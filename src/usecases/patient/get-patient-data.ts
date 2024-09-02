import { UserModel } from "@/domain/models/user";
import { IServerConfigRepository } from "@/infrastructure/repositories/interfaces/server-config-repository"
import { HapiFhirServiceFactory } from "@/services/hapi-fhir-factory";
import { FhirBundle } from "@/services/hapi-fhir.interface";
import { ExternalDataFetchError } from "@/services/hapi-fhir.service";

export const getPatientDataUseCase = async (context: {repo: IServerConfigRepository},
     data: {user: UserModel}): Promise<any> => {
    
    const serverConfig = (await context.repo.findMany()).find(x => x);
    
    if(!serverConfig){
        throw new ExternalDataFetchError('Missing Config error.');
    }
    try{
        const service = HapiFhirServiceFactory.getService(serverConfig);
        const result = await service.getPatientData<FhirBundle<any>>(data.user.getPatientId(), {});
        if(!result){
            throw new ExternalDataFetchError('Unfullfilled request');
        }

        return result; 
    }
    catch{
        throw new ExternalDataFetchError('Unfullfilled request',);
    }
}