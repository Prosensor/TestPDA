import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// Créer une instance Prisma pour les opérations d'authentification
const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Identifiants manquants")
          return null
        }

        try {
          // Utiliser des types explicites pour éviter les erreurs de typage
          const email: string = credentials.email
          const password: string = credentials.password

          console.log(`Tentative de connexion pour: ${email}`)

          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          })

          if (!user || !user.password) {
            console.log("Utilisateur non trouvé ou mot de passe non défini")
            return null
          }

          // Utiliser des types explicites pour bcrypt.compare
          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            console.log("Mot de passe invalide")
            return null
          }

          console.log("Authentification réussie")
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Erreur d'authentification:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      // Ajouter le rôle admin basé sur l'email
      if (session.user?.email === "pharmaciemozart@gmail.com") {
        session.user.isAdmin = true
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  debug: process.env.NODE_ENV === "development",
})
