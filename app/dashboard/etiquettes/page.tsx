"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PrinterIcon, ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useReactToPrint } from "react-to-print"

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
  etablissement: {
    nom: string
  }
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
  medicament: {
    nom: string
  }
  resident: Resident
}

export default function EtiquettesPage() {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [etablissementId, setEtablissementId] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [selectedResidents, setSelectedResidents] = useState<string[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchEtablissements()
  }, [])

  useEffect(() => {
    if (etablissementId) {
      fetchResidents(etablissementId)
    } else {
      setResidents([])
      setSelectedResidents([])
    }
  }, [etablissementId])

  useEffect(() => {
    if (selectedResidents.length > 0) {
      fetchPrescriptions(selectedResidents)
    } else {
      setPrescriptions([])
      setSelectedPrescriptions([])
    }
  }, [selectedResidents])

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

  const fetchPrescriptions = async (residentIds: string[]) => {
    try {
      setLoading(true)
      const response = await fetch("/api/prescriptions/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ residentIds }),
      })
      if (!response.ok) throw new Error("Erreur lors de la récupération des prescriptions")
      const data = await response.json()
      setPrescriptions(data.prescriptions)
      setLoading(false)
    } catch (error) {
      console.error("Erreur:", error)
      setLoading(false)
    }
  }

  const handlePrintClick = () => {
    if (!printRef.current || selectedPrescriptions.length === 0) {
      console.error("Rien à imprimer")
      return
    }

    handleDownloadPDF()
  }

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Étiquettes PDA",
    onBeforePrint: () => {
      if (!printRef.current || selectedPrescriptions.length === 0) {
        console.error("Rien à imprimer")
        return Promise.reject("Rien à imprimer")
      }
      return Promise.resolve()
    },
    onPrintError: (error) => {
      console.error("Erreur d'impression:", error)
    },
  })

  const handleDownloadPDF = async () => {
    if (selectedPrescriptions.length === 0) {
      console.error("Aucune prescription sélectionnée")
      return
    }

    try {
      setLoading(true)

      // Appeler l'API pour générer le PDF côté serveur
      const response = await fetch("/api/etiquettes/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prescriptionIds: selectedPrescriptions }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du PDF")
      }

      // Créer un blob à partir de la réponse
      const blob = await response.blob()

      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob)

      // Ouvrir le PDF dans un nouvel onglet
      window.open(url, "_blank")

      // Nettoyer
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)

      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      setLoading(false)
    }
  }

  const toggleResident = (residentId: string) => {
    setSelectedResidents((prev) =>
      prev.includes(residentId) ? prev.filter((id) => id !== residentId) : [...prev, residentId],
    )
  }

  const togglePrescription = (prescriptionId: string) => {
    setSelectedPrescriptions((prev) =>
      prev.includes(prescriptionId) ? prev.filter((id) => id !== prescriptionId) : [...prev, prescriptionId],
    )
  }

  const selectAllResidents = () => {
    if (selectedResidents.length === residents.length) {
      setSelectedResidents([])
    } else {
      setSelectedResidents(residents.map((resident) => resident.id))
    }
  }

  const selectAllPrescriptions = () => {
    if (selectedPrescriptions.length === prescriptions.length) {
      setSelectedPrescriptions([])
    } else {
      setSelectedPrescriptions(prescriptions.map((prescription) => prescription.id))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" })
  }

  // Fonction pour formater l'affichage de la posologie
  const formatPosologie = (prescription: Prescription) => {
    const moments = []
    if (prescription.matin) moments.push("MATIN")
    if (prescription.midi) moments.push("MIDI")
    if (prescription.soir) moments.push("SOIR")
    if (prescription.coucher) moments.push("COUCHER")
    if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

    if (moments.length > 0) {
      return `${prescription.posologie} ${moments.join(", ")}`
    } else if (prescription.frequence > 0) {
      return `${prescription.posologie} ${prescription.frequence}x/jour`
    }

    return prescription.posologie
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold">Impression des étiquettes PDA</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sélection des résidents</CardTitle>
            <CardDescription>Sélectionnez l'établissement et les résidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="etablissement">Établissement</Label>
                <Select value={etablissementId} onValueChange={setEtablissementId}>
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

              {residents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Résidents</Label>
                    <Button variant="outline" size="sm" onClick={selectAllResidents}>
                      {selectedResidents.length === residents.length ? "Désélectionner tout" : "Sélectionner tout"}
                    </Button>
                  </div>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                    {residents.map((resident) => (
                      <div key={resident.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`resident-${resident.id}`}
                          checked={selectedResidents.includes(resident.id)}
                          onCheckedChange={() => toggleResident(resident.id)}
                        />
                        <Label htmlFor={`resident-${resident.id}`} className="cursor-pointer">
                          {resident.nom} {resident.prenom} - Chambre {resident.chambre}, Étage {resident.etage}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sélection des prescriptions</CardTitle>
            <CardDescription>Sélectionnez les prescriptions à imprimer</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Chargement des prescriptions...</p>
              </div>
            ) : prescriptions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Prescriptions</Label>
                  <Button variant="outline" size="sm" onClick={selectAllPrescriptions}>
                    {selectedPrescriptions.length === prescriptions.length
                      ? "Désélectionner tout"
                      : "Sélectionner tout"}
                  </Button>
                </div>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`prescription-${prescription.id}`}
                        checked={selectedPrescriptions.includes(prescription.id)}
                        onCheckedChange={() => togglePrescription(prescription.id)}
                      />
                      <Label htmlFor={`prescription-${prescription.id}`} className="cursor-pointer">
                        {prescription.resident.nom} {prescription.resident.prenom} - {prescription.medicament.nom} -{" "}
                        {formatPosologie(prescription)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedResidents.length > 0 ? (
              <div className="flex justify-center items-center h-40">
                <p>Aucune prescription trouvée pour les résidents sélectionnés.</p>
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>Veuillez sélectionner des résidents pour voir leurs prescriptions.</p>
              </div>
            )}

            <div className="mt-6">
              <Button
                className="w-full"
                onClick={handleDownloadPDF}
                disabled={selectedPrescriptions.length === 0 || loading}
              >
                <PrinterIcon className="mr-2 h-4 w-4" />
                Imprimer le PDF ({selectedPrescriptions.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aperçu des étiquettes */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Aperçu des étiquettes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectedPrescriptions.map((id) => {
            const prescription = prescriptions.find((p) => p.id === id)
            if (!prescription) return null

            // Formatage des moments de prise pour l'étiquette
            const moments = []
            if (prescription.matin) moments.push("MATIN")
            if (prescription.midi) moments.push("MIDI")
            if (prescription.soir) moments.push("SOIR")
            if (prescription.coucher) moments.push("COUCHER")
            if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

            const momentText = moments.length > 0 ? moments.join(", ") : `${prescription.frequence}x/jour`
            const dateFormatted = formatDate(prescription.dateDebut)

            return (
              <div
                key={prescription.id}
                className="border rounded-md overflow-hidden mx-auto bg-white"
                style={{ width: "210mm", height: "105mm" }}
              >
                <div className="p-4">
                  {/* Nom du médicament */}
                  <div className="text-3xl font-bold">{prescription.medicament.nom}</div>
                  <div className="text-xl">Pharmacie Mozart</div>
                </div>

                {/* Informations du patient et posologie */}
                <div className="p-4 pl-8 border-t border-b">
                  <div className="text-lg font-bold">Pharmacie MOZART</div>
                  <div className="text-lg">
                    Patient : {prescription.resident.nom} {prescription.resident.prenom}
                  </div>
                  <div className="text-lg">
                    {dateFormatted} {prescription.medicament.nom.substring(0, 10)} {prescription.posologie}
                  </div>
                  <div className="text-xl font-bold mt-2">{prescription.posologie}</div>
                  <div className="text-xl font-bold">{momentText}</div>
                </div>

                {/* Informations complémentaires */}
                <div className="p-4 pl-8">
                  <div className="text-sm">
                    Chambre {prescription.resident.chambre}, Étage {prescription.resident.etage}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Zone d'impression (visible mais cachée à l'écran) */}
      <div className="hidden print:block">
        <div ref={printRef}>
          {selectedPrescriptions.map((id) => {
            const prescription = prescriptions.find((p) => p.id === id)
            if (!prescription) return null

            // Formatage des moments de prise pour l'étiquette
            const moments = []
            if (prescription.matin) moments.push("MATIN")
            if (prescription.midi) moments.push("MIDI")
            if (prescription.soir) moments.push("SOIR")
            if (prescription.coucher) moments.push("COUCHER")
            if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

            const momentText = moments.length > 0 ? moments.join(", ") : `${prescription.frequence}x/jour`
            const dateFormatted = formatDate(prescription.dateDebut)

            return (
              <div
                key={prescription.id}
                className="page-break-after border-none overflow-hidden bg-white"
                style={{ width: "210mm", height: "105mm", pageBreakAfter: "always" }}
              >
                <div className="p-4">
                  {/* Nom du médicament */}
                  <div className="text-3xl font-bold">{prescription.medicament.nom}</div>
                  <div className="text-xl">Pharmacie Mozart</div>
                </div>

                {/* Informations du patient et posologie */}
                <div className="p-4 pl-8 border-t border-b">
                  <div className="text-lg font-bold">Pharmacie MOZART</div>
                  <div className="text-lg">
                    Patient : {prescription.resident.nom} {prescription.resident.prenom}
                  </div>
                  <div className="text-lg">
                    {dateFormatted} {prescription.medicament.nom.substring(0, 10)} {prescription.posologie}
                  </div>
                  <div className="text-xl font-bold mt-2">{prescription.posologie}</div>
                  <div className="text-xl font-bold">{momentText}</div>
                </div>

                {/* Informations complémentaires */}
                <div className="p-4 pl-8">
                  <div className="text-sm">
                    Chambre {prescription.resident.chambre}, Étage {prescription.resident.etage}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
