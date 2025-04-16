import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

// Récupérer un médicament par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    console.log("Recherche du médicament avec ID:", params.id)

    // Vérifier si l'ID est valide
    if (!params.id) {
      console.error("ID invalide:", params.id)
      return NextResponse.json({ message: "ID de médicament invalide" }, { status: 400 })
    }

    try {
      const medicament = await prisma.medicament.findUnique({
        where: { id: params.id },
        include: {
          _count: {
            select: {
              prescriptions: true,
            },
          },
        },
      })

      console.log("Médicament trouvé:", medicament)

      if (!medicament) {
        return NextResponse.json({ message: "Médicament non trouvé" }, { status: 404 })
      }

      return NextResponse.json({ medicament }, { status: 200 })
    } catch (dbError) {
      console.error("Erreur Prisma:", dbError)
      return NextResponse.json(
        { message: "Erreur lors de la recherche dans la base de données", error: String(dbError) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du médicament:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération du médicament", error: String(error) },
      { status: 500 },
    )
  }
}

// Mettre à jour un médicament
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    console.log("PUT - Mise à jour du médicament avec ID:", params.id)

    try {
      const body = await request.json()
      console.log("Données reçues:", body)

      const { nom, description } = body

      // Validation
      if (!nom) {
        console.log("Validation échouée: nom manquant")
        return NextResponse.json({ message: "Le nom du médicament est requis" }, { status: 400 })
      }

      // Vérifier si le médicament existe
      const existingMedicament = await prisma.medicament.findUnique({
        where: { id: params.id },
      })

      console.log("Médicament existant:", existingMedicament)

      if (!existingMedicament) {
        console.log("Médicament non trouvé avec ID:", params.id)
        return NextResponse.json({ message: "Médicament non trouvé" }, { status: 404 })
      }

      // Mettre à jour le médicament
      console.log("Tentative de mise à jour avec les données:", { nom, description })

      const medicament = await prisma.medicament.update({
        where: { id: params.id },
        data: {
          nom,
          description,
        },
      })

      console.log("Mise à jour réussie:", medicament)

      return NextResponse.json({ message: "Médicament mis à jour avec succès", medicament }, { status: 200 })
    } catch (jsonError) {
      console.error("Erreur lors du parsing JSON:", jsonError)
      return NextResponse.json(
        { message: "Erreur lors du parsing des données", error: String(jsonError) },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du médicament:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la mise à jour du médicament", error: String(error) },
      { status: 500 },
    )
  }
}

// Supprimer un médicament
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Vérifier si le médicament existe
    const existingMedicament = await prisma.medicament.findUnique({
      where: { id: params.id },
      include: {
        prescriptions: true,
      },
    })

    if (!existingMedicament) {
      return NextResponse.json({ message: "Médicament non trouvé" }, { status: 404 })
    }

    // Supprimer d'abord toutes les prescriptions associées
    await prisma.prescription.deleteMany({
      where: {
        medicamentId: params.id,
      },
    })

    // Ensuite, supprimer le médicament
    await prisma.medicament.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Médicament supprimé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression du médicament:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression du médicament", error: String(error) },
      { status: 500 },
    )
  }
}
