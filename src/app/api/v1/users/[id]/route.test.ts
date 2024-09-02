/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';
import { GET } from "@/app/api/v1/users/[id]/route"; // Import your API route handler
import { getUserUseCase } from "@/usecases/users/get-user";
import { mapModelToDto } from "@/mappers/user-mapper";
import { NOT_FOUND } from "@/app/constants/http-constants";

jest.mock("@/usecases/users/get-user", () => ({
  getUserUseCase: jest.fn(),
}));

jest.mock("@/mappers/user-mapper", () => ({
  mapModelToDto: jest.fn(),
}));

describe("GET /api/users/[id]", () => {
  const mockUser = {
    getId: jest.fn().mockReturnValue("user-id"),
    getUserId: jest.fn().mockReturnValue("user-user-id"),
    getPatientId: jest.fn().mockReturnValue("user-patient-id"),
  };

  const mockDto = {
    id: "user-id",
    userId: "user-user-id",
    patientId: "user-patient-id",
  };

  it("should return user DTO and status 200 when user is found", async () => {
    // Mock implementation
    (getUserUseCase as jest.Mock).mockResolvedValue(mockUser);
    (mapModelToDto as jest.Mock).mockReturnValue(mockDto);

    const mockRequest = new NextRequest('http://localhost/api/users/user-id', { method: 'GET' });
    const response = await GET(mockRequest, { params: { id: 'user-id' } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toEqual(mockDto);
  });

  it("should return NOT_FOUND message and status 404 when user is not found", async () => {
    (getUserUseCase as jest.Mock).mockResolvedValue(null);

    const mockRequest = new NextRequest('http://localhost/api/users/non-existing-id', { method: 'GET' });
    const response = await GET(mockRequest, { params: { id: 'non-existing-id' } });

    expect(response).toBeInstanceOf(NextResponse);
    expect(response.status).toBe(404);

    const json = await response.json();
    expect(json).toEqual({ message: NOT_FOUND });
  });
});