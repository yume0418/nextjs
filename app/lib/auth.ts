import NextAuth from 'next-auth'
import { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions } from 'next-auth'

const prisma = new PrismaClient()

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && await compare(credentials.password, user.password)) {
          return { id: String(user.id), email: user.email, name: user.name };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = parseInt(token.id as string, 10);
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);