import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const { nom, adresse, telephone } = await request.json()

    // Validation
    if (!nom) {
      return NextResponse.json({ message: "Le nom de l'établissement est requis" }, { status: 400 })
    }

    // Créer l'établissement
    const etablissement = await prisma.etablissement.create({
      data: {
        nom,
        adresse,
        telephone,
      },
    })

    return NextResponse.json({ message: "Établissement créé avec succès", etablissement }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'établissement:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de l'établissement" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const etablissements = await prisma.etablissement.findMany({
      orderBy: {
        nom: "asc",
      },
      include: {
        _count: {
          select: {
            residents: true,
          },
        },
      },
    })

    return NextResponse.json({ etablissements }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des établissements:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des établissements" },
      { status: 500 },
    )
  }
}
