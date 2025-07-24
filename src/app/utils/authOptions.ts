import { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist Auth0 user ID (sub)
      if (account && profile) {
        token.sub = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Inject Auth0 ID into session
        session.user.id = token.sub;

      }
      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
