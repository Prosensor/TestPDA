import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

// Récupérer un établissement par son ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Ajouter des logs pour le débogage
    console.log("Recherche de l'établissement avec ID:", params.id)
    console.log("Type de l'ID:", typeof params.id)

    // Vérifier si l'ID est valide
    if (!params.id) {
      console.error("ID invalide:", params.id)
      return NextResponse.json({ message: "ID d'établissement invalide" }, { status: 400 })
    }

    try {
      const etablissement = await prisma.etablissement.findUnique({
        where: { id: params.id },
      })

      console.log("Établissement trouvé:", etablissement)

      if (!etablissement) {
        return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
      }

      return NextResponse.json({ etablissement }, { status: 200 })
    } catch (dbError) {
      console.error("Erreur Prisma:", dbError)
      return NextResponse.json(
        { message: "Erreur lors de la recherche dans la base de données", error: String(dbError) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'établissement:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération de l'établissement", error: String(error) },
      { status: 500 },
    )
  }
}

// Mettre à jour un établissement
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Ajouter des logs pour le débogage
    console.log("PUT - Mise à jour de l'établissement avec ID:", params.id)
    console.log("Type de l'ID:", typeof params.id)

    try {
      const body = await request.json()
      console.log("Données reçues:", body)

      const { nom, adresse, telephone } = body

      // Validation
      if (!nom) {
        console.log("Validation échouée: nom manquant")
        return NextResponse.json({ message: "Le nom de l'établissement est requis" }, { status: 400 })
      }

      // Vérifier si l'établissement existe
      const existingEtablissement = await prisma.etablissement.findUnique({
        where: { id: params.id },
      })

      console.log("Établissement existant:", existingEtablissement)

      if (!existingEtablissement) {
        console.log("Établissement non trouvé avec ID:", params.id)
        return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
      }

      // Mettre à jour l'établissement
      console.log("Tentative de mise à jour avec les données:", { nom, adresse, telephone })

      const etablissement = await prisma.etablissement.update({
        where: { id: params.id },
        data: {
          nom,
          adresse,
          telephone,
        },
      })

      console.log("Mise à jour réussie:", etablissement)

      return NextResponse.json({ message: "Établissement mis à jour avec succès", etablissement }, { status: 200 })
    } catch (jsonError) {
      console.error("Erreur lors du parsing JSON:", jsonError)
      return NextResponse.json(
        { message: "Erreur lors du parsing des données", error: String(jsonError) },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'établissement:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la mise à jour de l'établissement", error: String(error) },
      { status: 500 },
    )
  }
}

// Supprimer un établissement
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 403 })
    }

    // Vérifier si l'établissement existe
    const existingEtablissement = await prisma.etablissement.findUnique({
      where: { id: params.id },
      include: {
        residents: true,
      },
    })

    if (!existingEtablissement) {
      return NextResponse.json({ message: "Établissement non trouvé" }, { status: 404 })
    }

    // Si l'établissement a des résidents, vérifier s'ils ont des prescriptions
    if (existingEtablissement.residents.length > 0) {
      // Récupérer les IDs des résidents
      const residentIds = existingEtablissement.residents.map((resident) => resident.id)

      // Supprimer d'abord toutes les prescriptions associées aux résidents
      await prisma.prescription.deleteMany({
        where: {
          residentId: {
            in: residentIds,
          },
        },
      })

      // Ensuite, supprimer tous les résidents
      await prisma.resident.deleteMany({
        where: {
          etablissementId: params.id,
        },
      })
    }

    // Enfin, supprimer l'établissement
    await prisma.etablissement.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Établissement supprimé avec succès" }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'établissement:", error)
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression de l'établissement", error: String(error) },
      { status: 500 },
    )
  }
}
