import { AuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      jwks_endpoint: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/shlp/protocol/openid-connect/certs`,
      wellKnown: undefined,
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
        url: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/shlp/protocol/openid-connect/auth`,
      },
      token: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/shlp/protocol/openid-connect/token`,
      userinfo: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/shlp/protocol/openid-connect/userinfo`,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      return { ...session, user: token.user };
    },
  },
};
