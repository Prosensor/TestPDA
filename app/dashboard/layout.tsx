import type React from "react"
import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

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
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-gray-50">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Pharmacie Mozart</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-100">
                Tableau de bord
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link href="/dashboard/users" className="block p-2 rounded hover:bg-gray-100">
                  Gestion des utilisateurs
                </Link>
              </li>
            )}
            <li>
              <Link href="/api/auth/signout" className="block p-2 rounded hover:bg-gray-100">
                Déconnexion
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
