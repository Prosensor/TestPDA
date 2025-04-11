import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

const prisma = new PrismaClient()

export default async function MedicamentsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const medicaments = await prisma.medicament.findMany({
    orderBy: {
      nom: "asc",
    },
    include: {
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
        <h2 className="text-3xl font-bold">Gestion des médicaments</h2>
        <Link href="/dashboard/medicaments/nouveau">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouveau médicament
          </Button>
        </Link>
      </div>

      {medicaments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">Aucun médicament n'a été ajouté pour le moment.</p>
            <Link href="/dashboard/medicaments/nouveau">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un médicament
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medicaments.map((medicament) => (
            <Card key={medicament.id}>
              <CardHeader>
                <CardTitle>{medicament.nom}</CardTitle>
                <CardDescription>
                  {medicament._count.prescriptions} prescription{medicament._count.prescriptions !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {medicament.description && <p className="text-sm mb-4">{medicament.description}</p>}
                <div className="flex justify-end">
                  <Link href={`/dashboard/medicaments/${medicament.id}`}>
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
