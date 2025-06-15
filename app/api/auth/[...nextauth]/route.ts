import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { prismaClient } from "@/app/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
        clientId: process.env.GOGOLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn(params) {
      console.log(params);
      if(!params.user.email) {
        return false
      }

      try {
        await prismaClient.user.create({
          data: {
             email: params.user.email,
             provider: "Google"
          }
        })
      } catch (_error) {

      }
      return true
    }
  }
})

export { handler as GET, handler as POST }