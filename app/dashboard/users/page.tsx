import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  // Vérifier si l'utilisateur est un administrateur
  if (session.user?.email !== "pharmaciemozart@gmail.com") {
    redirect("/dashboard")
  }

  // Récupérer la liste des utilisateurs
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
    },
  })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pharmacie Mozart - Administration</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Retour au tableau de bord</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Gestion des utilisateurs</h2>
            <Link href="/dashboard/admin/create-user">
              <Button>Créer un utilisateur</Button>
            </Link>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <CardDescription>Gérez les utilisateurs de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Vérifié</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="px-4 py-2">{user.name || "-"}</td>
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.emailVerified ? "Oui" : "Non"}</td>
                        <td className="px-4 py-2 text-right">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
