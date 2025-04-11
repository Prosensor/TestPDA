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

    const { residentIds } = await request.json()

    if (!residentIds || !Array.isArray(residentIds) || residentIds.length === 0) {
      return NextResponse.json({ message: "Liste de résidents invalide" }, { status: 400 })
    }

    // Récupérer les prescriptions pour les résidents sélectionnés
    const prescriptions = await prisma.prescription.findMany({
      where: {
        residentId: {
          in: residentIds,
        },
        // Optionnel: filtrer uniquement les prescriptions actives
        OR: [{ dateFin: null }, { dateFin: { gt: new Date() } }],
      },
      include: {
        resident: {
          include: {
            etablissement: true,
          },
        },
        medicament: true,
      },
      orderBy: [{ residentId: "asc" }, { medicamentId: "asc" }],
    })

    return NextResponse.json({ prescriptions }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des prescriptions:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des prescriptions" },
      { status: 500 },
    )
  }
}
