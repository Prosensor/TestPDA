import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-blue-50">
      <header className="px-6 py-4 border-b bg-white shadow-sm">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Pharmacie Mozart</h1>
          <div>
            {session ? (
              <Link href="/dashboard">
                <Button className="rounded-full bg-primary hover:bg-primary/90">Accéder au Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="rounded-full bg-primary hover:bg-primary/90">Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Portail sécurisé
              </div>
              <div className="space-y-3 max-w-3xl">
                <h2 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                  Bienvenue sur le portail de la <span className="text-accent">Pharmacie Mozart</span>
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Connectez-vous pour accéder à votre espace personnel sécurisé et gérer les étiquettes PDA.
                </p>
              </div>
              {!session ? (
                <Link href="/login">
                  <Button size="lg" className="mt-6 rounded-full bg-primary hover:bg-primary/90 px-8">
                    Se connecter
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button size="lg" className="mt-6 rounded-full bg-primary hover:bg-primary/90 px-8">
                    Accéder au Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t bg-white">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <p className="text-sm text-gray-500">© 2025 Pharmacie Mozart. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
