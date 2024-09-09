import NextAuth from 'next-auth';

import { authOptions } from '../authOptions';

<<<<<<< HEAD
=======
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
          scope: "openid email profile",
        },
        url: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/shlp/protocol/openid-connect/auth`,
      },
      token: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/shlp/protocol/openid-connect/token`,
      userinfo: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/shlp/protocol/openid-connect/userinfo`,
    }),
  ],
  callbacks: {
    session: async({session, token, user}) => {
      return {...session, token, user};
    }
  }
};
>>>>>>> 1276d6f (Added middleware to handle api authentication. Updated unit tests. Updated jest config file.)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
