import NextAuth, { NextAuthConfig, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

interface CustomUser extends User {
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
  }
}

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !(await compare(credentials.password as string, user.password))) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
        if (user) {
          token.role = (user as CustomUser).role;
        }
        return token;
      }
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
