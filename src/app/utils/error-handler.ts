import { ModelValidationError } from '@/domain/models/base-model';
import { NextResponse } from 'next/server';
import { BAD_REQUEST, PRECONDITION_FAILED, SERVER_ERROR } from '../constants/http-constants';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';

export function handleApiValidationError(error: unknown) {
  console.error('API route error:', error);

  if (error instanceof ModelValidationError) {
    return NextResponse.json({error: BAD_REQUEST, detail: error}, { status: 422 })
  }
  else if(error instanceof ExternalDataFetchError) {
    return NextResponse.json({error: PRECONDITION_FAILED, detail: error.message}, { status: error.code })
  }
  else{
    return NextResponse.json({error: SERVER_ERROR, detail: error}, {status: 500});
  }
}