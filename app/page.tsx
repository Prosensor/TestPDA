import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pharmacie Mozart</h1>
          <div>
            {session ? (
              <Link href="/dashboard">
                <Button>Accéder au Dashboard</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Bienvenue sur le portail de la Pharmacie Mozart
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Connectez-vous pour accéder à votre espace personnel sécurisé.
                </p>
              </div>
              {!session && (
                <Link href="/login">
                  <Button size="lg" className="mt-6">
                    Se connecter
                  </Button>
                </Link>
              )}
              {session && (
                <Link href="/dashboard">
                  <Button size="lg" className="mt-6">
                    Accéder au Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <p className="text-sm text-gray-500">© 2025 Pharmacie Mozart. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
