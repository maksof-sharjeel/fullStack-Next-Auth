import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/schema";
import { pages } from "next/dist/build/templates/app-page";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
// import { saltAndHashPassword } from "@/utils/password"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";
const prisma= new PrismaClient()
export const { handlers, signIn, signOut, auth } = NextAuth({
  session:{
    strategy: "jwt"
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({

      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      authorize: async (credentials) => {
        let user = null
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }
        // const user1= await prisma.user.create({
        //   data: {
        //     email: credentials!.email,
        //     password: credentials.password,
        //   }
        // })
        // const pwHash = saltAndHashPassword(credentials.password)
        // user = await getUserFromDb(credentials.email, pwHash)
        user = {
          id: '1',
          name: 'Aditya Singh',
          email: 'jojo@jojo.com',
          role: "admin"
        }
        if (!user) {
          throw new Error("Invalid credentials.")
        }
        return user
      },
    })
  ],
  adapter: PrismaAdapter(prisma),
  // callbacks: {
  //   authorized({ request: { nextUrl }, auth }) {
  //     const isLoggedIn = !!auth?.user;
  //     const { pathname } = nextUrl;
  //     // const role = auth?.user?.role || 'user';
  //     if (pathname.startsWith('/auth/signin') && isLoggedIn) {
  //       return Response.redirect(new URL('/', nextUrl));
  //     }
  //     // if (pathname.startsWith("/page2") && role !== "admin") {
  //     //   return Response.redirect(new URL('/', nextUrl));
  //     // }
  //     return !!auth;
  //   },
  // },
  pages: {
    signIn: 'auth/signin',
  }
})