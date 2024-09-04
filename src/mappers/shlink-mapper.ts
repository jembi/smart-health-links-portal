import { EXTERNAL_URL } from "@/app/constants/http-constants";
import { SHLinkDto, SHLinkMiniDto } from "@/domain/dtos/shlink";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEndpointModel } from "@/domain/models/shlink-endpoint";
import { SHLinkEntity } from "@/entities/shlink";

export const mapEntityToModel = (shlinkEntity: SHLinkEntity): SHLinkModel | undefined => {
    return shlinkEntity ? new SHLinkModel(
        shlinkEntity.user_id, 
        shlinkEntity.passcode_failures_remaining, 
        shlinkEntity.active, 
        shlinkEntity.management_token, 
        shlinkEntity.config_passcode, 
        shlinkEntity.config_exp, 
        shlinkEntity.id
    ) : undefined;
}

export const mapModelToEntity = (shlinkModel: SHLinkModel): SHLinkEntity | undefined => {
    return shlinkModel ? {
        id: shlinkModel.getId(),
        user_id: shlinkModel.getUserId(),
        passcode_failures_remaining: shlinkModel.getPasscodeFailuresRemaining(),
        active: shlinkModel.getActive(),
        management_token: shlinkModel.getManagementToken(),
        config_passcode: shlinkModel.getConfigPasscode(),
        config_exp: shlinkModel.getConfigExp(),
    } : undefined;
}

export const mapModelToDto = (shlinkModel: SHLinkModel): SHLinkDto | undefined => {

    return shlinkModel ? {
        id: shlinkModel.getId(),
        passcodeFailuresRemaining: shlinkModel.getPasscodeFailuresRemaining(),
        active: shlinkModel.getActive(),
        managementToken: shlinkModel.getManagementToken(),
        configPasscode: shlinkModel.getConfigPasscode(),
        configExp: shlinkModel.getConfigExp(),
        userId: shlinkModel.getUserId()
    } : undefined;
}

export const mapModelToMiniDto = (shlinkModel: SHLinkModel, files?: SHLinkEndpointModel[], ticket?: string): SHLinkMiniDto | undefined => {

    return shlinkModel ? {
        id: shlinkModel.getId(),
        managementToken: shlinkModel.getManagementToken(),
        files: files?.map(x=> {return{
            location: `${EXTERNAL_URL}/api/v1/share-links/${shlinkModel.getId()}/endpoints/${x.getId()}?ticket=${ticket}`,
            contentType: 'application/smart-api-access',
            embedded: null
        }})
    } : undefined;
}

export const mapDtoToModel = (shlinkDto: SHLinkDto): SHLinkModel | undefined => {
    return shlinkDto ? new SHLinkModel(
        shlinkDto.userId, 
        shlinkDto.passcodeFailuresRemaining, 
        shlinkDto.active, 
        shlinkDto.managementToken, 
        shlinkDto.configPasscode, 
        shlinkDto.configExp ? new Date(shlinkDto.configExp) : null, 
        shlinkDto.id
    ) : undefined;
}