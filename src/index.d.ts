import { JWT } from 'next-auth/src/jwt';

declare module 'next-auth' {
  interface DefaultJWT {
    name: string;
    email: string;
    sub: string;
    iat: number;
    exp: number;
    jti: string;
  }

  interface Session {
    token: DefaultJWT | JWT;
    expires?: string;
  }
}
