import { ModelValidationError } from '@/domain/models/base-model';
import { NextResponse } from 'next/server';
import { BAD_REQUEST, SERVER_ERROR } from '../constants/http-constants';

export function handleApiValidationError(error: unknown) {
  console.error('API route error:', error);

  if (error instanceof ModelValidationError) {
    return NextResponse.json(
      { error: BAD_REQUEST, detail: error },
      { status: 422 },
    );
  } else {
    return NextResponse.json(
      { error: SERVER_ERROR, detail: error },
      { status: 500 },
    );
  }
}
