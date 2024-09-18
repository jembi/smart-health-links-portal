import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
    };
    token?: {
      name?: string;
      email?: string;
      sub?: string;
    };
    expires?: string;
    account?: {
      access_token?: string;
    };
  }
}
