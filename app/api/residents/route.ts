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

    const { nom, prenom, chambre, etage, etablissementId } = await request.json()

    // Validation
    if (!nom || !prenom || !chambre || !etage || !etablissementId) {
      return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
    }

    // Vérifier si l'établissement existe
    const etablissement = await prisma.etablissement.findUnique({
      where: { id: etablissementId },
    })

    if (!etablissement) {
      return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
    }

    // Créer le résident
    const resident = await prisma.resident.create({
      data: {
        nom,
        prenom,
        chambre,
        etage,
        etablissementId,
      },
    })

    return NextResponse.json({ message: "Résident créé avec succès", resident }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du résident:", error)
    return NextResponse.json({ message: "Une erreur est survenue lors de la création du résident" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Récupérer les paramètres de requête
    const url = new URL(request.url)
    const etablissementId = url.searchParams.get("etablissementId")

    // Si un ID d'établissement est fourni, filtrer les résidents par cet établissement
    let residents
    if (etablissementId) {
      console.log("Filtrage des résidents par établissement:", etablissementId)

      // Vérifier si l'établissement existe
      const etablissement = await prisma.etablissement.findUnique({
        where: { id: etablissementId },
      })

      if (!etablissement) {
        return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
      }

      residents = await prisma.resident.findMany({
        where: {
          etablissementId,
        },
        orderBy: {
          nom: "asc",
        },
        include: {
          etablissement: true,
        },
      })
    } else {
      // Sinon, récupérer tous les résidents
      residents = await prisma.resident.findMany({
        orderBy: {
          nom: "asc",
        },
        include: {
          etablissement: true,
          _count: {
            select: {
              prescriptions: true,
            },
          },
        },
      })
    }

    console.log(`${residents.length} résidents trouvés`)
    return NextResponse.json({ residents }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des résidents:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des résidents", error: String(error) },
      { status: 500 },
    )
  }
}
