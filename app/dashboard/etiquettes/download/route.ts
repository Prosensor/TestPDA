import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { jsPDF } from "jspdf"

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

    // Créer un nouveau document PDF avec les dimensions exactes
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [105, 210],
    })

    // Générer un PDF pour chaque prescription
    for (let i = 0; i < prescriptions.length; i++) {
      const prescription = prescriptions[i]

      if (i > 0) {
        doc.addPage([105, 210], "landscape")
      }

      // Formatage des moments de prise
      const moments = []
      if (prescription.matin) moments.push("Matin")
      if (prescription.midi) moments.push("Midi")
      if (prescription.soir) moments.push("Soir")
      if (prescription.coucher) moments.push("Coucher")
      if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

      const momentText = moments.length > 0 ? moments.join(", ") : `${prescription.frequence} fois par jour`

      // Établissement (petit texte en haut)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.resident.etablissement.nom, 105, 10, { align: "center" })

      // Nom du médicament (designation - gros texte)
      doc.setFontSize(32)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.medicament.nom, 105, 20, { align: "center" })

      // Posologie (designation1 - texte moyen)
      doc.setFontSize(24)
      doc.setFont("helvetica", "normal")
      doc.text(prescription.posologie, 105, 32, { align: "center" })

      // Simuler un code-barres (rectangle)
      doc.setDrawColor(0)
      doc.setFillColor(200, 200, 200)
      doc.rect(30, 38, 150, 30, "F")

      // Code-barres texte
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.id.substring(0, 10), 105, 78, { align: "center" })

      // Informations du résident
      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")
      doc.text(`${prescription.resident.nom} ${prescription.resident.prenom}`, 105, 85, { align: "center" })

      doc.setFontSize(12)
      doc.text(`Chambre ${prescription.resident.chambre}, Étage ${prescription.resident.etage}`, 105, 92, {
        align: "center",
      })

      // Moment de prise (emplacement - gros texte en bas)
      doc.setFontSize(32)
      doc.setFont("helvetica", "bold")
      doc.text(momentText, 105, 102, { align: "center" })
    }

    // Convertir le PDF en Buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    // Renvoyer le PDF généré
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=etiquettes-pda.pdf",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    return NextResponse.json({ message: "Une erreur est survenue lors de la génération du PDF" }, { status: 500 })
  }
}
