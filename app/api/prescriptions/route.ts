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

    // Récupérer et valider les données
    const {
      residentId,
      medicamentId,
      posologie,
      matin,
      midi,
      soir,
      coucher,
      autreHoraire,
      frequence,
      dateDebut,
      dateFin,
    } = await request.json()

    // Validation des champs obligatoires
    if (!residentId || !medicamentId || !posologie || !dateDebut) {
      return NextResponse.json({ message: "Tous les champs obligatoires doivent être remplis" }, { status: 400 })
    }

    // Vérifier qu'au moins un moment de prise est sélectionné
    if (!matin && !midi && !soir && !coucher && !autreHoraire && !frequence) {
      return NextResponse.json({ message: "Veuillez sélectionner au moins un moment de prise" }, { status: 400 })
    }

    // Vérifier si le résident existe
    const resident = await prisma.resident.findUnique({
      where: { id: residentId },
    })

    if (!resident) {
      return NextResponse.json({ message: "Résident non trouvé" }, { status: 404 })
    }

    // Vérifier si le médicament existe
    const medicament = await prisma.medicament.findUnique({
      where: { id: medicamentId },
    })

    if (!medicament) {
      return NextResponse.json({ message: "Médicament non trouvé" }, { status: 404 })
    }

    // Créer la prescription
    const prescription = await prisma.prescription.create({
      data: {
        residentId,
        medicamentId,
        posologie,
        matin: matin || false,
        midi: midi || false,
        soir: soir || false,
        coucher: coucher || false,
        autreHoraire: autreHoraire || null,
        frequence,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
      },
    })

    return NextResponse.json({ message: "Prescription créée avec succès", prescription }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la prescription:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la prescription" },
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

    const prescriptions = await prisma.prescription.findMany({
      orderBy: [{ residentId: "asc" }, { medicamentId: "asc" }],
      include: {
        resident: {
          include: {
            etablissement: true,
          },
        },
        medicament: true,
      },
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
