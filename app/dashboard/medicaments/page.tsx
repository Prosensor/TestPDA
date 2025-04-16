import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon, Pill, SearchIcon, FilterIcon, FileText, ClipboardList } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestion des médicaments</h2>
          <p className="text-muted-foreground mt-1">Gérez les médicaments pour les prescriptions de vos résidents</p>
        </div>

        <Link href="/dashboard/medicaments/nouveau">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouveau médicament
          </Button>
        </Link>
      </div>

      {/* Barre de recherche */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">Recherche</CardTitle>
          <CardDescription>Recherchez un médicament par son nom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un médicament..."
                className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 md:w-auto">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des médicaments */}
      {medicaments.length === 0 ? (
        <Card className="border-dashed border-2 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucun médicament</h3>
            <p className="mb-6 text-muted-foreground max-w-md">
              Vous n'avez pas encore ajouté de médicament. Commencez par ajouter votre premier médicament pour créer des
              prescriptions.
            </p>
            <Link href="/dashboard/medicaments/nouveau">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un médicament
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medicaments.map((medicament) => (
            <Card
              key={medicament.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30"
            >
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary/70" />
                      <CardTitle className="text-primary line-clamp-1">{medicament.nom}</CardTitle>
                    </div>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>
                        {medicament._count.prescriptions} prescription
                        {medicament._count.prescriptions !== 1 ? "s" : ""}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Actif
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  {medicament.description ? (
                    <p className="text-sm text-muted-foreground line-clamp-3">{medicament.description}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Aucune description</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Link href={`/dashboard/medicaments/${medicament.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90">Modifier</Button>
                  </Link>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3">
                <div className="flex items-center justify-between w-full">
                  <div className="text-xs text-muted-foreground">
                    <ClipboardList className="h-3.5 w-3.5 inline mr-1" />
                    Utilisé dans {medicament._count.prescriptions} traitement
                    {medicament._count.prescriptions !== 1 ? "s" : ""}
                  </div>
                  <Link href={`/dashboard/medicaments/${medicament.id}/prescriptions`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Voir les prescriptions
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {medicaments.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
              disabled
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/30"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
              disabled
            >
              Suivant
            </Button>
          </nav>
        </div>
      )}

      {/* Guide rapide */}
      <Card className="bg-primary/5 border-primary/20 mt-8">
        <CardHeader>
          <CardTitle className="text-primary text-lg">Guide rapide</CardTitle>
          <CardDescription>Comment gérer vos médicaments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-primary">Ajouter un médicament</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Cliquez sur "Nouveau médicament" et remplissez les informations requises.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-primary">Créer des prescriptions</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Utilisez les médicaments pour créer des prescriptions pour vos résidents.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-primary">Imprimer des étiquettes</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Allez dans la section "Étiquettes PDA" pour imprimer les étiquettes pour les médicaments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
