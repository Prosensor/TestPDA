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
      if (prescription.matin) moments.push("MATIN")
      if (prescription.midi) moments.push("MIDI")
      if (prescription.soir) moments.push("SOIR")
      if (prescription.coucher) moments.push("COUCHER")
      if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

      const momentText = moments.length > 0 ? moments.join(", ") : `${prescription.frequence}x/jour`

      // Formater la date
      const dateObj = new Date(prescription.dateDebut)
      const dateFormatted = `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1).toString().padStart(2, "0")}/${dateObj.getFullYear().toString().substring(2)}`

      // Partie bleue en haut (fond)
      doc.setFillColor(59, 130, 246) // Bleu
      doc.rect(0, 0, 210, 30, "F")

      // Texte dans la partie bleue
      doc.setTextColor(255, 255, 255) // Blanc
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.medicament.nom, 10, 15)

      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text("Pharmacie Mozart", 10, 25)

      // Partie verte (fond)
      doc.setFillColor(34, 197, 94) // Vert
      doc.rect(0, 30, 210, 50, "F")

      // Texte dans la partie verte
      doc.setTextColor(255, 255, 255) // Blanc
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Pharmacie MOZART", 10, 40)

      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")
      doc.text(`Patient : ${prescription.resident.nom} ${prescription.resident.prenom}`, 10, 50)

      doc.setFontSize(14)
      doc.text(`${dateFormatted} ${prescription.medicament.nom.substring(0, 10)} ${prescription.posologie}`, 10, 60)

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.posologie, 10, 70)
      doc.text(momentText, 10, 80)

      // Partie blanche en bas (fond)
      doc.setFillColor(255, 255, 255) // Blanc
      doc.rect(0, 80, 210, 25, "F")

      // Texte dans la partie blanche
      doc.setTextColor(100, 100, 100) // Gris
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Chambre ${prescription.resident.chambre}, Étage ${prescription.resident.etage}`, 10, 90)
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
