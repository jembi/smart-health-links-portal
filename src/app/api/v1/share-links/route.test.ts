
/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from "next/server";

import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { mapDtoToModel, mapModelToDto } from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";

import { POST, GET } from "./route";

// Mocks
jest.mock("@/app/utils/error-handler");
jest.mock("@/mappers/shlink-mapper");
jest.mock("@/infrastructure/repositories/prisma/shlink-repository");
jest.mock("@/infrastructure/clients/prisma");
jest.mock('@/usecases/shlinks/add-shlink', () => ({
    addShlinkUseCase: jest.fn(),
  }));
  
  jest.mock('@/mappers/shlink-mapper', () => ({
    mapDtoToModel: jest.fn(),
    mapModelToDto: jest.fn(),
  }));
  
  jest.mock('@/app/utils/error-handler', () => ({
    handleApiValidationError: jest.fn(),
  }));

// Constants
const dataDto = {
    userId: "1234567890",
    name: 'name',
    passcodeFailuresRemaining: 3,
    active: true,
    managementToken: "token-xyz1234",
    configPasscode: "passcode-abcde",
    configExp: new Date("2024-01-01T00:00:00Z"),
};

const mockDto: CreateSHLinkDto = {
    userId: "1234567890",
    name: 'name',
    configPasscode: "passcode-abcde",
    configExp: new Date("2024-01-01T00:00:00Z"),
};

const mockModel = new SHLinkModel(
    dataDto.userId,
    dataDto.name,
    dataDto.passcodeFailuresRemaining,
    dataDto.active,
    dataDto.managementToken,
    dataDto.configPasscode,
    dataDto.configExp,
    "1"
);

const mockEntity: SHLinkEntity = {
    id: "1",
    name: dataDto.name,
    user_id: dataDto.userId,
    passcode_failures_remaining: dataDto.passcodeFailuresRemaining,
    active: dataDto.active,
    management_token: dataDto.managementToken,
    config_passcode: dataDto.configPasscode,
    config_exp: dataDto.configExp,
};

// Mocks for repository methods
const mockInsert = jest.fn().mockResolvedValue(mockEntity);
const mockFindMany = jest.fn().mockResolvedValue([mockEntity]);

SHLinkPrismaRepository.prototype.insert = mockInsert;
SHLinkPrismaRepository.prototype.findMany = mockFindMany;

describe("API Route Handlers", () => {
    describe("POST /shlink", () => {
        it("should handle successful POST request", async () => {
            (mapDtoToModel as jest.Mock).mockReturnValue(mockModel);
            (addShlinkUseCase as jest.Mock).mockResolvedValue(mockModel);
            (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

            const request = new NextRequest('http://localhost/api/share-link', { method: 'POST', body: JSON.stringify(mockDto) });

            const response = await POST(request);

            expect(response.status).toBe(200);
            expect(response).toBeInstanceOf(NextResponse);

            const responseBody = await response.json();
            responseBody.configExp = new Date(responseBody.configExp)
            expect(responseBody).toEqual(mockDto);
        });

        it("should handle validation errors", async () => {
            const error = new Error('Validation error');
            (addShlinkUseCase as jest.Mock).mockRejectedValue(error);
            (handleApiValidationError as jest.Mock).mockReturnValue(NextResponse.json({ message: 'Validation error' }, { status: 400 }));
            const request = new NextRequest('http://localhost/api/share-link', { method: 'POST', body: JSON.stringify(mockDto) });

            const response = await POST(request);

            expect(handleApiValidationError).toHaveBeenCalledWith(error);
            expect(response).toBeInstanceOf(NextResponse);
            expect(response.status).toBe(400);

            const json = await response.json();
            expect(json).toEqual({ message: 'Validation error' });
        });
    });

    describe("GET /shlink", () => {
        

        it("should handle errors", async () => {
            const request = new NextRequest('http://localhost/api/share-link?user_id=0', { method: 'GET'});

            const response = await GET(request);

            expect(handleApiValidationError).toHaveBeenCalled();
            expect(response).toEqual(await handleApiValidationError(new Error("Database error")));
        });
    });
});
