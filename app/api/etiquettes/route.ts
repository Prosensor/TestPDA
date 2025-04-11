import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    const { prescriptionIds } = await request.json()

    if (!prescriptionIds || !Array.isArray(prescriptionIds) || prescriptionIds.length === 0) {
      return NextResponse.json({ message: "Liste de prescriptions invalide" }, { status: 400 })
    }

    // Récupérer les prescriptions demandées
    const prescriptions = await prisma.prescription.findMany({
      where: {
        id: {
          in: prescriptionIds,
        },
      },
      include: {
        resident: {
          include: {
            etablissement: true,
          },
        },
        medicament: true,
      },
    })

    if (prescriptions.length === 0) {
      return NextResponse.json({ message: "Aucune prescription trouvée" }, { status: 404 })
    }

    // Formater les données pour les étiquettes
    const etiquettes = prescriptions.map((prescription) => {
      // Formatage des moments de prise
      const moments = []
      if (prescription.matin) moments.push("Matin")
      if (prescription.midi) moments.push("Midi")
      if (prescription.soir) moments.push("Soir")
      if (prescription.coucher) moments.push("Coucher")
      if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

      const momentText = moments.length > 0 ? moments.join(", ") : `${prescription.frequence} fois par jour`

      return {
        id: prescription.id,
        designation: prescription.medicament.nom,
        designation1: prescription.posologie,
        code_barre: `${prescription.id.substring(0, 10)}`,
        emplacement: momentText,
        resident: {
          nom: prescription.resident.nom,
          prenom: prescription.resident.prenom,
          chambre: prescription.resident.chambre,
          etage: prescription.resident.etage,
        },
        etablissement: prescription.resident.etablissement.nom,
      }
    })

    return NextResponse.json({ etiquettes }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la génération des étiquettes:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la génération des étiquettes" },
      { status: 500 },
    )
  }
}
