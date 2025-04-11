"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

type Etablissement = {
  id: string
  nom: string
}

export default function NouveauResidentPage() {
  const router = useRouter()
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [chambre, setChambre] = useState("")
  const [etage, setEtage] = useState("")
  const [etablissementId, setEtablissementId] = useState("")
  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await fetch("/api/etablissements")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des établissements")
        }
        const data = await response.json()
        setEtablissements(data.etablissements)
      } catch (error) {
        console.error("Erreur:", error)
      }
    }

    fetchEtablissements()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/residents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          prenom,
          chambre,
          etage,
          etablissementId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Une erreur est survenue")
      }

      router.push("/dashboard/residents")
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
        <Link href="/dashboard/residents" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold">Nouveau résident</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations du résident</CardTitle>
          <CardDescription>Ajoutez un nouveau résident pour gérer ses prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom du résident"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom du résident"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chambre">Chambre *</Label>
                <Input
                  id="chambre"
                  value={chambre}
                  onChange={(e) => setChambre(e.target.value)}
                  placeholder="Numéro de chambre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="etage">Étage *</Label>
                <Input
                  id="etage"
                  value={etage}
                  onChange={(e) => setEtage(e.target.value)}
                  placeholder="Étage"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="etablissement">Établissement *</Label>
              <Select value={etablissementId} onValueChange={setEtablissementId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un établissement" />
                </SelectTrigger>
                <SelectContent>
                  {etablissements.map((etablissement) => (
                    <SelectItem key={etablissement.id} value={etablissement.id}>
                      {etablissement.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {etablissements.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Aucun établissement disponible.{" "}
                  <Link href="/dashboard/etablissements/nouveau" className="text-primary hover:underline">
                    Ajouter un établissement
                  </Link>
                </p>
              )}
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Link href="/dashboard/residents">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading || etablissements.length === 0}>
                {isLoading ? "Création en cours..." : "Créer le résident"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
