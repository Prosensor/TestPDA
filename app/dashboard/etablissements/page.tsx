import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PlusIcon, Building, MapPin, Phone, Users, ArrowRightIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"

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
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestion des établissements</h2>
          <p className="text-muted-foreground mt-1">Gérez les établissements et leurs résidents</p>
        </div>

        <Link href="/dashboard/etablissements/nouveau">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvel établissement
          </Button>
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un établissement..."
          className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Liste des établissements */}
      {etablissements.length === 0 ? (
        <Card className="border-dashed border-2 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucun établissement</h3>
            <p className="mb-6 text-muted-foreground max-w-md">
              Vous n'avez pas encore ajouté d'établissement. Commencez par ajouter votre premier établissement pour
              gérer ses résidents.
            </p>
            <Link href="/dashboard/etablissements/nouveau">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un établissement
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {etablissements.map((etablissement) => (
            <Card
              key={etablissement.id}
              className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-primary">{etablissement.nom}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Users className="h-4 w-4 mr-1 text-primary/70" />
                      <span>
                        {etablissement._count.residents} résident{etablissement._count.residents !== 1 ? "s" : ""}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="bg-accent/10 text-accent font-medium text-xs px-2 py-1 rounded-full">Actif</div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3 mb-6">
                  {etablissement.adresse && (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary/70 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{etablissement.adresse}</span>
                    </div>
                  )}
                  {etablissement.telephone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary/70 flex-shrink-0" />
                      <span className="text-foreground/80">{etablissement.telephone}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Link href={`/dashboard/etablissements/${etablissement.id}/residents`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Voir les résidents
                    </Button>
                  </Link>
                  <Link href={`/dashboard/etablissements/${etablissement.id}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Modifier
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Guide rapide */}
      {etablissements.length > 0 && (
        <Card className="bg-primary/5 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="text-primary text-lg">Guide rapide</CardTitle>
            <CardDescription>Comment gérer vos établissements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-primary">Ajouter un établissement</h4>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Cliquez sur "Nouvel établissement" et remplissez les informations requises.
                </p>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-primary">Gérer les résidents</h4>
                </div>
                <p className="text-sm text-muted-foreground ml-11">
                  Cliquez sur "Voir les résidents" pour ajouter ou modifier les résidents de l'établissement.
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
