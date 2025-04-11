"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function CreateUserPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Une erreur est survenue")
      }

      router.push("/dashboard/admin")
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Une erreur est survenue")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pharmacie Mozart - Administration</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin">
              <Button variant="outline">Retour</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Créer un utilisateur</h2>
          <Card>
            <CardHeader>
              <CardTitle>Nouvel utilisateur</CardTitle>
              <CardDescription>Créez un nouvel utilisateur pour l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom de l'utilisateur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    required
                  />
                </div>
                {error && <p className="text-sm font-medium text-red-500">{error}</p>}
                <div className="flex justify-end gap-2">
                  <Link href="/dashboard/admin">
                    <Button variant="outline" type="button">
                      Annuler
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Création en cours..." : "Créer l'utilisateur"}
                  </Button>
                </div>
              </form>
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
