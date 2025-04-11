import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Vérifier si l'utilisateur existe
    const email = "pharmaciemozart@gmail.com"
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true, // Inclure le mot de passe pour le débogage
      },
    })

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé", email }, { status: 404 })
    }

    // Masquer partiellement le mot de passe pour la sécurité
    const maskedPassword = user.password ? `${user.password.substring(0, 10)}...` : null

    return NextResponse.json(
      {
        message: "Utilisateur trouvé",
        user: {
          ...user,
          password: maskedPassword,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur:", error)
    return NextResponse.json({ message: "Erreur lors de la vérification de l'utilisateur" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé", success: false }, { status: 200 })
    }

    // Vérifier le mot de passe
    const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false

    return NextResponse.json(
      {
        message: isPasswordValid ? "Mot de passe valide" : "Mot de passe invalide",
        success: isPasswordValid,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la vérification des identifiants:", error)
    return NextResponse.json(
      { message: "Erreur lors de la vérification des identifiants", success: false },
      { status: 500 },
    )
  }
}
