/**
 * @jest-environment node
 */

import { NOT_FOUND } from "@/app/constants/http-constants";
import { handleApiValidationError } from "@/app/utils/error-handler";
import { mapModelToDto } from "@/mappers/shlink-access-mapper";
import { getSHLinkAccessesUseCase } from "@/usecases/shlink-access/get-shlink-accesses";
import { getSingleSHLinkUseCase } from "@/usecases/shlinks/get-single-shlink";

import { POST } from "./route";

jest.mock("@/container", () => ({
  container: {
    get: jest.fn(),
  },
  SHLinkAccessRepositoryToken: Symbol('SHLinkAccessRepositoryToken'),
  SHLinkRepositoryToken: Symbol('SHLinkRepositoryToken'),
}));

jest.mock("@/usecases/shlink-access/get-shlink-accesses", () => ({
  getSHLinkAccessesUseCase: jest.fn(),
}));

jest.mock("@/usecases/shlinks/get-single-shlink", () => ({
  getSingleSHLinkUseCase: jest.fn(),
}));

jest.mock("@/mappers/shlink-access-mapper", () => ({
  mapModelToDto: jest.fn(),
}));

jest.mock("@/app/utils/error-handler", () => ({
  handleApiValidationError: jest.fn(),
}));

describe("POST function", () => {
  let mockGetSingleSHLinkUseCase: jest.Mock;
  let mockGetSHLinkAccessesUseCase: jest.Mock;
  let mockMapModelToDto: jest.Mock;
  let mockHandleApiValidationError: jest.Mock;

  beforeEach(() => {
    mockGetSingleSHLinkUseCase = getSingleSHLinkUseCase as jest.Mock;
    mockGetSHLinkAccessesUseCase = getSHLinkAccessesUseCase as jest.Mock;
    mockMapModelToDto = mapModelToDto as jest.Mock;
    mockHandleApiValidationError = handleApiValidationError as jest.Mock;
  });

  it("should return 404 if shlink is not found", async () => {
    // Arrange
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ managementToken: "token" }),
    });
    const params = { id: "non-existent-id" };

    mockGetSingleSHLinkUseCase.mockResolvedValue(null);

    // Act
    const response = await POST(request, params);

    // Assert
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ message: NOT_FOUND });
  });

  it("should return 200 with access data if shlink is found", async () => {
    // Arrange
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ managementToken: "token" }),
    });
    const params = { id: "existent-id" };
    const shlink = { getId: jest.fn().mockReturnValue("shlink-id") };
    const accesses = [{ id: "access-id-1" }, { id: "access-id-2" }];
    const dto = { id: "access-id-1" };

    mockGetSingleSHLinkUseCase.mockResolvedValue(shlink);
    mockGetSHLinkAccessesUseCase.mockResolvedValue(accesses);
    mockMapModelToDto.mockImplementation((model) => ({ id: model.id }));

    // Act
    const response = await POST(request, params);

    // Assert
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(accesses.map(x => ({ id: x.id })));
  });

  it("should handle errors and call handleApiValidationError", async () => {
    // Arrange
    const request = new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ managementToken: "token" }),
    });
    const params = { id: "some-id" };

    mockGetSingleSHLinkUseCase.mockRejectedValue(new Error("Test error"));

    // Act
    await POST(request, params);

    // Assert
    expect(mockHandleApiValidationError).toHaveBeenCalled();
  });
});
