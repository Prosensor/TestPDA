"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export default function DebugEtablissementsPage() {
  const [etablissements, setEtablissements] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchId, setSearchId] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searchError, setSearchError] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    fetchEtablissements()
  }, [])

  const fetchEtablissements = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/debug/etablissements")
      const data = await response.json()

      if (response.ok) {
        setEtablissements(data.etablissements || [])
      } else {
        setError(data.message || "Erreur lors de la récupération des établissements")
      }
    } catch (err) {
      setError("Erreur de connexion à l'API")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const searchEtablissement = async () => {
    if (!searchId.trim()) {
      setSearchError("Veuillez entrer un ID")
      return
    }

    setSearchLoading(true)
    setSearchError("")
    setSearchResult(null)

    try {
      const response = await fetch("/api/debug/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: searchId }),
      })

      const data = await response.json()

      if (response.ok) {
        setSearchResult(data)
      } else {
        setSearchError(data.message || "Établissement non trouvé")
        setSearchResult(data) // Conserver les données de diagnostic même en cas d'erreur
      }
    } catch (err) {
      setSearchError("Erreur de connexion à l'API")
      console.error(err)
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold text-primary">Débogage des établissements</h2>
      </div>

      {/* Recherche par ID */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un établissement par ID</CardTitle>
          <CardDescription>Entrez l'ID d'un établissement pour vérifier s'il existe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="searchId">ID de l'établissement</Label>
                <Input
                  id="searchId"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Entrez l'ID de l'établissement"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={searchEtablissement} disabled={searchLoading}>
                  {searchLoading ? "Recherche..." : "Rechercher"}
                </Button>
              </div>
            </div>

            {searchError && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
                {searchError}
              </div>
            )}

            {searchResult && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Résultat de la recherche :</h3>
                <pre className="p-4 bg-muted rounded-md overflow-auto max-h-60">
                  {JSON.stringify(searchResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des établissements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des établissements</CardTitle>
          <CardDescription>Tous les établissements dans la base de données</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
              {error}
            </div>
          ) : etablissements.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucun établissement trouvé dans la base de données.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <h3 className="font-bold">Total : {etablissements.length} établissement(s)</h3>
                <Button variant="outline" size="sm" onClick={fetchEtablissements}>
                  Rafraîchir
                </Button>
              </div>

              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Adresse</th>
                      <th className="px-4 py-2 text-left">Téléphone</th>
                      <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etablissements.map((etablissement) => (
                      <tr key={etablissement.id} className="border-t">
                        <td className="px-4 py-2 font-mono text-xs">{etablissement.id}</td>
                        <td className="px-4 py-2">{etablissement.nom}</td>
                        <td className="px-4 py-2">{etablissement.adresse || "-"}</td>
                        <td className="px-4 py-2">{etablissement.telephone || "-"}</td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setSearchId(etablissement.id)}>
                              Copier l'ID
                            </Button>
                            <Link href={`/dashboard/etablissements/${etablissement.id}`}>
                              <Button size="sm">Voir</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <h3 className="font-bold mb-2">Structure attendue de l'ID :</h3>
              <p className="text-muted-foreground">
                Prisma utilise généralement des IDs au format CUID (ex: clfz2x3ve0003uu3o2r0nhj9l) ou UUID (ex:
                123e4567-e89b-12d3-a456-426614174000). Vérifiez que l'ID utilisé correspond bien à ce format.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Routes API :</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">/api/etablissements</code> - Liste tous les
                  établissements
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">/api/etablissements/[id]</code> - Récupère un
                  établissement spécifique
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded">/api/debug/etablissements</code> - Route de débogage
                  (cette page)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
