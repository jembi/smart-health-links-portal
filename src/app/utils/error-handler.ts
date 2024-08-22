import { ModelValidationError } from '@/domain/models/base-model';
import { NextResponse } from 'next/server';

export function handleApiValidationError(error: unknown) {
  console.error('API route error:', error);

  if (error instanceof ModelValidationError) {
    return NextResponse.json({error: 'Bad Request', detail: error}, { status: 422 })
  }
}