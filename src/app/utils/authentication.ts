import { getToken } from "next-auth/jwt";

import { UNAUTHORIZED_REQUEST } from "../constants/http-constants";

export interface UserProfile{
    name: string;
    id: string;
    email: string;
}

export const getUserProfile = async(req: Request): Promise<UserProfile> => {
    const token = await getToken({req: req as any});

    return { name: token.name, id: token.sub, email: token.email };
}

export const validateUser = async(req: Request, userId: string) => {
  const user = await getUserProfile(req);

  if(user.id !== userId){
    throw new AuthenticationError();
  }

  return true;
}

export class AuthenticationError extends Error {
  constructor(message: string = UNAUTHORIZED_REQUEST, public code: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
  }
}