import { ShlinkDto } from "@/domain/dtos/shlink";
import { ShlinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";

export const mapEntityToModel = (shlinkEntity: SHLinkEntity): ShlinkModel | undefined => {
    return shlinkEntity ? new ShlinkModel(
        shlinkEntity.user_id, 
        shlinkEntity.passcode_failures_remaining, 
        shlinkEntity.active, 
        shlinkEntity.management_token, 
        shlinkEntity.config_passcode, 
        shlinkEntity.config_exp, 
        shlinkEntity.id
    ) : undefined;
}

export const mapModelToEntity = (shlinkModel: ShlinkModel): SHLinkEntity | undefined => {
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

export const mapModelToDto = (shlinkModel: ShlinkModel): ShlinkDto | undefined => {

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

export const mapDtoToModel = (shlinkDto: ShlinkDto): ShlinkModel | undefined => {
    return shlinkDto ? new ShlinkModel(
        shlinkDto.userId, 
        shlinkDto.passcodeFailuresRemaining, 
        shlinkDto.active, 
        shlinkDto.managementToken, 
        shlinkDto.configPasscode, 
        shlinkDto.configExp, 
        shlinkDto.id
    ) : undefined;
}