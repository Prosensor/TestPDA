import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PrismaClient } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  PlusIcon,
  FileText,
  SearchIcon,
  FilterIcon,
  User,
  Pill,
  Calendar,
  Clock,
  Building,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const prisma = new PrismaClient()

export default async function PrescriptionsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const prescriptions = await prisma.prescription.findMany({
    orderBy: [{ dateDebut: "desc" }, { residentId: "asc" }],
    include: {
      resident: {
        include: {
          etablissement: true,
        },
      },
      medicament: true,
    },
  })

  const etablissements = await prisma.etablissement.findMany({
    orderBy: {
      nom: "asc",
    },
  })

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd MMM yyyy", { locale: fr })
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

  // Vérifier si une prescription est active
  const isActive = (prescription: any) => {
    const now = new Date()
    const dateDebut = new Date(prescription.dateDebut)
    const dateFin = prescription.dateFin ? new Date(prescription.dateFin) : null

    return dateDebut <= now && (!dateFin || dateFin >= now)
  }

  // Compter les prescriptions actives
  const activePrescriptionsCount = prescriptions.filter((p) => isActive(p)).length

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestion des prescriptions</h2>
          <p className="text-muted-foreground mt-1">Gérez les prescriptions médicamenteuses pour les résidents</p>
        </div>

        <Link href="/dashboard/prescriptions/nouvelle">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nouvelle prescription
          </Button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">Recherche et filtres</CardTitle>
          <CardDescription>Filtrez les prescriptions par établissement, statut ou recherchez par nom</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un résident ou un médicament..."
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
            <div className="w-full md:w-48">
              <Select>
                <SelectTrigger className="border-primary/20 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Tous les statuts" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="actives">Prescriptions actives</SelectItem>
                  <SelectItem value="terminees">Prescriptions terminées</SelectItem>
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total des prescriptions</p>
                <h3 className="text-2xl font-bold text-primary mt-1">{prescriptions.length}</h3>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prescriptions actives</p>
                <h3 className="text-2xl font-bold text-accent mt-1">{activePrescriptionsCount}</h3>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/20 border-muted/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prescriptions terminées</p>
                <h3 className="text-2xl font-bold text-muted-foreground mt-1">
                  {prescriptions.length - activePrescriptionsCount}
                </h3>
              </div>
              <div className="w-12 h-12 bg-muted/30 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des prescriptions */}
      {prescriptions.length === 0 ? (
        <Card className="border-dashed border-2 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Aucune prescription</h3>
            <p className="mb-6 text-muted-foreground max-w-md">
              Vous n'avez pas encore ajouté de prescription. Commencez par ajouter votre première prescription pour un
              résident.
            </p>
            <Link href="/dashboard/prescriptions/nouvelle">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter une prescription
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <Card
              key={prescription.id}
              className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
                isActive(prescription) ? "hover:border-accent/30" : "hover:border-primary/30"
              }`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Barre latérale indiquant le statut */}
                  <div
                    className={`w-full md:w-1.5 h-1.5 md:h-auto ${isActive(prescription) ? "bg-accent" : "bg-muted"}`}
                  ></div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive(prescription) ? "bg-accent/10" : "bg-muted/30"
                            }`}
                          >
                            <Pill
                              className={`h-5 w-5 ${isActive(prescription) ? "text-accent" : "text-muted-foreground"}`}
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-lg">{prescription.medicament.nom}</h4>
                          <p className="text-sm text-muted-foreground">{prescription.posologie}</p>
                        </div>
                        <Badge
                          variant={isActive(prescription) ? "default" : "outline"}
                          className={
                            isActive(prescription)
                              ? "bg-accent/80 text-accent-foreground hover:bg-accent ml-2"
                              : "bg-muted/50 ml-2"
                          }
                        >
                          {isActive(prescription) ? "Active" : "Terminée"}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/dashboard/prescriptions/${prescription.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            Modifier
                          </Button>
                        </Link>
                        <Link href={`/dashboard/etiquettes?prescription=${prescription.id}`}>
                          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                            Imprimer étiquette
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 text-primary/70 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground">Résident</span>
                          <p className="text-sm font-medium">
                            {prescription.resident.nom} {prescription.resident.prenom}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Chambre {prescription.resident.chambre}, Étage {prescription.resident.etage}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Building className="h-4 w-4 text-primary/70 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground">Établissement</span>
                          <p className="text-sm font-medium">{prescription.resident.etablissement.nom}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-4 w-4 text-primary/70 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground">Période</span>
                          <p className="text-sm font-medium">
                            Du {formatDate(prescription.dateDebut)}
                            {prescription.dateFin ? ` au ${formatDate(prescription.dateFin)}` : " (en cours)"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary/70" />
                        <span className="text-xs text-muted-foreground">Moments de prise:</span>
                        <span className="text-sm font-medium">{formatMomentsPrise(prescription)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {prescriptions.length > 0 && (
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
          <CardDescription>Comment gérer vos prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-primary">Ajouter une prescription</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Cliquez sur "Nouvelle prescription" et remplissez les informations requises.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-primary">Modifier une prescription</h4>
              </div>
              <p className="text-sm text-muted-foreground ml-11">
                Cliquez sur "Modifier" pour mettre à jour les informations d'une prescription existante.
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
                Cliquez sur "Imprimer étiquette" pour générer une étiquette PDA pour la prescription.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
