import { NextRequest } from 'next/server';
import { Account, Session } from 'next-auth';
import { getToken } from 'next-auth/jwt';

import { UNAUTHORIZED_REQUEST } from '../constants/http-constants';

export interface UserProfile {
  name: string;
  id: string;
  email: string;
  roles?: string[];
}

interface TokenPayload {
  user: {
    name: string;
    id: string;
    email: string;
  };
  roles?: string[];
}

export const getRoles = (token: Session) => {
  const account = token.account as Account;

  if (account?.access_token) {
    const base64Payload = account.access_token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
    const innerToken = JSON.parse(payload);
    return innerToken.resource_access?.nextjs?.roles || [];
  }
  return [] as string[];
};

export const getUserProfile = async (req: Request): Promise<UserProfile> => {
  const token = (await getToken({
    req: req as NextRequest,
  })) as unknown as TokenPayload;

  const roles = getRoles(token);

  const {
    user: { name, id, email },
  } = token;
  return { name, id, email, roles };
};

export const validateUserRoles = async (req: Request, role: string) => {
  const user = await getUserProfile(req);
  if (!user.roles?.find((x) => x === role)) {
    throw new AuthenticationError(
      `User not member of the following role or group: "${role}".`,
    );
  }

  return true;
};

export const validateUser = async (req: Request, userId: string) => {
  const user = await getUserProfile(req);

  if (user.id !== userId) {
    throw new AuthenticationError();
  }

  return true;
};

export class AuthenticationError extends Error {
  constructor(
    message: string = UNAUTHORIZED_REQUEST,
    public code: number = 401,
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
