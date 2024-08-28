import { UserModel } from "@/domain/models/user";
import { IServerConfigRepository } from "@/infrastructure/repositories/interfaces/server-config-repository"
import { HapiFhirService } from "@/services/hapi-fhir.service";
import { AxiosError } from "axios";

export const getPatientDataUseCase = async (context: {repo: IServerConfigRepository},
     data: {user: UserModel}): Promise<any> => {
    
    const serverConfig = (await context.repo.findMany()).find(x => x);
    
    if(!serverConfig){
        throw new Error('Missing Config error.');
    }

    const service = new HapiFhirService<any>(serverConfig.endpoint_url);
    const result = await service.getPatientData(data.user.getPatientId(), {});
    if(!result){
        throw new AxiosError('Unfullfilled request', '412');
    }

    return result;
}