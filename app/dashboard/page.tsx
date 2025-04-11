import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"
import { PrinterIcon, UsersIcon, HomeIcon, PillIcon } from "lucide-react"

const prisma = new PrismaClient()

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Récupérer quelques statistiques pour le tableau de bord
  const etablissementsCount = await prisma.etablissement.count()
  const residentsCount = await prisma.resident.count()
  const medicamentsCount = await prisma.medicament.count()
  const prescriptionsCount = await prisma.prescription.count()

  const isAdmin = session.user?.email === "pharmaciemozart@gmail.com"

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pharmacie Mozart</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">Connecté en tant que {session.user?.name || session.user?.email}</span>
            <Link href="/api/auth/signout">
              <Button variant="outline">Déconnexion</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Tableau de bord</h2>
            {isAdmin && (
              <Link href="/dashboard/admin">
                <Button>Administration</Button>
              </Link>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Établissements</CardTitle>
                <HomeIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{etablissementsCount}</div>
                <p className="text-xs text-muted-foreground">Maisons de retraite enregistrées</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Résidents</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{residentsCount}</div>
                <p className="text-xs text-muted-foreground">Résidents enregistrés</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Médicaments</CardTitle>
                <PillIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{medicamentsCount}</div>
                <p className="text-xs text-muted-foreground">Médicaments enregistrés</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                <PrinterIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptionsCount}</div>
                <p className="text-xs text-muted-foreground">Prescriptions actives</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full lg:col-span-2">
              <CardHeader>
                <CardTitle>Gestion des étiquettes PDA</CardTitle>
                <CardDescription>Gérez et imprimez les étiquettes PDA pour les maisons de retraite</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Link href="/dashboard/etablissements">
                    <Button variant="outline" className="w-full justify-start">
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Gérer les établissements
                    </Button>
                  </Link>
                  <Link href="/dashboard/residents">
                    <Button variant="outline" className="w-full justify-start">
                      <UsersIcon className="mr-2 h-4 w-4" />
                      Gérer les résidents
                    </Button>
                  </Link>
                  <Link href="/dashboard/medicaments">
                    <Button variant="outline" className="w-full justify-start">
                      <PillIcon className="mr-2 h-4 w-4" />
                      Gérer les médicaments
                    </Button>
                  </Link>
                  <Link href="/dashboard/prescriptions">
                    <Button variant="outline" className="w-full justify-start">
                      <PrinterIcon className="mr-2 h-4 w-4" />
                      Gérer les prescriptions
                    </Button>
                  </Link>
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/etiquettes">
                    <Button className="w-full">
                      <PrinterIcon className="mr-2 h-4 w-4" />
                      Imprimer les étiquettes PDA
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>Informations sur votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Nom: {session.user?.name || "Non défini"}</p>
                  <p className="text-sm font-medium">Email: {session.user?.email}</p>
                  <p className="text-sm font-medium">Rôle: {isAdmin ? "Administrateur" : "Pharmacien"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <p className="text-sm text-gray-500">© 2025 Pharmacie Mozart. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
