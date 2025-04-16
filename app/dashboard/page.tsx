import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrinterIcon, UsersIcon, HomeIcon, FileTextIcon, ArrowRightIcon, ClipboardListIcon } from "lucide-react"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session.user?.email === "pharmaciemozart@gmail.com"

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Bienvenue, {session.user?.name || "Pharmacien"}</h2>
          <p className="text-muted-foreground mt-1">Gérez vos étiquettes PDA et vos prescriptions</p>
        </div>

        <div className="flex gap-3">
          {isAdmin && (
            <Link href="/dashboard/admin">
              <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                Administration
              </Button>
            </Link>
          )}
          <Link href="/dashboard/etiquettes">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <PrinterIcon className="mr-2 h-4 w-4" />
              Imprimer des étiquettes
            </Button>
          </Link>
        </div>
      </div>

      {/* Accès rapide */}
      <section>
        <h3 className="text-xl font-bold text-primary mb-4">Accès rapide</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard/etiquettes" className="block">
            <Card className="h-full hover:shadow-md transition-shadow border-accent/20 hover:border-accent">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                  <PrinterIcon className="h-6 w-6 text-accent" />
                </div>
                <h4 className="font-bold text-primary">Imprimer des étiquettes</h4>
                <p className="text-sm text-muted-foreground mt-1">Générer des étiquettes PDA</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/prescriptions" className="block">
            <Card className="h-full hover:shadow-md transition-shadow border-primary/20 hover:border-primary/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <FileTextIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-primary">Prescriptions</h4>
                <p className="text-sm text-muted-foreground mt-1">Gérer les prescriptions</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/residents" className="block">
            <Card className="h-full hover:shadow-md transition-shadow border-primary/20 hover:border-primary/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <UsersIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-primary">Résidents</h4>
                <p className="text-sm text-muted-foreground mt-1">Gérer les résidents</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/etablissements" className="block">
            <Card className="h-full hover:shadow-md transition-shadow border-primary/20 hover:border-primary/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <HomeIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-bold text-primary">Établissements</h4>
                <p className="text-sm text-muted-foreground mt-1">Gérer les établissements</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Flux de travail */}
      <section>
        <h3 className="text-xl font-bold text-primary mb-4">Flux de travail</h3>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-bold text-primary">Sélectionner un établissement</h4>
                </div>
                <p className="text-muted-foreground ml-11">
                  Choisissez l'établissement pour lequel vous souhaitez imprimer des étiquettes.
                </p>
              </div>

              <div className="hidden md:block text-muted-foreground self-center">
                <ArrowRightIcon className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-bold text-primary">Sélectionner les résidents</h4>
                </div>
                <p className="text-muted-foreground ml-11">
                  Choisissez les résidents pour lesquels vous souhaitez imprimer des étiquettes.
                </p>
              </div>

              <div className="hidden md:block text-muted-foreground self-center">
                <ArrowRightIcon className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-bold text-primary">Imprimer les étiquettes</h4>
                </div>
                <p className="text-muted-foreground ml-11">
                  Générez et imprimez les étiquettes PDA pour les prescriptions sélectionnées.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/dashboard/etiquettes">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <PrinterIcon className="mr-2 h-4 w-4" />
                  Commencer l'impression
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Aide rapide */}
      <section>
        <h3 className="text-xl font-bold text-primary mb-4">Aide rapide</h3>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardListIcon className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-primary">Comment ajouter une prescription ?</h4>
                </div>
                <ol className="list-decimal ml-8 text-sm text-muted-foreground space-y-1">
                  <li>Allez dans la section "Prescriptions"</li>
                  <li>Cliquez sur "Nouvelle prescription"</li>
                  <li>Remplissez les informations requises</li>
                  <li>Cliquez sur "Créer la prescription"</li>
                </ol>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardListIcon className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-primary">Comment imprimer des étiquettes ?</h4>
                </div>
                <ol className="list-decimal ml-8 text-sm text-muted-foreground space-y-1">
                  <li>Allez dans la section "Étiquettes PDA"</li>
                  <li>Sélectionnez un établissement</li>
                  <li>Sélectionnez les résidents</li>
                  <li>Sélectionnez les prescriptions</li>
                  <li>Cliquez sur "Imprimer les étiquettes"</li>
                </ol>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <ClipboardListIcon className="h-5 w-5 text-primary" />
                  <h4 className="font-bold text-primary">Comment ajouter un résident ?</h4>
                </div>
                <ol className="list-decimal ml-8 text-sm text-muted-foreground space-y-1">
                  <li>Allez dans la section "Résidents"</li>
                  <li>Cliquez sur "Nouveau résident"</li>
                  <li>Remplissez les informations requises</li>
                  <li>Cliquez sur "Créer le résident"</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
