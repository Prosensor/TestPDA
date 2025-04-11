"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function NouvelEtablissementPage() {
  const router = useRouter()
  const [nom, setNom] = useState("")
  const [adresse, setAdresse] = useState("")
  const [telephone, setTelephone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          adresse,
          telephone,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Une erreur est survenue")
      }

      router.push("/dashboard/etablissements")
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
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/etablissements" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold">Nouvel établissement</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations de l'établissement</CardTitle>
          <CardDescription>Ajoutez un nouvel établissement pour gérer ses résidents</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom de l'établissement *</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom de l'établissement"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse complète"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Numéro de téléphone"
              />
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Link href="/dashboard/etablissements">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer l'établissement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
