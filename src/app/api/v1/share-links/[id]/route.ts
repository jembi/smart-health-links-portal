import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { AccessTicketRepositoryToken, container, SHLinkAccessRepositoryToken, SHLinkEndpointRepositoryToken, SHLinkRepositoryToken } from "@/container";
import { SHLinkRequestDto } from "@/domain/dtos/shlink";
import { AccessTicketModel } from "@/domain/models/access-ticket";
import { SHLinkAccessModel } from "@/domain/models/shlink-access";
import { IAccessTicketRepository } from "@/infrastructure/repositories/interfaces/access-ticket-repository.interface";
import { ISHLinkAccessRepository } from "@/infrastructure/repositories/interfaces/shlink-access-repository";
import { ISHLinkEndpointRepository } from "@/infrastructure/repositories/interfaces/shlink-endpoint-repository";
import { ISHLinkRepository } from "@/infrastructure/repositories/interfaces/shlink-repository";
import { mapModelToMiniDto } from "@/mappers/shlink-mapper";
import { addAccessTicketUseCase } from "@/usecases/access-tickets/add-access-ticket";
import { logSHLinkAccessUseCase } from "@/usecases/shlink-access/log-shlink-access";
import { getEndpointUseCase } from "@/usecases/shlink-endpoint/get-endpoint";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";
import { validateSHLinkUseCase } from "@/usecases/shlinks/validate-shlink";
import { NextResponse } from "next/server";

const repo = container.get<ISHLinkRepository>(SHLinkRepositoryToken);
const accessRepo = container.get<ISHLinkAccessRepository>(SHLinkAccessRepositoryToken);
const ticketRepo = container.get<IAccessTicketRepository>(AccessTicketRepositoryToken);
const shlinkRepo = container.get<ISHLinkEndpointRepository>(SHLinkEndpointRepositoryToken);

export async function POST(request: Request, { params }: { params: { id: string } }) {
    let requestDto: SHLinkRequestDto = await request.json();
    try{
        let shlink = await getSingleSHLinkUseCase({ repo}, { id: params.id, managementToken: requestDto.managementToken })
        if(!shlink) return NextResponse.json({message: NOT_FOUND}, { status: 404 });

        await validateSHLinkUseCase({shlink, passcode: requestDto.passcode});
        await logSHLinkAccessUseCase({repo: accessRepo}, new SHLinkAccessModel(shlink.getId(), new Date(), requestDto.recipient));
        const ticket = await addAccessTicketUseCase({repo: ticketRepo}, new AccessTicketModel(shlink.getId()));
        const endpoint = await getEndpointUseCase({repo: shlinkRepo}, {shlinkId: shlink.getId()});
        return NextResponse.json(mapModelToMiniDto(shlink, [endpoint], ticket.getId()), { status: 200 });
    }
    catch(error){
        return handleApiValidationError(error);
    }
}