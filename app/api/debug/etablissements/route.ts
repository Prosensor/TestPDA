import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Récupérer tous les établissements pour vérifier qu'ils existent
    const etablissements = await prisma.etablissement.findMany({
      orderBy: {
        nom: "asc",
      },
    })

    return NextResponse.json(
      {
        message: "Liste des établissements",
        count: etablissements.length,
        etablissements,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la récupération des établissements:", error)
    return NextResponse.json({ message: "Une erreur est survenue", error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const { id } = await request.json()

    // Validation
    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 })
    }

    // Rechercher l'établissement spécifique
    const etablissement = await prisma.etablissement.findUnique({
      where: { id },
    })

    if (!etablissement) {
      return NextResponse.json(
        {
          message: "Établissement non trouvé",
          searchedId: id,
          idType: typeof id,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        message: "Établissement trouvé",
        etablissement,
        idType: typeof id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erreur lors de la recherche de l'établissement:", error)
    return NextResponse.json({ message: "Une erreur est survenue", error: String(error) }, { status: 500 })
  }
}
