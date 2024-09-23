import { NextResponse } from 'next/server';

import { ModelValidationError } from '@/domain/models/base-model';
import { LogHandler } from '@/lib/logger';
import { ExternalDataFetchError } from '@/services/hapi-fhir.service';
import { SHLinkValidationError } from '@/usecases/shlinks/validate-shlink';

import { AuthenticationError } from './authentication';
import { ParameterValidationError } from './validate';
import {
  BAD_REQUEST,
  PRECONDITION_FAILED,
  SERVER_ERROR,
} from '../constants/http-constants';

export function handleApiValidationError(error: Error, logger:LogHandler) {
  logger.error(error);

  if (error instanceof ModelValidationError) {
    return NextResponse.json(
      { error: BAD_REQUEST, detail: error },
      { status: 422 },
    );
  }else if (error instanceof ParameterValidationError) {
    return NextResponse.json(
      {error: BAD_REQUEST, detail:error},
      {status: 422}
    )
  } else if (error instanceof ExternalDataFetchError) {
    return NextResponse.json(
      { error: PRECONDITION_FAILED, detail: error.message },
      { status: error.code },
    );
  } else if (error instanceof SHLinkValidationError) {
    return NextResponse.json(
      { error: error.name, detail: error.message },
      { status: error.code },
    );
  } else if (error instanceof AuthenticationError) {
    return NextResponse.json(
      { error: error.name, detail: error.message },
      { status: error.code },
    );
  } else {
    return NextResponse.json(
      { error: SERVER_ERROR, detail: error },
      { status: 500 },
    );
  }
}
