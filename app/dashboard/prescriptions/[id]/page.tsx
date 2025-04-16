"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeftIcon, FileText, User, Building, Pill, SaveIcon, AlertCircle, Trash2Icon, Printer } from "lucide-react"
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
import { DatePicker } from "@/components/ui/date-picker"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

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
}

type Medicament = {
  id: string
  nom: string
  description: string | null
}

type Prescription = {
  id: string
  residentId: string
  medicamentId: string
  posologie: string
  matin: boolean
  midi: boolean
  soir: boolean
  coucher: boolean
  autreHoraire: string | null
  frequence: number
  dateDebut: string
  dateFin: string | null
  resident: Resident
  medicament: Medicament
}

export default function ModifierPrescriptionPage() {
  const router = useRouter()
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [etablissementId, setEtablissementId] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState("")
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [medicamentId, setMedicamentId] = useState("")
  const [posologie, setPosologie] = useState("")
  const [matin, setMatin] = useState(false)
  const [midi, setMidi] = useState(false)
  const [soir, setSoir] = useState(false)
  const [coucher, setCoucher] = useState(false)
  const [autreHoraire, setAutreHoraire] = useState("")
  const [dateDebut, setDateDebut] = useState<Date | undefined>(new Date())
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [currentResident, setCurrentResident] = useState<Resident | null>(null)

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

    const fetchMedicaments = async () => {
      try {
        const response = await fetch("/api/medicaments")
        if (!response.ok) throw new Error("Erreur lors de la récupération des médicaments")
        const data = await response.json()
        setMedicaments(data.medicaments)
      } catch (error) {
        console.error("Erreur:", error)
      }
    }

    const fetchPrescription = async () => {
      try {
        const response = await fetch(`/api/prescriptions/${id}`)
        if (!response.ok) throw new Error("Erreur lors de la récupération de la prescription")
        const data = await response.json()

        const prescription = data.prescription as Prescription
        setPrescription(prescription)
        setResidentId(prescription.residentId)
        setMedicamentId(prescription.medicamentId)
        setPosologie(prescription.posologie)
        setMatin(prescription.matin)
        setMidi(prescription.midi)
        setSoir(prescription.soir)
        setCoucher(prescription.coucher)
        setAutreHoraire(prescription.autreHoraire || "")
        setDateDebut(new Date(prescription.dateDebut))
        setDateFin(prescription.dateFin ? new Date(prescription.dateFin) : undefined)

        // Stocker le résident actuel pour l'afficher dans le formulaire
        if (prescription.resident) {
          setCurrentResident(prescription.resident)
          setEtablissementId(prescription.resident.etablissementId)

          // Créer un tableau avec seulement le résident actuel
          setResidents([prescription.resident])
        }
      } catch (error) {
        console.error("Erreur:", error)
        setError("Impossible de charger les informations de la prescription")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchEtablissements()
    fetchMedicaments()
    if (id) {
      fetchPrescription()
    } else {
      setInitialLoading(false)
      setError("ID de prescription manquant")
    }
  }, [id])

  const fetchResidents = async (etablissementId: string) => {
    try {
      const response = await fetch(`/api/etablissements/${etablissementId}/residents`)
      if (!response.ok) throw new Error("Erreur lors de la récupération des résidents")
      const data = await response.json()

      // Si nous avons déjà un résident actuel, assurons-nous qu'il est inclus dans la liste
      if (currentResident && currentResident.etablissementId === etablissementId) {
        // Vérifier si le résident actuel est déjà dans la liste
        const residentExists = data.residents.some((r: Resident) => r.id === currentResident.id)

        if (!residentExists) {
          // Ajouter le résident actuel à la liste
          data.residents.push(currentResident)
        }
      }

      setResidents(data.residents || [])
    } catch (error) {
      console.error("Erreur:", error)

      // En cas d'erreur, si nous avons un résident actuel, utilisons-le comme seule option
      if (currentResident && currentResident.etablissementId === etablissementId) {
        setResidents([currentResident])
      } else {
        setResidents([])
      }
    }
  }

  useEffect(() => {
    if (etablissementId) {
      fetchResidents(etablissementId)
    } else {
      // Si nous avons un résident actuel mais pas d'établissement sélectionné,
      // gardons quand même le résident actuel dans la liste
      if (currentResident) {
        setResidents([currentResident])
      } else {
        setResidents([])
      }
    }
  }, [etablissementId, currentResident])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Vérification que au moins un moment de prise est sélectionné
    if (!matin && !midi && !soir && !coucher && !autreHoraire) {
      setError("Veuillez sélectionner au moins un moment de prise")
      setIsLoading(false)
      return
    }

    try {
      // Formatons correctement les dates pour l'API
      const formattedDateDebut = dateDebut ? dateDebut.toISOString() : null
      const formattedDateFin = dateFin ? dateFin.toISOString() : null

      // Calculer la fréquence en fonction des moments sélectionnés
      const calculatedFrequence =
        (matin ? 1 : 0) + (midi ? 1 : 0) + (soir ? 1 : 0) + (coucher ? 1 : 0) + (autreHoraire ? 1 : 0)

      const response = await fetch(`/api/prescriptions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          residentId,
          medicamentId,
          posologie,
          matin,
          midi,
          soir,
          coucher,
          autreHoraire: autreHoraire || null,
          frequence: calculatedFrequence,
          dateDebut: formattedDateDebut,
          dateFin: formattedDateFin,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Une erreur est survenue")
      }

      setSuccess("Prescription modifiée avec succès")
      setTimeout(() => {
        router.push("/dashboard/prescriptions")
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
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Une erreur est survenue")
      }

      router.push("/dashboard/prescriptions")
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

  // Vérifier si une prescription est active
  const isActive = (prescription: Prescription) => {
    const now = new Date()
    const dateDebut = new Date(prescription.dateDebut)
    const dateFin = prescription.dateFin ? new Date(prescription.dateFin) : null

    return dateDebut <= now && (!dateFin || dateFin >= now)
  }

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd MMMM yyyy", { locale: fr })
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error && !prescription) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/prescriptions">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold text-primary">Prescription non trouvée</h2>
        </div>

        <Card className="max-w-3xl mx-auto border-primary/20 shadow-sm">
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="flex justify-end mt-4">
              <Link href="/dashboard/prescriptions">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  Retour à la liste des prescriptions
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
        <Link href="/dashboard/prescriptions">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-primary">Modifier la prescription</h2>
          {prescription && (
            <p className="text-muted-foreground mt-1">
              {prescription.medicament.nom} - {prescription.resident.nom} {prescription.resident.prenom}
            </p>
          )}
        </div>
        {prescription && (
          <Badge
            variant={isActive(prescription) ? "default" : "outline"}
            className={
              isActive(prescription) ? "bg-accent/80 text-accent-foreground hover:bg-accent ml-2" : "bg-muted/50 ml-2"
            }
          >
            {isActive(prescription) ? "Active" : "Terminée"}
          </Badge>
        )}
      </div>

      {/* Formulaire */}
      <Card className="max-w-3xl mx-auto border-primary/20 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-primary">Informations de la prescription</CardTitle>
              <CardDescription>Modifiez les informations de la prescription</CardDescription>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="resident" className="text-primary font-medium">
                Résident *
              </Label>
              {currentResident ? (
                // Si nous avons un résident actuel, afficher un champ désactivé avec ses informations
                <div className="flex items-center gap-2 p-2 border rounded-md border-primary/20 bg-muted/10">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {currentResident.nom} {currentResident.prenom} - Chambre {currentResident.chambre}
                  </span>
                  <input type="hidden" name="residentId" value={currentResident.id} />
                </div>
              ) : (
                <Select value={residentId} onValueChange={setResidentId} required disabled={!etablissementId}>
                  <SelectTrigger className="border-primary/20 focus:ring-primary/20">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Sélectionner un résident" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {(residents || []).map((resident) => (
                      <SelectItem key={resident.id} value={resident.id}>
                        {resident.nom} {resident.prenom} - Chambre {resident.chambre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {etablissementId && residents.length === 0 && !currentResident && (
                <p className="text-sm text-muted-foreground mt-1">
                  Aucun résident disponible pour cet établissement.{" "}
                  <Link
                    href={`/dashboard/residents/nouveau?etablissement=${etablissementId}`}
                    className="text-primary hover:underline"
                  >
                    Ajouter un résident
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicament" className="text-primary font-medium">
                Médicament *
              </Label>
              <Select value={medicamentId} onValueChange={setMedicamentId} required>
                <SelectTrigger className="border-primary/20 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sélectionner un médicament" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {medicaments.map((medicament) => (
                    <SelectItem key={medicament.id} value={medicament.id}>
                      {medicament.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {medicaments.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Aucun médicament disponible.{" "}
                  <Link href="/dashboard/medicaments/nouveau" className="text-primary hover:underline">
                    Ajouter un médicament
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="posologie" className="text-primary font-medium">
                Posologie *
              </Label>
              <Textarea
                id="posologie"
                value={posologie}
                onChange={(e) => setPosologie(e.target.value)}
                placeholder="Ex: 1 comprimé"
                className="border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-primary font-medium">Moment de prise *</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="matin"
                    checked={matin}
                    onCheckedChange={(checked) => setMatin(checked === true)}
                    className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="matin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Matin
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="midi"
                    checked={midi}
                    onCheckedChange={(checked) => setMidi(checked === true)}
                    className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="midi"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Midi
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="soir"
                    checked={soir}
                    onCheckedChange={(checked) => setSoir(checked === true)}
                    className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="soir"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Soir
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="coucher"
                    checked={coucher}
                    onCheckedChange={(checked) => setCoucher(checked === true)}
                    className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                  />
                  <label
                    htmlFor="coucher"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Coucher
                  </label>
                </div>
              </div>
              <div className="mt-2">
                <Label htmlFor="autreHoraire">Autre horaire (optionnel)</Label>
                <Input
                  id="autreHoraire"
                  value={autreHoraire}
                  onChange={(e) => setAutreHoraire(e.target.value)}
                  placeholder="Ex: 10h, 14h, etc."
                  className="mt-1 border-primary/20 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebut" className="text-primary font-medium">
                  Date de début *
                </Label>
                <DatePicker date={dateDebut} setDate={setDateDebut} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFin" className="text-primary font-medium">
                  Date de fin (optionnel)
                </Label>
                <DatePicker date={dateFin} setDate={setDateFin} />
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
                      Êtes-vous sûr de vouloir supprimer cette prescription ? Cette action est irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
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
                <Link href="/dashboard/prescriptions">
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
                  disabled={isLoading || !residentId || !medicamentId || !posologie || !dateDebut}
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

      {/* Actions rapides */}
      {prescription && (
        <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary text-lg">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/dashboard/etiquettes?prescription=${prescription.id}`}>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer l'étiquette
                </Button>
              </Link>
              <Link href={`/dashboard/residents/${prescription.residentId}`}>
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5">
                  <User className="mr-2 h-4 w-4" />
                  Voir le résident
                </Button>
              </Link>
              <Link href={`/dashboard/medicaments/${prescription.medicamentId}`}>
                <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5">
                  <Pill className="mr-2 h-4 w-4" />
                  Voir le médicament
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
