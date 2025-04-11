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

    const { nom, description } = await request.json()

    // Validation
    if (!nom) {
      return NextResponse.json({ message: "Le nom du médicament est requis" }, { status: 400 })
    }

    // Créer le médicament
    const medicament = await prisma.medicament.create({
      data: {
        nom,
        description,
      },
    })

    return NextResponse.json({ message: "Médicament créé avec succès", medicament }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du médicament:", error)
    return NextResponse.json({ message: "Une erreur est survenue lors de la création du médicament" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const medicaments = await prisma.medicament.findMany({
      orderBy: {
        nom: "asc",
      },
      include: {
        _count: {
          select: {
            prescriptions: true,
          },
        },
      },
    })

    return NextResponse.json({ medicaments }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des médicaments:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des médicaments" },
      { status: 500 },
    )
  }
}
