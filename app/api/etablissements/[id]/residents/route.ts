import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Récupérer l'ID de l'établissement depuis les paramètres
    const etablissementId = params.id

    // Ajouter des logs pour le débogage
    console.log("Recherche de l'établissement avec ID:", etablissementId)
    console.log("Type de l'ID:", typeof etablissementId)

    // Vérifier si l'ID est valide
    if (!etablissementId) {
      console.error("ID invalide:", etablissementId)
      return NextResponse.json({ message: "ID d'établissement invalide" }, { status: 400 })
    }

    try {
      // Vérifier si l'établissement existe
      const etablissement = await prisma.etablissement.findUnique({
        where: { id: etablissementId },
      })

      console.log("Établissement trouvé:", etablissement)

      if (!etablissement) {
        return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
      }

      // Récupérer les résidents de l'établissement
      const residents = await prisma.resident.findMany({
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

      return NextResponse.json({ residents }, { status: 200 })
    } catch (error) {
      console.error("Erreur lors de la récupération des résidents:", error)
      return NextResponse.json(
        { message: "Une erreur est survenue lors de la récupération des résidents" },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    return NextResponse.json({ message: "Une erreur est survenue lors de l'authentification" }, { status: 500 })
  }
}
