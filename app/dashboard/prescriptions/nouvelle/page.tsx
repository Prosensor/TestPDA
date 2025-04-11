"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"

type Etablissement = {
  id: string
  nom: string
}

type Resident = {
  id: string
  nom: string
  prenom: string
}

type Medicament = {
  id: string
  nom: string
}

export default function NouvellePrescriptionPage() {
  const router = useRouter()
  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [etablissementId, setEtablissementId] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState("")
  const [medicaments, setMedicaments] = useState<Medicament[]>([])
  const [medicamentId, setMedicamentId] = useState("")
  const [posologie, setPosologie] = useState("")
  const [frequence, setFrequence] = useState("1")
  // Nouveaux états pour les moments de prise
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

      // Si aucun moment n'est sélectionné mais qu'une fréquence est spécifiée, utiliser celle-ci
      const finalFrequence = calculatedFrequence > 0 ? calculatedFrequence : Number.parseInt(frequence)

      console.log("Envoi des données:", {
        residentId,
        medicamentId,
        posologie,
        matin,
        midi,
        soir,
        coucher,
        autreHoraire,
        frequence: finalFrequence,
        dateDebut: formattedDateDebut,
        dateFin: formattedDateFin,
      })

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
          autreHoraire,
          frequence: finalFrequence,
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
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/prescriptions" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold">Nouvelle prescription</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations de la prescription</CardTitle>
          <CardDescription>Ajoutez une nouvelle prescription pour un résident</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="resident">Résident *</Label>
              <Select value={residentId} onValueChange={setResidentId} required disabled={!etablissementId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un résident" />
                </SelectTrigger>
                <SelectContent>
                  {residents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.nom} {resident.prenom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {etablissementId && residents.length === 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Aucun résident disponible pour cet établissement.{" "}
                  <Link href="/dashboard/residents/nouveau" className="text-primary hover:underline">
                    Ajouter un résident
                  </Link>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicament">Médicament *</Label>
              <Select value={medicamentId} onValueChange={setMedicamentId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un médicament" />
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
              <Label htmlFor="posologie">Posologie *</Label>
              <Textarea
                id="posologie"
                value={posologie}
                onChange={(e) => setPosologie(e.target.value)}
                placeholder="Ex: 1 cuillère à soupe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Moment de prise *</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="matin" checked={matin} onCheckedChange={(checked) => setMatin(checked === true)} />
                  <label
                    htmlFor="matin"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Matin
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="midi" checked={midi} onCheckedChange={(checked) => setMidi(checked === true)} />
                  <label
                    htmlFor="midi"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Midi
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="soir" checked={soir} onCheckedChange={(checked) => setSoir(checked === true)} />
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
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début *</Label>
                <DatePicker date={dateDebut} setDate={setDateDebut} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFin">Date de fin (optionnel)</Label>
                <DatePicker date={dateFin} setDate={setDateFin} />
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            <div className="flex justify-end gap-2">
              <Link href="/dashboard/prescriptions">
                <Button variant="outline" type="button">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading || !residentId || !medicamentId || !posologie || !dateDebut}>
                {isLoading ? "Création en cours..." : "Créer la prescription"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
