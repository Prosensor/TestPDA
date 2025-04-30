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

    console.log("Filtrage des prescriptions pour les résidents:", residentIds)

    if (!residentIds || !Array.isArray(residentIds) || residentIds.length === 0) {
      console.log("Liste de résidents invalide ou vide")
      return NextResponse.json({ message: "Liste de résidents invalide" }, { status: 400 })
    }

    // Récupérer les prescriptions pour les résidents sélectionnés
    // Ne pas filtrer par date de fin pour voir toutes les prescriptions
    const prescriptions = await prisma.prescription.findMany({
      where: {
        residentId: {
          in: residentIds,
        },
        // Retirer le filtre de date pour voir toutes les prescriptions, même expirées
        // OR: [{ dateFin: null }, { dateFin: { gt: new Date() } }],
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

    console.log(`${prescriptions.length} prescriptions trouvées pour les résidents sélectionnés`)

    // Afficher les IDs des prescriptions trouvées pour le débogage
    if (prescriptions.length > 0) {
      console.log(
        "IDs des prescriptions trouvées:",
        prescriptions.map((p) => p.id),
      )
    } else {
      console.log("Aucune prescription trouvée pour ces résidents")
    }

    return NextResponse.json({ prescriptions }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des prescriptions:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des prescriptions", error: String(error) },
      { status: 500 },
    )
  }
}
