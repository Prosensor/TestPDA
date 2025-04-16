"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import {
  ArrowLeftIcon,
  Building,
  MapPin,
  Phone,
  SaveIcon,
  AlertCircle,
  Trash2Icon,
  Users,
  PlusIcon,
  BugIcon,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ModifierEtablissementPage() {
  const router = useRouter()
  const params = useParams()
  // Convertir params.id en string si c'est un tableau
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string)

  const [nom, setNom] = useState("")
  const [adresse, setAdresse] = useState("")
  const [telephone, setTelephone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    // Récupérer les informations de l'établissement via la route de débogage
    const fetchEtablissement = async () => {
      try {
        console.log("Tentative de récupération de l'établissement avec ID:", id)
        console.log("Type de l'ID:", typeof id)

        // Vérifier si l'ID est valide
        if (!id) {
          console.error("ID invalide:", id)
          setError("ID d'établissement invalide")
          setInitialLoading(false)
          return
        }

        // Utiliser la route de débogage pour tester
        const response = await fetch("/api/debug/etablissements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })

        console.log("Statut de la réponse:", response.status)

        const data = await response.json()
        console.log("Données reçues:", data)

        setDebugInfo(data)

        if (!response.ok) {
          throw new Error(data.message || "Établissement non trouvé")
        }

        if (!data.etablissement) {
          throw new Error("Format de données incorrect")
        }

        setNom(data.etablissement.nom)
        setAdresse(data.etablissement.adresse || "")
        setTelephone(data.etablissement.telephone || "")
      } catch (error) {
        console.error("Erreur complète:", error)
        setError(error instanceof Error ? error.message : "Impossible de charger les informations de l'établissement")
      } finally {
        setInitialLoading(false)
      }
    }

    if (id) {
      fetchEtablissement()
    } else {
      setInitialLoading(false)
      setError("ID d'établissement manquant")
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Soumission du formulaire avec les données:", { nom, adresse, telephone })
      console.log("ID de l'établissement:", id)

      // Utiliser la route de débogage qui fonctionne
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

      console.log("Statut de la réponse:", response.status)

      let responseData = {}
      try {
        responseData = await response.json()
        console.log("Données de réponse:", responseData)
      } catch (jsonError) {
        console.error("Erreur lors du parsing de la réponse:", jsonError)
      }

      if (!response.ok) {
        throw new Error((responseData as any).message || "Une erreur est survenue")
      }

      setSuccess("Établissement modifié avec succès")
      setTimeout(() => {
        router.push("/dashboard/etablissements")
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error("Erreur complète lors de la soumission:", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Une erreur est survenue")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/etablissements/${encodeURIComponent(id)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Une erreur est survenue")
      }

      router.push("/dashboard/etablissements")
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Une erreur est survenue lors de la suppression")
      }
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Si nous avons une erreur et aucune donnée, afficher un message d'erreur avec un bouton de retour
  if (error && !nom) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/etablissements">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-primary">Établissement non trouvé</h2>
        </div>

        <Card className="max-w-2xl mx-auto border-primary/20 shadow-sm">
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            {debugInfo && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Informations de débogage :</h3>
                <pre className="p-4 bg-muted rounded-md overflow-auto max-h-60 text-xs">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <Link href="/dashboard/debug/etablissements">
                <Button variant="outline" className="border-primary/20 text-primary">
                  <BugIcon className="mr-2 h-4 w-4" />
                  Page de débogage
                </Button>
              </Link>

              <Link href="/dashboard/etablissements">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour à la liste des établissements
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/etablissements">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold text-primary">Modifier l'établissement</h2>
      </div>

      {/* Formulaire */}
      <Card className="max-w-2xl mx-auto border-primary/20 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-primary">Informations de l'établissement</CardTitle>
              <CardDescription>Modifiez les informations de l'établissement</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-accent/10 border-accent/30">
              <AlertDescription className="text-accent-foreground">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-primary font-medium">
                Nom de l'établissement *
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom de l'établissement"
                  className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse" className="text-primary font-medium">
                Adresse
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Adresse complète"
                  className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-primary font-medium">
                Téléphone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="Numéro de téléphone"
                  className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir supprimer cet établissement ? Cette action est irréversible et supprimera
                      également tous les résidents associés.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                          Suppression...
                        </>
                      ) : (
                        "Supprimer définitivement"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex gap-3">
                <Link href="/dashboard/etablissements">
                  <Button
                    variant="outline"
                    type="button"
                    className="border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Accès rapide */}
      <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary text-lg">Accès rapide</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/dashboard/etablissements/${id}/residents`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
              >
                <Users className="mr-2 h-4 w-4" />
                Voir les résidents
              </Button>
            </Link>
            <Link href={`/dashboard/residents/nouveau?etablissement=${id}`} className="flex-1">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusIcon className="mr-2 h-4 w-4" />
                Ajouter un résident
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            <Link href="/dashboard/debug/etablissements">
              <Button variant="outline" size="sm" className="w-full border-primary/20 text-primary">
                <BugIcon className="mr-2 h-4 w-4" />
                Outils de débogage
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
