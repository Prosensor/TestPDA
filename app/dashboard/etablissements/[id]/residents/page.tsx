import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  PlusIcon,
  ArrowLeftIcon,
  Users,
  Building,
  BedIcon,
  SquareStackIcon as StairsIcon,
  FileTextIcon,
} from "lucide-react"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

export default async function EtablissementResidentsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Convertir params.id en string si c'est un tableau
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  console.log("Page résidents - ID de l'établissement:", id)
  console.log("Type de l'ID:", typeof id)

  try {
    // Récupérer l'établissement
    const etablissement = await prisma.etablissement.findUnique({
      where: { id },
    })

    console.log("Établissement trouvé:", etablissement)

    if (!etablissement) {
      console.error("Établissement non trouvé avec ID:", id)
      notFound()
    }

    // Récupérer les résidents de l'établissement
    const residents = await prisma.resident.findMany({
      where: {
        etablissementId: id,
      },
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
        <div className="flex items-center gap-4">
          <Link href="/dashboard/etablissements">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-primary">Résidents de {etablissement.nom}</h2>
            <p className="text-muted-foreground mt-1">Gérez les résidents de cet établissement</p>
          </div>
        </div>

        {/* Informations de l'établissement */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-primary">{etablissement.nom}</h3>
              {etablissement.adresse && <p className="text-foreground/80 mt-1">{etablissement.adresse}</p>}
              {etablissement.telephone && <p className="text-foreground/80">{etablissement.telephone}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Link href={`/dashboard/etablissements/${id}`}>
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                  Modifier l'établissement
                </Button>
              </Link>
              <Link href={`/dashboard/residents/nouveau?etablissement=${id}`}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nouveau résident
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Liste des résidents */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Liste des résidents
              <span className="ml-2 bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                {residents.length}
              </span>
            </h3>
          </div>

          {residents.length === 0 ? (
            <Card className="border-dashed border-2 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Aucun résident</h3>
                <p className="mb-6 text-muted-foreground max-w-md">
                  Cet établissement n'a pas encore de résidents. Ajoutez des résidents pour pouvoir gérer leurs
                  prescriptions et imprimer des étiquettes PDA.
                </p>
                <Link href={`/dashboard/residents/nouveau?etablissement=${id}`}>
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
                        <CardTitle className="text-primary">
                          {resident.nom} {resident.prenom}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <FileTextIcon className="h-4 w-4 mr-1 text-primary/70" />
                          <span>
                            {resident._count.prescriptions} prescription{resident._count.prescriptions !== 1 ? "s" : ""}
                          </span>
                        </CardDescription>
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
        </div>
      </div>
    )
  } catch (error) {
    console.error("Erreur lors du chargement de la page:", error)
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/etablissements">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-primary">Erreur</h2>
        </div>

        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-destructive mb-4">Une erreur est survenue</h3>
            <p className="text-muted-foreground">
              Impossible de charger les informations de l'établissement ou de ses résidents.
            </p>
            <div className="flex justify-center mt-6">
              <Link href="/dashboard/etablissements">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour à la liste des établissements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
