import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

const prisma = new PrismaClient()

export default async function PrescriptionsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR")
  }

  // Fonction pour formater l'affichage des moments de prise
  const formatMomentsPrise = (prescription: any) => {
    const moments = []
    if (prescription.matin) moments.push("Matin")
    if (prescription.midi) moments.push("Midi")
    if (prescription.soir) moments.push("Soir")
    if (prescription.coucher) moments.push("Coucher")
    if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

    if (moments.length > 0) {
      return moments.join(", ")
    } else if (prescription.frequence > 0) {
      return `${prescription.frequence}x/jour`
    }

    return "-"
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Gestion des prescriptions</h2>
        <Link href="/dashboard/prescriptions/nouvelle">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle prescription
          </Button>
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">
              Aucune prescription n'a été ajoutée pour le moment.
            </p>
            <Link href="/dashboard/prescriptions/nouvelle">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter une prescription
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Résident</th>
                <th className="px-4 py-2 text-left font-medium">Établissement</th>
                <th className="px-4 py-2 text-left font-medium">Médicament</th>
                <th className="px-4 py-2 text-left font-medium">Posologie</th>
                <th className="px-4 py-2 text-left font-medium">Moments de prise</th>
                <th className="px-4 py-2 text-left font-medium">Date début</th>
                <th className="px-4 py-2 text-left font-medium">Date fin</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-b">
                  <td className="px-4 py-2">
                    {prescription.resident.nom} {prescription.resident.prenom}
                  </td>
                  <td className="px-4 py-2">{prescription.resident.etablissement.nom}</td>
                  <td className="px-4 py-2">{prescription.medicament.nom}</td>
                  <td className="px-4 py-2">{prescription.posologie}</td>
                  <td className="px-4 py-2">{formatMomentsPrise(prescription)}</td>
                  <td className="px-4 py-2">{formatDate(prescription.dateDebut)}</td>
                  <td className="px-4 py-2">{prescription.dateFin ? formatDate(prescription.dateFin) : "En cours"}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                      <Button size="sm">Modifier</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
