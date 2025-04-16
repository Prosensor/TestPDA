"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function DebugUpdateEtablissementPage() {
  const [id, setId] = useState("")
  const [nom, setNom] = useState("")
  const [adresse, setAdresse] = useState("")
  const [telephone, setTelephone] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id.trim()) {
      setError("Veuillez entrer un ID")
      return
    }

    if (!nom.trim()) {
      setError("Veuillez entrer un nom")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/debug/etablissements/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          nom,
          adresse,
          telephone,
        }),
      })

      const data = await response.json()
      setResult(data)

      if (!response.ok) {
        setError(data.message || "Une erreur est survenue")
      }
    } catch (err) {
      setError("Erreur de connexion à l'API")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEtablissement = async () => {
    if (!id.trim()) {
      setError("Veuillez entrer un ID")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/debug/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (response.ok && data.etablissement) {
        setNom(data.etablissement.nom || "")
        setAdresse(data.etablissement.adresse || "")
        setTelephone(data.etablissement.telephone || "")
        setResult({
          message: "Établissement récupéré avec succès",
          etablissement: data.etablissement,
        })
      } else {
        setError(data.message || "Établissement non trouvé")
        setResult(data)
      }
    } catch (err) {
      setError("Erreur de connexion à l'API")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/debug/etablissements">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold text-primary">Débogage - Mise à jour d'établissement</h2>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Test de mise à jour d'un établissement</CardTitle>
          <CardDescription>Utilisez ce formulaire pour tester la mise à jour d'un établissement</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="id">ID de l'établissement *</Label>
              <div className="flex gap-2">
                <Input
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="ID de l'établissement"
                  className="flex-1"
                  required
                />
                <Button type="button" onClick={fetchEtablissement} disabled={loading}>
                  Récupérer
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
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
                placeholder="Adresse de l'établissement"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Téléphone de l'établissement"
              />
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Traitement en cours..." : "Tester la mise à jour"}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">Résultat :</h3>
              <pre className="p-4 bg-muted rounded-md overflow-auto max-h-60">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations de débogage */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de débogage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Processus de mise à jour :</h3>
              <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                <li>Récupérer l'établissement existant avec l'ID fourni</li>
                <li>Vérifier que l'établissement existe</li>
                <li>Mettre à jour les champs avec les nouvelles valeurs</li>
                <li>Enregistrer les modifications dans la base de données</li>
              </ol>
            </div>

            <div>
              <h3 className="font-bold mb-2">Erreurs courantes :</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>ID invalide ou inexistant</li>
                <li>Nom manquant (champ obligatoire)</li>
                <li>Erreur de connexion à la base de données</li>
                <li>Problème de format des données</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Routes API :</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">/api/etablissements/[id]</code> (PUT) - Route
                  principale pour la mise à jour
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">/api/debug/etablissements/update</code> (POST) - Route
                  de débogage (cette page)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
