import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

const prisma = new PrismaClient()

export default async function ResidentsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const residents = await prisma.resident.findMany({
    orderBy: {
      nom: "asc",
    },
    include: {
      etablissement: true,
      _count: {
        select: {
          prescriptions: true,
        },
      },
    },
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Gestion des résidents</h2>
        <Link href="/dashboard/residents/nouveau">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouveau résident
          </Button>
        </Link>
      </div>

      {residents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">Aucun résident n'a été ajouté pour le moment.</p>
            <Link href="/dashboard/residents/nouveau">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un résident
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Nom</th>
                <th className="px-4 py-2 text-left font-medium">Prénom</th>
                <th className="px-4 py-2 text-left font-medium">Chambre</th>
                <th className="px-4 py-2 text-left font-medium">Étage</th>
                <th className="px-4 py-2 text-left font-medium">Établissement</th>
                <th className="px-4 py-2 text-left font-medium">Prescriptions</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {residents.map((resident) => (
                <tr key={resident.id} className="border-b">
                  <td className="px-4 py-2">{resident.nom}</td>
                  <td className="px-4 py-2">{resident.prenom}</td>
                  <td className="px-4 py-2">{resident.chambre}</td>
                  <td className="px-4 py-2">{resident.etage}</td>
                  <td className="px-4 py-2">{resident.etablissement.nom}</td>
                  <td className="px-4 py-2">{resident._count.prescriptions}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={`/dashboard/residents/${resident.id}/prescriptions`}>
                        <Button variant="outline" size="sm">
                          Prescriptions
                        </Button>
                      </Link>
                      <Link href={`/dashboard/residents/${resident.id}`}>
                        <Button size="sm">Modifier</Button>
                      </Link>
                    </div>
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
