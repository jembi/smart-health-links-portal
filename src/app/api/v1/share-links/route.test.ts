/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from "next/server";

import { getUserProfile, validateUser } from "@/app/utils/authentication";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { CreateSHLinkDto, SHLinkDto } from "@/domain/dtos/shlink";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkEntity } from "@/entities/shlink";
import { SHLinkPrismaRepository } from "@/infrastructure/repositories/prisma/shlink-repository";
import { 
    mapDtoToModel,
    mapEntityToModel,
    mapModelToDto,
    mapModelToMiniDto
} from "@/mappers/shlink-mapper";
import { addShlinkUseCase } from "@/usecases/shlinks/add-shlink";
import { getSHLinkUseCase } from "@/usecases/shlinks/get-shlink";

import { POST, GET } from "./route";

// Mocks
jest.mock("@/app/utils/error-handler");
jest.mock("@/app/utils/authentication");
jest.mock("@/mappers/shlink-mapper");
jest.mock("@/infrastructure/repositories/prisma/shlink-repository");
jest.mock("@/infrastructure/clients/prisma");
jest.mock('@/usecases/shlinks/add-shlink', () => ({
    addShlinkUseCase: jest.fn(),
}));
jest.mock('@/usecases/shlinks/get-shlink', () => ({
    getSHLinkUseCase: jest.fn(),
}));
jest.mock('@/mappers/shlink-mapper', () => ({
    mapDtoToModel: jest.fn(),
    mapEntityToModel: jest.fn(),
    mapModelToDto: jest.fn(),
    mapModelToMiniDto: jest.fn(),
}));
jest.mock('@/app/utils/error-handler', () => ({
    handleApiValidationError: jest.fn(),
}));
jest.mock('@/app/constants/http-constants', () => ({
    NOT_FOUND: 'Not Found',
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
            (validateUser as jest.Mock).mockResolvedValue({id: '1234567890'});
            (mapDtoToModel as jest.Mock).mockReturnValue(mockModel);
            (addShlinkUseCase as jest.Mock).mockResolvedValue(mockModel);
            (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

            const request = new NextRequest('http://localhost/api/share-link', { method: 'POST', body: JSON.stringify(mockDto) });

            const response = await POST(request);

            expect(validateUser).toHaveBeenCalledWith(request, mockDto.userId);
            expect(response.status).toBe(200);
            expect(response).toBeInstanceOf(NextResponse);

            const responseBody = await response.json();
            responseBody.configExp = new Date(responseBody.configExp)
            expect(responseBody).toEqual(mockDto);
        });

        it("should handle validation errors", async () => {
            const error = new Error('Validation error');
            (validateUser as jest.Mock).mockResolvedValue({id: '1234567890'});
            (addShlinkUseCase as jest.Mock).mockRejectedValue(error);
            (handleApiValidationError as jest.Mock).mockReturnValue(NextResponse.json({ message: 'Validation error' }, { status: 400 }));

            const request = new NextRequest('http://localhost/api/share-link', { method: 'POST', body: JSON.stringify(mockDto) });

            const response = await POST(request);

            expect(validateUser).toHaveBeenCalledWith(request, mockDto.userId);
            expect(handleApiValidationError).toHaveBeenCalledWith(error);
            expect(response).toBeInstanceOf(NextResponse);
            expect(response.status).toBe(400);

            const json = await response.json();
            expect(json).toEqual({ message: 'Validation error' });
        });
    });

    describe("GET /shlink", () => {
        it("should handle successful GET request with valid user_id", async () => {
            (getUserProfile as jest.Mock).mockResolvedValue({id: '1234567890'});
            (getSHLinkUseCase as jest.Mock).mockResolvedValue([mockEntity]);
            (mapEntityToModel as jest.Mock).mockReturnValue(mockModel);
            (mapModelToMiniDto as jest.Mock).mockReturnValue({
                id: mockModel.getId(),
                name: mockModel.getName(),
                // Map other properties as necessary
            });

            const request = new NextRequest('http://localhost/api/share-link', { method: 'GET' });

            const response = await GET(request);

            expect(getUserProfile).toHaveBeenCalledWith(request);
            expect(response.status).toBe(200);
            expect(response).toBeInstanceOf(NextResponse);

            const responseBody = await response.json();
            expect(responseBody).toEqual([{
                id: mockModel.getId(),
                name: mockModel.getName(),
                // Match other properties as necessary
            }]);
        });

        it("should handle errors during GET request", async () => {
            const error = new Error('Database error');
            (getUserProfile as jest.Mock).mockResolvedValue({id: '1234567890'});
            (getSHLinkUseCase as jest.Mock).mockRejectedValue(error);
            (handleApiValidationError as jest.Mock).mockReturnValue(NextResponse.json({ message: 'Database error' }, { status: 500 }));

            const request = new NextRequest('http://localhost/api/share-link', { method: 'GET' });

            const response = await GET(request);

            expect(getUserProfile).toHaveBeenCalledWith(request);
            expect(handleApiValidationError).toHaveBeenCalledWith(error);
            expect(response).toBeInstanceOf(NextResponse);
            expect(response.status).toBe(500);

            const json = await response.json();
            expect(json).toEqual({ message: 'Database error' });
        });
    });
});
