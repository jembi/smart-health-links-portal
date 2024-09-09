/**
 * @jest-environment node
 */
import { NextResponse } from "next/server";

import { NOT_FOUND, UNAUTHORIZED_REQUEST } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { container, SHLinkRepositoryToken, SHLinkAccessRepositoryToken, AccessTicketRepositoryToken, SHLinkEndpointRepositoryToken } from "@/container";
import { AccessTicketModel } from "@/domain/models/access-ticket";
import { SHLinkModel } from "@/domain/models/shlink";
import { SHLinkAccessModel } from "@/domain/models/shlink-access";
import { SHLinkEndpointModel } from "@/domain/models/shlink-endpoint";
import { mapModelToMiniDto, mapModelToDto } from "@/mappers/shlink-mapper";
import { addAccessTicketUseCase } from "@/usecases/access-tickets/add-access-ticket";
import { deleteAccessTicketUseCase } from "@/usecases/access-tickets/delete-access-ticket";
import { logSHLinkAccessUseCase } from "@/usecases/shlink-access/log-shlink-access";
import { getEndpointUseCase } from "@/usecases/shlink-endpoint/get-endpoint";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";
import { updateSingleSHLinkUseCase } from "@/usecases/shlinks/update-single-shlink";
import { validateSHLinkUseCase } from "@/usecases/shlinks/validate-shlink";

import { POST, PUT } from "./route";

// Mock dependencies
jest.mock("@/usecases/shlinks/get-single-shlink", () => ({
  getSingleSHLinkUseCase: jest.fn(),
}));

jest.mock("@/usecases/shlink-access/log-shlink-access", () => ({
  logSHLinkAccessUseCase: jest.fn(),
}));

jest.mock("@/usecases/access-tickets/add-access-ticket", () => ({
  addAccessTicketUseCase: jest.fn(),
}));

jest.mock("@/usecases/access-tickets/delete-access-ticket", () => ({
  deleteAccessTicketUseCase: jest.fn(),
}));

jest.mock("@/usecases/shlink-endpoint/get-endpoint", () => ({
  getEndpointUseCase: jest.fn(),
}));

jest.mock("@/usecases/shlinks/validate-shlink", () => ({
  validateSHLinkUseCase: jest.fn(),
}));

jest.mock("@/usecases/shlinks/update-single-shlink", () => ({
  updateSingleSHLinkUseCase: jest.fn(),
}));

jest.mock("@/mappers/shlink-mapper", () => ({
  mapModelToMiniDto: jest.fn(),
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
  const mockAddAccessTicketUseCase = addAccessTicketUseCase as jest.Mock;
  const mockDeleteAccessTicketUseCase = deleteAccessTicketUseCase as jest.Mock;
  const mockGetEndpointUseCase = getEndpointUseCase as jest.Mock;
  const mockValidateSHLinkUseCase = validateSHLinkUseCase as jest.Mock;
  const mockMapModelToMiniDto = mapModelToMiniDto as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if the SHLink is not found', async () => {
    mockGetSingleSHLinkUseCase.mockResolvedValue(null);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'test@example.com', managementToken: 'token', passcode: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await POST(request, { params });

    expect(mockGetSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: container.get(SHLinkRepositoryToken) },
      { id: '123', managementToken: 'token' }
    );
    expect(mockLogSHLinkAccess).not.toHaveBeenCalled();
    expect(mockAddAccessTicketUseCase).not.toHaveBeenCalled();
    expect(mockGetEndpointUseCase).not.toHaveBeenCalled();
    expect(mockMapModelToMiniDto).not.toHaveBeenCalled();
    expect(mockResponseJson).toHaveBeenCalledWith(
      { message: NOT_FOUND },
      { status: 404 }
    );
  });

  it('should log SHLink access, add access ticket, retrieve endpoint, and return the DTO on success', async () => {
    const shlink = {
      getId: jest.fn().mockReturnValue('123'),
      getPasscodeFailuresRemaining: jest.fn().mockReturnValue(3),
    } as unknown as SHLinkModel;

    const ticket = {
      getId: jest.fn().mockReturnValue('ticket-id')
    } as unknown as AccessTicketModel;

    const endpoint = {
      getId: jest.fn().mockReturnValue('endpoint-id')
    } as unknown as SHLinkEndpointModel;

    mockGetSingleSHLinkUseCase.mockResolvedValue(shlink);
    mockValidateSHLinkUseCase.mockResolvedValue(true);
    mockGetEndpointUseCase.mockResolvedValue(endpoint);
    mockAddAccessTicketUseCase.mockResolvedValue(ticket);
    mockMapModelToMiniDto.mockReturnValue({
      id: '123',
      managementToken: 'token',
      files: [
        {
          location: 'http://external.url/api/v1/share-links/123/endpoints/endpoint-id?ticket=ticket-id',
          contentType: 'application/smart-api-access',
          embedded: null
        }
      ]
    });

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'test@example.com', managementToken: 'token', passcode: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await POST(request, { params });

    expect(mockGetSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: container.get(SHLinkRepositoryToken) },
      { id: '123', managementToken: 'token' }
    );
    expect(mockValidateSHLinkUseCase).toHaveBeenCalledWith(
      { shlink, passcode: '1234' }
    );
    expect(mockLogSHLinkAccess).toHaveBeenCalledWith(
      { repo: container.get(SHLinkAccessRepositoryToken) },
      expect.any(SHLinkAccessModel)
    );
    expect(mockAddAccessTicketUseCase).toHaveBeenCalledWith(
      { repo: container.get(AccessTicketRepositoryToken) },
      expect.any(AccessTicketModel)
    );
    expect(mockGetEndpointUseCase).toHaveBeenCalledWith(
      { repo: container.get(SHLinkEndpointRepositoryToken) },
      { shlinkId: '123' }
    );
    expect(mockMapModelToMiniDto).toHaveBeenCalledWith(shlink, [endpoint], 'ticket-id');
    expect(mockResponseJson).toHaveBeenCalledWith(
      {
        id: '123',
        managementToken: 'token',
        files: [
          {
            location: 'http://external.url/api/v1/share-links/123/endpoints/endpoint-id?ticket=ticket-id',
            contentType: 'application/smart-api-access',
            embedded: null
          }
        ]
      },
      { status: 200 }
    );
  });

  it('should handle errors and call handleApiValidationError', async () => {
    const error = new Error('Something went wrong');
    mockGetSingleSHLinkUseCase.mockRejectedValue(error);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'test@example.com', managementToken: 'token', passcode: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await POST(request, { params });

    expect(mockHandleApiValidationError).toHaveBeenCalledWith(error);
    expect(mockResponseJson).not.toHaveBeenCalled();
  });
});

