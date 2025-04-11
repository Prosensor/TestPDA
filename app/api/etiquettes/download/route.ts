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

      // Fond blanc pour toute la page
      doc.setFillColor(255, 255, 255) // Blanc
      doc.rect(0, 0, 210, 105, "F")

      // Partie supérieure - Nom du médicament
      doc.setTextColor(0, 0, 0) // Noir
      doc.setFontSize(24)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.medicament.nom, 40, 15) // Marge à gauche à 40mm

      doc.setFontSize(16)
      doc.setFont("helvetica", "normal")
      doc.text("Pharmacie Mozart", 40, 25) // Marge à gauche à 40mm

      // Partie centrale - Informations patient et posologie
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.resident.etablissement.nom, 40, 40) // Nom de l'établissement au lieu de "Pharmacie MOZART"

      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")
      doc.text(`Patient : ${prescription.resident.nom} ${prescription.resident.prenom}`, 40, 50)

      doc.setFontSize(14)
      doc.text(`${dateFormatted} ${prescription.medicament.nom.substring(0, 10)} ${prescription.posologie}`, 40, 60)

      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(prescription.posologie, 40, 70)
      doc.text(momentText, 40, 80)

      // Partie inférieure - Informations complémentaires
      doc.setTextColor(0, 0, 0) // Noir
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Chambre ${prescription.resident.chambre}, Étage ${prescription.resident.etage}`, 40, 95)
    }

    // Convertir le PDF en Buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    // Renvoyer le PDF généré pour affichage direct dans le navigateur
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=etiquettes-pda.pdf",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    return NextResponse.json({ message: "Une erreur est survenue lors de la génération du PDF" }, { status: 500 })
  }
}
