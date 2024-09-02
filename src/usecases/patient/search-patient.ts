import { IServerConfigRepository } from "@/infrastructure/repositories/interfaces/server-config-repository";
import { HapiFhirServiceFactory } from "@/services/hapi-fhir-factory";
import { FhirPatient, FhirSearchResult, IHapiFhirService } from "@/services/hapi-fhir.interface"
import { ExternalDataFetchError } from "@/services/hapi-fhir.service";

export const searchPatientUseCase = async(context: {repo: IServerConfigRepository}, data: {patientId: string}): Promise<string> => {
    const serviceConfig = (await context.repo.findMany({})).find(x => x);
    if(!serviceConfig){
        throw new ExternalDataFetchError('Missing Config error.');
    }

    const service: IHapiFhirService<FhirSearchResult<FhirPatient>> = HapiFhirServiceFactory.getService(serviceConfig);
    const result = await service.searchPatient(data.patientId);

    if(!result || !result.entry?.length){
        throw new ExternalDataFetchError('Patient Data not found.', 404)
    }
    return result.entry[0].resource.id
}