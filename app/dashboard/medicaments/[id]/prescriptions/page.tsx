import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeftIcon, Pill, FileText, PlusIcon, User, Calendar, Clock } from "lucide-react"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

const prisma = new PrismaClient()

export default async function MedicamentPrescriptionsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id

  try {
    // Récupérer le médicament
    const medicament = await prisma.medicament.findUnique({
      where: { id },
    })

    if (!medicament) {
      notFound()
    }

    // Récupérer les prescriptions associées à ce médicament
    const prescriptions = await prisma.prescription.findMany({
      where: {
        medicamentId: id,
      },
      include: {
        resident: {
          include: {
            etablissement: true,
          },
        },
      },
      orderBy: {
        dateDebut: "desc",
      },
    })

    // Fonction pour formater la date
    const formatDate = (date: Date) => {
      return format(date, "dd MMMM yyyy", { locale: fr })
    }

    // Fonction pour formater les moments de prise
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

    // Vérifier si une prescription est active
    const isActive = (prescription: any) => {
      const now = new Date()
      const dateDebut = new Date(prescription.dateDebut)
      const dateFin = prescription.dateFin ? new Date(prescription.dateFin) : null

      return dateDebut <= now && (!dateFin || dateFin >= now)
    }

    return (
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/medicaments/${id}`}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-primary">Prescriptions de {medicament.nom}</h2>
            <p className="text-muted-foreground mt-1">Liste des prescriptions associées à ce médicament</p>
          </div>
        </div>

        {/* Informations du médicament */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Pill className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-primary">{medicament.nom}</h3>
              {medicament.description && <p className="text-foreground/80 mt-1">{medicament.description}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <Link href={`/dashboard/medicaments/${id}`}>
                <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                  Modifier le médicament
                </Button>
              </Link>
              <Link href={`/dashboard/prescriptions/nouvelle?medicament=${id}`}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nouvelle prescription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Liste des prescriptions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Liste des prescriptions
              <span className="ml-2 bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                {prescriptions.length}
              </span>
            </h3>
          </div>

          {prescriptions.length === 0 ? (
            <Card className="border-dashed border-2 border-primary/20">
              <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">Aucune prescription</h3>
                <p className="mb-6 text-muted-foreground max-w-md">
                  Ce médicament n'a pas encore de prescriptions associées.
                </p>
                <Link href={`/dashboard/prescriptions/nouvelle?medicament=${id}`}>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Créer une prescription
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <Card
                  key={prescription.id}
                  className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/30"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-primary/70" />
                          <h4 className="font-bold text-primary">
                            {prescription.resident.nom} {prescription.resident.prenom}
                          </h4>
                          <Badge
                            variant={isActive(prescription) ? "default" : "outline"}
                            className={
                              isActive(prescription)
                                ? "bg-accent/80 text-accent-foreground hover:bg-accent"
                                : "bg-muted/50"
                            }
                          >
                            {isActive(prescription) ? "Active" : "Terminée"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {prescription.resident.etablissement.nom} - Chambre {prescription.resident.chambre}, Étage{" "}
                          {prescription.resident.etage}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary/70" />
                            <div>
                              <span className="text-xs text-muted-foreground">Période</span>
                              <p className="text-sm">
                                Du {formatDate(prescription.dateDebut)}
                                {prescription.dateFin ? ` au ${formatDate(prescription.dateFin)}` : " (en cours)"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary/70" />
                            <div>
                              <span className="text-xs text-muted-foreground">Moments de prise</span>
                              <p className="text-sm">{formatMomentsPrise(prescription)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-muted/30 rounded-md">
                          <span className="text-xs text-muted-foreground">Posologie</span>
                          <p className="text-sm font-medium">{prescription.posologie}</p>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 justify-end">
                        <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                          <Button
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
                          >
                            Modifier
                          </Button>
                        </Link>
                        <Link href={`/dashboard/etiquettes?prescription=${prescription.id}`}>
                          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            Imprimer étiquette
                          </Button>
                        </Link>
                      </div>
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
          <Link href="/dashboard/medicaments">
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
              Impossible de charger les informations du médicament ou de ses prescriptions.
            </p>
            <div className="flex justify-center mt-6">
              <Link href="/dashboard/medicaments">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour à la liste des médicaments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}
