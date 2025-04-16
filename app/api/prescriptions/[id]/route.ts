import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

// Récupérer une prescription par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    console.log("Recherche de la prescription avec ID:", params.id)

    // Vérifier si l'ID est valide
    if (!params.id) {
      console.error("ID invalide:", params.id)
      return NextResponse.json({ message: "ID de prescription invalide" }, { status: 400 })
    }

    try {
      const prescription = await prisma.prescription.findUnique({
        where: { id: params.id },
        include: {
          resident: {
            include: {
              etablissement: true,
            },
          },
          medicament: true,
        },
      })

      console.log("Prescription trouvée:", prescription)

      if (!prescription) {
        return NextResponse.json({ message: "Prescription non trouvée" }, { status: 404 })
      }

      return NextResponse.json({ prescription }, { status: 200 })
    } catch (dbError) {
      console.error("Erreur Prisma:", dbError)
      return NextResponse.json(
        { message: "Erreur lors de la recherche dans la base de données", error: String(dbError) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la prescription:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération de la prescription", error: String(error) },
      { status: 500 },
    )
  }
}

// Mettre à jour une prescription
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    console.log("PUT - Mise à jour de la prescription avec ID:", params.id)

    try {
      const body = await request.json()
      console.log("Données reçues:", body)

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
      } = body

      // Validation
      if (!residentId || !medicamentId || !posologie || !dateDebut) {
        console.log("Validation échouée: champs manquants")
        return NextResponse.json({ message: "Tous les champs obligatoires doivent être remplis" }, { status: 400 })
      }

      // Vérifier qu'au moins un moment de prise est sélectionné
      if (!matin && !midi && !soir && !coucher && !autreHoraire && !frequence) {
        return NextResponse.json({ message: "Veuillez sélectionner au moins un moment de prise" }, { status: 400 })
      }

      // Vérifier si la prescription existe
      const existingPrescription = await prisma.prescription.findUnique({
        where: { id: params.id },
      })

      console.log("Prescription existante:", existingPrescription)

      if (!existingPrescription) {
        console.log("Prescription non trouvée avec ID:", params.id)
        return NextResponse.json({ message: "Prescription non trouvée" }, { status: 404 })
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

      // Mettre à jour la prescription
      console.log("Tentative de mise à jour avec les données:", {
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
      })

      const prescription = await prisma.prescription.update({
        where: { id: params.id },
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

      console.log("Mise à jour réussie:", prescription)

      return NextResponse.json({ message: "Prescription mise à jour avec succès", prescription }, { status: 200 })
    } catch (jsonError) {
      console.error("Erreur lors du parsing JSON:", jsonError)
      return NextResponse.json(
        { message: "Erreur lors du parsing des données", error: String(jsonError) },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la prescription:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la mise à jour de la prescription", error: String(error) },
      { status: 500 },
    )
  }
}

// Supprimer une prescription
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Vérifier si la prescription existe
    const existingPrescription = await prisma.prescription.findUnique({
      where: { id: params.id },
    })

    if (!existingPrescription) {
      return NextResponse.json({ message: "Prescription non trouvée" }, { status: 404 })
    }

    // Supprimer la prescription
    await prisma.prescription.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Prescription supprimée avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression de la prescription:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression de la prescription", error: String(error) },
      { status: 500 },
    )
  }
}
