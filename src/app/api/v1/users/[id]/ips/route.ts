import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import prisma from "@/infrastructure/clients/prisma";
import { ServerConfigPrismaRepository } from "@/infrastructure/repositories/prisma/server-config-repository";
import { UserPrismaRepository } from "@/infrastructure/repositories/prisma/user-repository";
import { getPatientDataUseCase } from "@/usecases/patient/get-patient-data";
import { getUserUseCase } from "@/usecases/users/get-user";
import { NextResponse } from "next/server";

const userRepo = new UserPrismaRepository(prisma);
const serverConfigRepo = new ServerConfigPrismaRepository(prisma);


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserUseCase({repo: userRepo}, {userId: params.id});

  if(!user) return NextResponse.json({message: NOT_FOUND}, { status: 404});

  try{
    const result = await getPatientDataUseCase({repo: serverConfigRepo}, {user});

    return NextResponse.json(result, {status: 200});
  }
  catch(error){
    return handleApiValidationError(error);
  }
}
