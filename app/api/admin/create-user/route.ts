import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Vérifier si l'utilisateur est authentifié et est un administrateur
    const session = await auth()

    if (!session || session.user?.email !== "pharmaciemozart@gmail.com") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const { name, email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Supprimer le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ message: "Utilisateur créé avec succès", user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error)
    return NextResponse.json({ message: "Une erreur est survenue lors de la création du compte" }, { status: 500 })
  }
}
