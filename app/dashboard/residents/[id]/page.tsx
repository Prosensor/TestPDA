"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  ArrowLeftIcon,
  User,
  Building,
  BedIcon,
  SquareStackIcon as StairsIcon,
  SaveIcon,
  AlertCircle,
  Trash2Icon,
  FileTextIcon,
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

type Etablissement = {
  id: string
  nom: string
}

type Resident = {
  id: string
  nom: string
  prenom: string
  chambre: string
  etage: string
  etablissementId: string
  etablissement: {
    nom: string
  }
  _count?: {
    prescriptions: number
  }
}

export default function ModifierResidentPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string)

  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [chambre, setChambre] = useState("")
  const [etage, setEtage] = useState("")
  const [etablissementId, setEtablissementId] = useState("")
  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [prescriptionCount, setPrescriptionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await fetch("/api/etablissements")
        if (!response.ok) throw new Error("Erreur lors de la récupération des établissements")
        const data = await response.json()
        setEtablissements(data.etablissements)
      } catch (error) {
        console.error("Erreur:", error)
      }
    }

    const fetchResident = async () => {
      try {
        const response = await fetch(`/api/residents/${id}`)
        if (!response.ok) throw new Error("Erreur lors de la récupération du résident")
        const data = await response.json()

        const resident = data.resident as Resident
        setNom(resident.nom)
        setPrenom(resident.prenom)
        setChambre(resident.chambre)
        setEtage(resident.etage)
        setEtablissementId(resident.etablissementId)
        setPrescriptionCount(resident._count?.prescriptions || 0)
      } catch (error) {
        console.error("Erreur:", error)
        setError("Impossible de charger les informations du résident")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchEtablissements()
    if (id) {
      fetchResident()
    } else {
      setInitialLoading(false)
      setError("ID de résident manquant")
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/residents/${id}`, {
        method: "PUT",
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

      setSuccess("Résident modifié avec succès")
      setTimeout(() => {
        router.push("/dashboard/residents")
        router.refresh()
      }, 1000)
    } catch (error) {
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
      const response = await fetch(`/api/residents/${id}`, {
        method: "DELETE",
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

  if (error && !nom) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/residents">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-primary">Résident non trouvé</h2>
        </div>

        <Card className="max-w-2xl mx-auto border-primary/20 shadow-sm">
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex justify-end mt-4">
              <Link href="/dashboard/residents">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour à la liste des résidents
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
        <Link href="/dashboard/residents">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold text-primary">Modifier le résident</h2>
      </div>

      {/* Formulaire */}
      <Card className="max-w-2xl mx-auto border-primary/20 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-primary">Informations du résident</CardTitle>
              <CardDescription>Modifiez les informations du résident</CardDescription>
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
              <Label htmlFor="etablissement" className="text-primary font-medium">
                Établissement *
              </Label>
              <Select value={etablissementId} onValueChange={setEtablissementId} required>
                <SelectTrigger className="border-primary/20 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sélectionner un établissement" />
                  </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nom" className="text-primary font-medium">
                  Nom *
                </Label>
                <Input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom du résident"
                  className="border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenom" className="text-primary font-medium">
                  Prénom *
                </Label>
                <Input
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom du résident"
                  className="border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="chambre" className="text-primary font-medium">
                  Chambre *
                </Label>
                <div className="relative">
                  <BedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="chambre"
                    value={chambre}
                    onChange={(e) => setChambre(e.target.value)}
                    placeholder="Numéro de chambre"
                    className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="etage" className="text-primary font-medium">
                  Étage *
                </Label>
                <div className="relative">
                  <StairsIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="etage"
                    value={etage}
                    onChange={(e) => setEtage(e.target.value)}
                    placeholder="Étage"
                    className="pl-10 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
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
                      Êtes-vous sûr de vouloir supprimer ce résident ? Cette action est irréversible et supprimera
                      également toutes les prescriptions associées.
                      {prescriptionCount > 0 && (
                        <div className="mt-2 font-medium text-destructive">
                          Attention : Ce résident a {prescriptionCount} prescription{prescriptionCount > 1 ? "s" : ""}{" "}
                          qui seront également supprimées.
                        </div>
                      )}
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
                <Link href="/dashboard/residents">
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
                  disabled={isLoading || etablissements.length === 0}
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
            <Link href={`/dashboard/residents/${id}/prescriptions`} className="flex-1">
              <Button
                variant="outline"
                className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30"
              >
                <FileTextIcon className="mr-2 h-4 w-4" />
                Voir les prescriptions
              </Button>
            </Link>
            <Link href={`/dashboard/prescriptions/nouvelle?resident=${id}`} className="flex-1">
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Nouvelle prescription
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
