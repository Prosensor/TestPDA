import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json({ message: "Email et nouveau mot de passe requis" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: "Mot de passe réinitialisé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error)
    return NextResponse.json({ message: "Erreur lors de la réinitialisation du mot de passe" }, { status: 500 })
  }
}
