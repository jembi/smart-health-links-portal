/**
 * @jest-environment node
 */
import { NextResponse } from "next/server";
import { POST } from "./route";
import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, SHLinkAccessRepositoryToken, SHLinkRepositoryToken } from "@/container";
import { SHLinkAccessModel } from "@/domain/models/shlink-access";
import { mapModelToDto } from "@/mappers/shlink-mapper";
import { logSHLinkAccessUseCase } from "@/usecases/shlink-access/log-shlink-access";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";

// Mock dependencies
jest.mock("@/usecases/shlinks/get-single-shlink", () => ({
  getSingleSHLinkUseCase: jest.fn(),
}));

jest.mock("@/usecases/shlink-access/log-shlink-access", () => ({
  logSHLinkAccessUseCase: jest.fn(),
}));

jest.mock("@/mappers/shlink-mapper", () => ({
  mapModelToDto: jest.fn(),
}));

jest.mock("@/app/utils/error-handler", () => ({
  handleApiValidationError: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('POST handler', () => {
  const mockResponseJson = NextResponse.json as jest.Mock;
  const mockHandleApiValidationError = handleApiValidationError as jest.Mock;
  const mockGetSingleSHLinkUseCase = getSingleSHLinkUseCase as jest.Mock;
  const mockLogSHLinkAccess = logSHLinkAccessUseCase as jest.Mock;
  const mockMapModelToDto = mapModelToDto as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if the SHLink is not found', async () => {
    mockGetSingleSHLinkUseCase.mockResolvedValue(null);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await POST(request, { params });

    expect(mockGetSingleSHLinkUseCase).toHaveBeenCalledWith({ repo: container.get(SHLinkRepositoryToken) }, { id: '123' });
    expect(mockLogSHLinkAccess).not.toHaveBeenCalled();
    expect(mockMapModelToDto).not.toHaveBeenCalled();
    expect(mockResponseJson).toHaveBeenCalledWith({ message: NOT_FOUND }, { status: 404 });
  });

  it('should log SHLink access and return the SHLink DTO on success', async () => {
    const shlink = {
      getId: jest.fn().mockReturnValue('123'),
      // add other methods if needed
    };
    mockGetSingleSHLinkUseCase.mockResolvedValue(shlink);
    mockMapModelToDto.mockReturnValue({ id: '123', someOtherProperty: 'value' });

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await POST(request, { params });

    expect(mockGetSingleSHLinkUseCase).toHaveBeenCalledWith({ repo: container.get(SHLinkRepositoryToken) }, { id: '123' });
    expect(mockLogSHLinkAccess).toHaveBeenCalled();
    expect(mockMapModelToDto).toHaveBeenCalledWith(shlink);
    expect(mockResponseJson).toHaveBeenCalledWith({ id: '123', someOtherProperty: 'value' }, { status: 200 });
  });

  it('should handle errors and call handleApiValidationError', async () => {
    const error = new Error('Something went wrong');
    mockGetSingleSHLinkUseCase.mockRejectedValue(error);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await POST(request, { params });

    expect(mockHandleApiValidationError).toHaveBeenCalledWith(error);
    expect(mockResponseJson).not.toHaveBeenCalled();
  });
});
