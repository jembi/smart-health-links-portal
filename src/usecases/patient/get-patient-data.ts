import { UserModel } from "@/domain/models/user";
import { IServerConfigRepository } from "@/infrastructure/repositories/interfaces/server-config-repository"
import { ExternalDataFetchError, HapiFhirService } from "@/services/hapi-fhir.service";

export const getPatientDataUseCase = async (context: {repo: IServerConfigRepository},
     data: {user: UserModel}): Promise<any> => {
    
    const serverConfig = (await context.repo.findMany()).find(x => x);
    
    if(!serverConfig){
        throw new ExternalDataFetchError('Missing Config error.');
    }
    try{
       const service = new HapiFhirService<any>(serverConfig.endpoint_url);
        const result = await service.getPatientData(data.user.getPatientId(), {});
        if(!result){
            throw new ExternalDataFetchError('Unfullfilled request');
        }

        return result; 
    }
    catch{
        throw new ExternalDataFetchError('Unfullfilled request',);
    }
}