/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';
import { GET } from './route'; // Import your API route handler

// Mock the NextRequest object (optional, but useful for more complex tests)
const mockRequest = new NextRequest('http://localhost/api', { method: 'GET' }); 

describe('API /api', () => {
  it('should return a health check response', async () => {
    const response = await GET(mockRequest); // Call the GET handler

    expect(response).toBeInstanceOf(NextResponse); // Ensure it's a NextResponse
    expect(response.status).toBe(200); // Check the status code

    const json = await response.json(); // Get the JSON data
    expect(json).toEqual({ message: 'API Health Check' }); // Verify the message
  });
});
