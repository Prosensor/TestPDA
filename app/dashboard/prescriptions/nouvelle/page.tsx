"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeftIcon, FileText, User, Building, Pill, SaveIcon, AlertCircle, InfoIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DatePicker } from "@/components/ui/date-picker"

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
}

type Medicament = {
  id: string
  nom: string
}

export default function NouvellePrescriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedResidentId = searchParams.get("resident")
  const preselectedMedicamentId = searchParams.get("medicament")
  const preselectedEtablissementId = searchParams.get("etablissement")

  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [etablissementId, setEtablissementId] = useState(preselectedEtablissementId || "")
  const [residents, setResidents] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState(preselectedResidentId || "")
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [medicamentId, setMedicamentId] = useState(preselectedMedicamentId || "")
  const [posologie, setPosologie] = useState("")
  const [matin, setMatin] = useState(false)
  const [midi, setMidi] = useState(false)
  const [soir, setSoir] = useState(false)
  const [coucher, setCoucher] = useState(false)
  const [autreHoraire, setAutreHoraire] = useState("")
  const [dateDebut, setDateDebut] = useState<Date | undefined>(new Date())
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEtablissements()
    fetchMedicaments()
  }, [])

  useEffect(() => {
    if (etablissementId) {
      fetchResidents(etablissementId)
    } else {
      setResidents([])
      setResidentId("")
    }
  }, [etablissementId])

  // Si on a un résident présélectionné, on récupère son établissement
  useEffect(() => {
    const fetchResidentDetails = async () => {
      if (preselectedResidentId && !preselectedEtablissementId) {
        try {
          const response = await fetch(`/api/residents/${preselectedResidentId}`)
          if (!response.ok) throw new Error("Erreur lors de la récupération du résident")
          const data = await response.json()

          if (data.resident && data.resident.etablissementId) {
            setEtablissementId(data.resident.etablissementId)
          }
        } catch (error) {
          console.error("Erreur:", error)
        }
      }
    }

    fetchResidentDetails()
  }, [preselectedResidentId, preselectedEtablissementId])

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

  const fetchResidents = async (etablissementId: string) => {
    try {
      const response = await fetch(`/api/etablissements/${etablissementId}/residents`)
      if (!response.ok) throw new Error("Erreur lors de la récupération des résidents")
      const data = await response.json()
      setResidents(data.residents)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

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

      const response = await fetch("/api/prescriptions", {
        method: "POST",
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
        const errorText = await response.text()
        let errorMessage = "Une erreur est survenue"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Erreur de parsing de la réponse:", errorText)
        }
        throw new Error(errorMessage)
      }

      router.push("/dashboard/prescriptions")
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
        <h2 className="text-3xl font-bold text-primary">Nouvelle prescription</h2>
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
              <CardDescription>Ajoutez une nouvelle prescription pour un résident</CardDescription>
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
              <Select value={residentId} onValueChange={setResidentId} required disabled={!etablissementId}>
                <SelectTrigger className="border-primary/20 focus:ring-primary/20">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sélectionner un résident" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {residents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.nom} {resident.prenom} - Chambre {resident.chambre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {etablissementId && residents.length === 0 && (
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

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
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
                    Création en cours...
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Créer la prescription
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Guide */}
      <Card className="max-w-3xl mx-auto bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary text-lg">Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Alert className="bg-accent/10 border-accent/20 mb-4">
            <InfoIcon className="h-4 w-4 text-accent" />
            <AlertDescription className="text-accent-foreground">
              Les prescriptions créées seront disponibles pour l'impression d'étiquettes PDA.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-primary">Posologie précise</h4>
                <p className="text-sm text-muted-foreground">
                  Indiquez la posologie exacte (ex: "1 comprimé", "5ml") pour éviter toute confusion.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-primary">Moments de prise</h4>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez au moins un moment de prise ou spécifiez un horaire particulier.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-primary">Dates</h4>
                <p className="text-sm text-muted-foreground">
                  La date de début est obligatoire. La date de fin est optionnelle pour les traitements continus.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
