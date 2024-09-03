import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, ServerConfigRepositoryToken, UserRepositoryToken } from "@/container";
import { CreateUserDto, UserDto } from "@/domain/dtos/user";
import { IServerConfigRepository } from "@/infrastructure/repositories/interfaces/server-config-repository";
import { IUserRepository } from "@/infrastructure/repositories/interfaces/user-repository";
import { mapDtoToModel, mapModelToDto } from "@/mappers/user-mapper";
import { searchPatientUseCase } from "@/usecases/patient/search-patient";
import { addUserUseCase } from "@/usecases/users/add-user";
import { NextResponse } from "next/server";


const repo = container.get<IUserRepository>(UserRepositoryToken);
const serverConfigRepo =  container.get<IServerConfigRepository>(ServerConfigRepositoryToken);

export async function POST(request: Request) {
    let dto: CreateUserDto = await request.json();
    try{
        const patientId = await searchPatientUseCase({repo: serverConfigRepo}, {patientId: dto.patientId })
        dto.patientId = patientId;
        const model = mapDtoToModel(dto as UserDto)
        const newUser = await addUserUseCase({ repo}, {user: model})
        return NextResponse.json(mapModelToDto(newUser), { status: 201 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}
