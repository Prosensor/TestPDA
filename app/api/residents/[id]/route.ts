import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

// Récupérer un résident par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    console.log("Recherche du résident avec ID:", params.id)

    // Vérifier si l'ID est valide
    if (!params.id) {
      console.error("ID invalide:", params.id)
      return NextResponse.json({ message: "ID de résident invalide" }, { status: 400 })
    }

    try {
      const resident = await prisma.resident.findUnique({
        where: { id: params.id },
        include: {
          etablissement: true,
          _count: {
            select: {
              prescriptions: true,
            },
          },
        },
      })

      console.log("Résident trouvé:", resident)

      if (!resident) {
        return NextResponse.json({ message: "Résident non trouvé" }, { status: 404 })
      }

      return NextResponse.json({ resident }, { status: 200 })
    } catch (dbError) {
      console.error("Erreur Prisma:", dbError)
      return NextResponse.json(
        { message: "Erreur lors de la recherche dans la base de données", error: String(dbError) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du résident:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération du résident", error: String(error) },
      { status: 500 },
    )
  }
}

// Mettre à jour un résident
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    console.log("PUT - Mise à jour du résident avec ID:", params.id)

    try {
      const body = await request.json()
      console.log("Données reçues:", body)

      const { nom, prenom, chambre, etage, etablissementId } = body

      // Validation
      if (!nom || !prenom || !chambre || !etage || !etablissementId) {
        console.log("Validation échouée: champs manquants")
        return NextResponse.json({ message: "Tous les champs sont requis" }, { status: 400 })
      }

      // Vérifier si le résident existe
      const existingResident = await prisma.resident.findUnique({
        where: { id: params.id },
      })

      console.log("Résident existant:", existingResident)

      if (!existingResident) {
        console.log("Résident non trouvé avec ID:", params.id)
        return NextResponse.json({ message: "Résident non trouvé" }, { status: 404 })
      }

      // Vérifier si l'établissement existe
      const etablissement = await prisma.etablissement.findUnique({
        where: { id: etablissementId },
      })

      if (!etablissement) {
        return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
      }

      // Mettre à jour le résident
      console.log("Tentative de mise à jour avec les données:", { nom, prenom, chambre, etage, etablissementId })

      const resident = await prisma.resident.update({
        where: { id: params.id },
        data: {
          nom,
          prenom,
          chambre,
          etage,
          etablissementId,
        },
      })

      console.log("Mise à jour réussie:", resident)

      return NextResponse.json({ message: "Résident mis à jour avec succès", resident }, { status: 200 })
    } catch (jsonError) {
      console.error("Erreur lors du parsing JSON:", jsonError)
      return NextResponse.json(
        { message: "Erreur lors du parsing des données", error: String(jsonError) },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du résident:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la mise à jour du résident", error: String(error) },
      { status: 500 },
    )
  }
}

// Supprimer un résident
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Vérifier si le résident existe
    const existingResident = await prisma.resident.findUnique({
      where: { id: params.id },
      include: {
        prescriptions: true,
      },
    })

    if (!existingResident) {
      return NextResponse.json({ message: "Résident non trouvé" }, { status: 404 })
    }

    // Supprimer d'abord toutes les prescriptions associées
    await prisma.prescription.deleteMany({
      where: {
        residentId: params.id,
      },
    })

    // Ensuite, supprimer le résident
    await prisma.resident.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Résident supprimé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression du résident:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression du résident", error: String(error) },
      { status: 500 },
    )
  }
}
