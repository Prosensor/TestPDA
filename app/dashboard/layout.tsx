import type React from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LayoutDashboard, Building, Users, Pill, FileText, Printer, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session.user?.email === "pharmaciemozart@gmail.com"

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Version desktop */}
      <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-sm hidden md:block">
        <div className="p-6 border-b border-sidebar-border">
          <h2 className="text-2xl font-bold">Pharmacie Mozart</h2>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Gestion des étiquettes PDA</p>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <Link href="/dashboard" className="nav-link">
              <LayoutDashboard className="h-5 w-5" />
              <span>Tableau de bord</span>
            </Link>
          </div>

          <div className="mt-6">
            <h3 className="px-4 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
              Gestion
            </h3>
            <div className="space-y-1">
              <Link href="/dashboard/etablissements" className="nav-link">
                <Building className="h-5 w-5" />
                <span>Établissements</span>
              </Link>
              <Link href="/dashboard/residents" className="nav-link">
                <Users className="h-5 w-5" />
                <span>Résidents</span>
              </Link>
              <Link href="/dashboard/medicaments" className="nav-link">
                <Pill className="h-5 w-5" />
                <span>Médicaments</span>
              </Link>
              <Link href="/dashboard/prescriptions" className="nav-link">
                <FileText className="h-5 w-5" />
                <span>Prescriptions</span>
              </Link>
              <Link href="/dashboard/etiquettes" className="nav-link">
                <Printer className="h-5 w-5" />
                <span>Étiquettes PDA</span>
                <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                  Imprimer
                </span>
              </Link>
            </div>
          </div>

          {isAdmin && (
            <div className="mt-6">
              <h3 className="px-4 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-2">
                Administration
              </h3>
              <div className="space-y-1">
                <Link href="/dashboard/users" className="nav-link">
                  <Users className="h-5 w-5" />
                  <span>Utilisateurs</span>
                </Link>
                <Link href="/dashboard/admin" className="nav-link">
                  <Settings className="h-5 w-5" />
                  <span>Paramètres</span>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-sidebar-border">
            <Link
              href="/api/auth/signout"
              className="nav-link text-sidebar-foreground/80 hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>Déconnexion</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t shadow-md md:hidden">
        <div className="flex justify-around">
          <Link href="/dashboard" className="flex flex-col items-center p-3 text-primary">
            <LayoutDashboard className="h-6 w-6" />
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          <Link href="/dashboard/etablissements" className="flex flex-col items-center p-3 text-primary">
            <Building className="h-6 w-6" />
            <span className="text-xs mt-1">Établissements</span>
          </Link>
          <Link href="/dashboard/residents" className="flex flex-col items-center p-3 text-primary">
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Résidents</span>
          </Link>
          <Link href="/dashboard/etiquettes" className="flex flex-col items-center p-3 text-accent">
            <Printer className="h-6 w-6" />
            <span className="text-xs mt-1">Étiquettes</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b shadow-sm p-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary md:hidden">Pharmacie Mozart</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm text-primary font-medium">
                  Connecté en tant que <span className="font-bold">{session.user?.name || session.user?.email}</span>
                </span>
              </div>
              <Link href="/dashboard/etiquettes" className="md:hidden">
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                  <Printer className="h-4 w-4 mr-1" />
                  Étiquettes
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
