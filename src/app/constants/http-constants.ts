import { env } from "process";

export const NOT_FOUND =
  'Is this not embarrasing. We could not find the requested resource.';
export const BAD_REQUEST = 'Bad Request';
export const SERVER_ERROR = 'Something went wrong';
export const PRECONDITION_FAILED =
  'Oops, we could not complete your request at this time.';
export const EXTERNAL_URL = env['EXTERNAL_URL'] || 'http://localhost:3000';
export const UNAUTHORIZED_REQUEST = 'Unauthorized request. Please verify access'
