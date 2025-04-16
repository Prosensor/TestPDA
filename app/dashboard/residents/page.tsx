import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  PlusIcon,
  User,
  Building,
  BedIcon,
  SquareStackIcon as StairsIcon,
  FileTextIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

  const etablissements = await prisma.etablissement.findMany({
    orderBy: {
      nom: "asc",
    },
  })

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestion des résidents</h2>
          <p className="text-muted-foreground mt-1">Gérez les résidents et leurs prescriptions</p>
        </div>

        <Link href="/dashboard/residents/nouveau">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouveau résident
          </Button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">Recherche et filtres</CardTitle>
          <CardDescription>Filtrez les résidents par établissement ou recherchez par nom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un résident..."
                className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="w-full md:w-64">
              <Select>
                <SelectTrigger className="border-primary/20 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Tous les établissements" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les établissements</SelectItem>
                  {etablissements.map((etablissement) => (
                    <SelectItem key={etablissement.id} value={etablissement.id}>
                      {etablissement.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 md:w-auto">
              <FilterIcon className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des résidents */}
      {residents.length === 0 ? (
        <Card className="border-dashed border-2 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucun résident</h3>
            <p className="mb-6 text-muted-foreground max-w-md">
              Vous n'avez pas encore ajouté de résident. Commencez par ajouter votre premier résident pour gérer ses
              prescriptions.
            </p>
            <Link href="/dashboard/residents/nouveau">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un résident
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {residents.map((resident) => (
            <Card
              key={resident.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30"
            >
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <User className="h-5 w-5 text-primary/70" />
                      <span>
                        {resident.nom} {resident.prenom}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Building className="h-4 w-4 mr-1 text-primary/70" />
                      <span>{resident.etablissement.nom}</span>
                    </CardDescription>
                  </div>
                  <div className="bg-accent/10 text-accent font-medium text-xs px-2 py-1 rounded-full">
                    {resident._count.prescriptions} prescription{resident._count.prescriptions !== 1 ? "s" : ""}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <BedIcon className="h-4 w-4 text-primary/70 flex-shrink-0" />
                    <span className="text-foreground/80">Chambre {resident.chambre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <StairsIcon className="h-4 w-4 text-primary/70 flex-shrink-0" />
                    <span className="text-foreground/80">Étage {resident.etage}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Link href={`/dashboard/residents/${resident.id}/prescriptions`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
                    >
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Prescriptions
                    </Button>
                  </Link>
                  <Link href={`/dashboard/residents/${resident.id}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">Modifier</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {residents.length > 0 && (
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
      {residents.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="text-primary text-lg">Guide rapide</CardTitle>
            <CardDescription>Comment gérer vos résidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-primary">Ajouter un résident</h4>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Cliquez sur "Nouveau résident" et remplissez les informations requises.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-primary">Gérer les prescriptions</h4>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Cliquez sur "Prescriptions" pour ajouter ou modifier les prescriptions du résident.
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
                  Allez dans la section "Étiquettes PDA" pour imprimer les étiquettes pour les résidents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