describe('PUT handler', () => {
  const mockResponseJson = NextResponse.json as jest.Mock;
  const mockHandleApiValidationError = handleApiValidationError as jest.Mock;
  const mockGetSingleSHLinkUseCase = getSingleSHLinkUseCase as jest.Mock;
  const mockUpdateSingleSHLinkUseCase = updateSingleSHLinkUseCase as jest.Mock;
  const mockMapModelToDto = mapModelToDto as jest.Mock;
  const mockValidateSHLinkUseCase = jest.fn(); // Explicitly mock here
  let context: any;

  beforeEach(() => {
    jest.clearAllMocks();
    context = {
      validator: mockValidateSHLinkUseCase, // Set validator to mock function
    };
  });

  it('should return 404 if the SHLink is not found', async () => {
    mockGetSingleSHLinkUseCase.mockResolvedValue(null);
    context.validator.mockResolvedValue(true);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'PUT',
      body: JSON.stringify({ managementToken: 'token', passcode: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await PUT(request, { params });

    expect(mockGetSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: container.get(SHLinkRepositoryToken) },
      { id: '123', managementToken: 'token' }
    );
    expect(mockUpdateSingleSHLinkUseCase).not.toHaveBeenCalled();
    expect(mockMapModelToDto).not.toHaveBeenCalled();
    expect(mockResponseJson).toHaveBeenCalledWith(
      { message: NOT_FOUND },
      { status: 404 }
    );
  });

  it('should update the SHLink and return the DTO on success', async () => {
    const shlink = {
      getId: jest.fn().mockReturnValue('123'),
      getManagementToken: jest.fn().mockReturnValue('token'),
      getActive: jest.fn().mockReturnValue(true),
    } as unknown as SHLinkModel;

    const updatedSHLink = {
      ...shlink,
      getId: jest.fn().mockReturnValue('123'),
      getManagementToken: jest.fn().mockReturnValue('token'),
      getActive: jest.fn().mockReturnValue(true),
    } as unknown as SHLinkModel;

    const expectedDto = {
      id: '123',
      managementToken: 'token',
      files: []
    };

    // Mock behavior
    mockGetSingleSHLinkUseCase.mockResolvedValue(shlink);
    mockUpdateSingleSHLinkUseCase.mockResolvedValue(shlink);
    mockMapModelToDto.mockReturnValue(expectedDto);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'PUT',
      body: JSON.stringify({ managementToken: 'token', passcode: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    // Call the PUT handler
    const response = await PUT(request, { params });

    // Verify calls
    expect(mockGetSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: container.get(SHLinkRepositoryToken) },
      { id: '123', managementToken: 'token' }
    );

    expect(mockUpdateSingleSHLinkUseCase).toHaveBeenCalledWith(
      { repo: container.get(SHLinkRepositoryToken), validator: expect.any(Function) }, // Adjusted to match actual arguments
      { id: '123', passcode: '1234' }
    );

    expect(mockMapModelToDto).toHaveBeenCalledWith(shlink);
    expect(mockResponseJson).toHaveBeenCalledWith(
      expectedDto,
      { status: 200 }
    );
  }); 

  it('should handle errors and call handleApiValidationError', async () => {
    const error = new Error('Something went wrong');
    mockGetSingleSHLinkUseCase.mockRejectedValue(error);
    context.validator.mockResolvedValue(true);

    const request = new Request('http://localhost/api/shlink/123', {
      method: 'PUT',
      body: JSON.stringify({ managementToken: 'token', passcode: '1234' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const params = { id: '123' };

    const response = await PUT(request, { params });

    expect(mockHandleApiValidationError).toHaveBeenCalledWith(error);
    expect(mockResponseJson).not.toHaveBeenCalled();
  });
});

