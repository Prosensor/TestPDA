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

    const { id, nom, adresse, telephone } = await request.json()

    // Validation
    if (!id) {
      return NextResponse.json({ message: "ID requis" }, { status: 400 })
    }

    if (!nom) {
      return NextResponse.json({ message: "Nom requis" }, { status: 400 })
    }

    console.log("Tentative de mise à jour de l'établissement:", {
      id,
      nom,
      adresse,
      telephone,
    })

    try {
      // Vérifier si l'établissement existe
      const existingEtablissement = await prisma.etablissement.findUnique({
        where: { id },
      })

      if (!existingEtablissement) {
        return NextResponse.json(
          {
            message: "Établissement non trouvé",
            searchedId: id,
            idType: typeof id,
          },
          { status: 404 },
        )
      }

      // Mettre à jour l'établissement
      const etablissement = await prisma.etablissement.update({
        where: { id },
        data: {
          nom,
          adresse,
          telephone,
        },
      })

      return NextResponse.json(
        {
          message: "Établissement mis à jour avec succès",
          etablissement,
          idType: typeof id,
        },
        { status: 200 },
      )
    } catch (dbError) {
      console.error("Erreur Prisma:", dbError)
      return NextResponse.json(
        {
          message: "Erreur lors de la mise à jour dans la base de données",
          error: String(dbError),
          id,
          idType: typeof id,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'établissement:", error)
    return NextResponse.json({ message: "Une erreur est survenue", error: String(error) }, { status: 500 })
  }
}
