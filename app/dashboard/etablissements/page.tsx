import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

const prisma = new PrismaClient()

export default async function EtablissementsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const etablissements = await prisma.etablissement.findMany({
    orderBy: {
      nom: "asc",
    },
    include: {
      _count: {
        select: {
          residents: true,
        },
      },
    },
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Gestion des établissements</h2>
        <Link href="/dashboard/etablissements/nouveau">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvel établissement
          </Button>
        </Link>
      </div>

      {etablissements.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">Aucun établissement n'a été ajouté pour le moment.</p>
            <Link href="/dashboard/etablissements/nouveau">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un établissement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {etablissements.map((etablissement) => (
            <Card key={etablissement.id}>
              <CardHeader>
                <CardTitle>{etablissement.nom}</CardTitle>
                <CardDescription>
                  {etablissement._count.residents} résident{etablissement._count.residents !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {etablissement.adresse && <p className="text-sm mb-2">{etablissement.adresse}</p>}
                {etablissement.telephone && <p className="text-sm mb-4">{etablissement.telephone}</p>}
                <div className="flex justify-end space-x-2">
                  <Link href={`/dashboard/etablissements/${etablissement.id}/residents`}>
                    <Button variant="outline" size="sm">
                      Voir les résidents
                    </Button>
                  </Link>
                  <Link href={`/dashboard/etablissements/${etablissement.id}`}>
                    <Button size="sm">Modifier</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
