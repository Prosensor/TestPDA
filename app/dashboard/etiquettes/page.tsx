"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PrinterIcon,
  ArrowLeftIcon,
  Building,
  User,
  Pill,
  Calendar,
  CheckIcon,
  AlertCircleIcon,
  SearchIcon,
  RefreshCwIcon,
  FileDownIcon,
  XCircleIcon,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

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

type Medicament = {
  id: string
  nom: string
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
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([])
  const [selectedResidents, setSelectedResidents] = useState<string[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([])
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingResidents, setLoadingResidents] = useState(false)
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchResident, setSearchResident] = useState("")
  const [searchPrescription, setSearchPrescription] = useState("")
  const [activeTab, setActiveTab] = useState("selection")
  const [generatingPDF, setGeneratingPDF] = useState(false)

  useEffect(() => {
    fetchEtablissements()
  }, [])

  useEffect(() => {
    if (etablissementId) {
      fetchResidents(etablissementId)
    } else {
      setResidents([])
      setFilteredResidents([])
      setSelectedResidents([])
    }
  }, [etablissementId])

  useEffect(() => {
    if (selectedResidents.length > 0) {
      fetchPrescriptions(selectedResidents)
    } else {
      setPrescriptions([])
      setFilteredPrescriptions([])
      setSelectedPrescriptions([])
    }
  }, [selectedResidents])

  useEffect(() => {
    // Filtrer les résidents en fonction de la recherche
    if (searchResident.trim() === "") {
      setFilteredResidents(residents)
    } else {
      const searchTerms = searchResident.toLowerCase().split(" ")
      setFilteredResidents(
        residents.filter((resident) => {
          const fullName = `${resident.nom} ${resident.prenom}`.toLowerCase()
          const chambreEtage = `chambre ${resident.chambre} étage ${resident.etage}`.toLowerCase()
          return searchTerms.every((term) => fullName.includes(term) || chambreEtage.includes(term))
        }),
      )
    }
  }, [searchResident, residents])

  useEffect(() => {
    // Filtrer les prescriptions en fonction de la recherche
    if (searchPrescription.trim() === "") {
      setFilteredPrescriptions(prescriptions)
    } else {
      const searchTerms = searchPrescription.toLowerCase().split(" ")
      setFilteredPrescriptions(
        prescriptions.filter((prescription) => {
          const medicamentName = prescription.medicament.nom.toLowerCase()
          const residentName = `${prescription.resident.nom} ${prescription.resident.prenom}`.toLowerCase()
          const posologie = prescription.posologie.toLowerCase()
          return searchTerms.every(
            (term) => medicamentName.includes(term) || residentName.includes(term) || posologie.includes(term),
          )
        }),
      )
    }
  }, [searchPrescription, prescriptions])

  // Modifions la fonction fetchResidents pour mieux gérer les erreurs et ajouter plus de logs
  const fetchResidents = async (etablissementId: string) => {
    try {
      setLoadingResidents(true)
      setError(null)
      console.log("Récupération des résidents pour l'établissement:", etablissementId)

      // Vérifier si l'ID de l'établissement est valide
      if (!etablissementId) {
        console.error("ID d'établissement invalide")
        setError("ID d'établissement invalide")
        setResidents([])
        setFilteredResidents([])
        return
      }

      // Utiliser l'API residents avec le paramètre etablissementId qui fonctionne dans la page debug
      console.log("URL de l'API:", `/api/residents?etablissementId=${etablissementId}`)
      const response = await fetch(`/api/residents?etablissementId=${etablissementId}`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })
      console.log("Statut de la réponse:", response.status, response.statusText)

      if (!response.ok) {
        console.error("Erreur HTTP:", response.status, response.statusText)
        try {
          const errorData = await response.json()
          console.error("Détails de l'erreur:", errorData)
          throw new Error(
            `Erreur lors de la récupération des résidents: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`,
          )
        } catch (parseError) {
          throw new Error(`Erreur lors de la récupération des résidents: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log("Données reçues de l'API:", data)

      if (!data || Object.keys(data).length === 0) {
        console.error("L'API a renvoyé un objet vide")
        setResidents([])
        setFilteredResidents([])
        setError("Aucun résident trouvé. Veuillez vérifier l'établissement sélectionné.")
        return
      }

      // Vérifier si les données contiennent la propriété residents
      if (data && data.residents && Array.isArray(data.residents)) {
        console.log("Nombre de résidents chargés:", data.residents.length)
        setResidents(data.residents)
        setFilteredResidents(data.residents)
      } else {
        console.error("Format de données inattendu:", data)

        // Si les données sont directement un tableau
        if (Array.isArray(data)) {
          console.log("Les données sont directement un tableau:", data)
          setResidents(data)
          setFilteredResidents(data)
        } else {
          console.error("Impossible de trouver des résidents dans les données")
          setResidents([])
          setFilteredResidents([])
          setError("Format de données inattendu. Veuillez contacter l'administrateur.")
        }
      }
    } catch (error) {
      console.error("Erreur complète:", error)
      setError(`Impossible de charger les résidents: ${error instanceof Error ? error.message : String(error)}`)
      setResidents([])
      setFilteredResidents([])
    } finally {
      setLoadingResidents(false)
    }
  }

  // Modifions également la fonction fetchEtablissements pour ajouter plus de logs
  const fetchEtablissements = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Récupération des établissements...")

      const response = await fetch("/api/etablissements", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      console.log("Statut de la réponse:", response.status, response.statusText)

      if (!response.ok) {
        console.error("Erreur HTTP:", response.status, response.statusText)
        throw new Error(`Erreur lors de la récupération des établissements: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Données reçues de l'API pour les établissements:", data)

      if (data && data.etablissements && Array.isArray(data.etablissements)) {
        console.log("Nombre d'établissements chargés:", data.etablissements.length)
        setEtablissements(data.etablissements)
      } else {
        console.error("Format de données inattendu pour les établissements:", data)

        // Essayer de trouver les établissements dans d'autres propriétés
        let foundEtablissements = null

        // Parcourir toutes les propriétés de l'objet data pour trouver un tableau
        if (data && typeof data === "object") {
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`Trouvé un tableau dans la propriété "${key}"`, data[key])
              foundEtablissements = data[key]
              break
            }
          }
        }

        if (foundEtablissements) {
          console.log("Utilisation des établissements trouvés:", foundEtablissements)
          setEtablissements(foundEtablissements)
        } else {
          // Si aucun tableau n'est trouvé, essayer de récupérer les établissements directement
          if (Array.isArray(data)) {
            console.log("Les données sont directement un tableau:", data)
            setEtablissements(data)
          } else {
            console.error("Impossible de trouver des établissements dans les données")
            setEtablissements([])
            setError("Format de données inattendu. Veuillez contacter l'administrateur.")
          }
        }
      }
    } catch (error) {
      console.error("Erreur complète:", error)
      setError(`Impossible de charger les établissements: ${error instanceof Error ? error.message : String(error)}`)
      setEtablissements([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPrescriptions = async (residentIds: string[]) => {
    try {
      setLoadingPrescriptions(true)
      setError(null)
      console.log("Récupération des prescriptions pour les résidents:", residentIds)

      const response = await fetch("/api/prescriptions/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ residentIds }),
      })

      console.log("Statut de la réponse:", response.status, response.statusText)

      if (!response.ok) throw new Error("Erreur lors de la récupération des prescriptions")

      const data = await response.json()
      console.log("Données reçues de l'API pour les prescriptions:", data)

      if (data && data.prescriptions && Array.isArray(data.prescriptions)) {
        setPrescriptions(data.prescriptions)
        setFilteredPrescriptions(data.prescriptions)
      } else {
        console.error("Format de données inattendu pour les prescriptions:", data)

        // Essayer de trouver les prescriptions dans d'autres propriétés
        let foundPrescriptions = null

        // Parcourir toutes les propriétés de l'objet data pour trouver un tableau
        if (data && typeof data === "object") {
          for (const key in data) {
            if (Array.isArray(data[key])) {
              console.log(`Trouvé un tableau dans la propriété "${key}"`, data[key])
              foundPrescriptions = data[key]
              break
            }
          }
        }

        if (foundPrescriptions) {
          console.log("Utilisation des prescriptions trouvées:", foundPrescriptions)
          setPrescriptions(foundPrescriptions)
          setFilteredPrescriptions(foundPrescriptions)
        } else {
          // Si aucun tableau n'est trouvé, essayer de récupérer les prescriptions directement
          if (Array.isArray(data)) {
            console.log("Les données sont directement un tableau:", data)
            setPrescriptions(data)
            setFilteredPrescriptions(data)
          } else {
            console.error("Impossible de trouver des prescriptions dans les données")
            setPrescriptions([])
            setFilteredPrescriptions([])
          }
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError("Impossible de charger les prescriptions. Veuillez réessayer.")
    } finally {
      setLoadingPrescriptions(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (selectedPrescriptions.length === 0) {
      setError("Veuillez sélectionner au moins une prescription")
      return
    }

    try {
      setGeneratingPDF(true)
      setError(null)

      // Appeler l'API pour générer le PDF côté serveur
      console.log("Envoi des prescriptions pour génération PDF:", selectedPrescriptions)
      const response = await fetch("/api/etiquettes/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prescriptionIds: selectedPrescriptions }),
      })
      console.log("Statut de la réponse PDF:", response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Erreur détaillée:", errorText)
        throw new Error(`Erreur lors de la génération du PDF: ${response.status} ${response.statusText}`)
      }

      // Créer un blob à partir de la réponse
      const blob = await response.blob()

      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob)

      // Ouvrir le PDF dans un nouvel onglet
      const newWindow = window.open(url, "_blank")

      // Déclencher l'impression automatiquement
      if (newWindow) {
        newWindow.addEventListener("load", () => {
          newWindow.print()
        })
      }

      // Nettoyer
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)

      setSuccess(`${selectedPrescriptions.length} étiquette(s) générée(s) avec succès`)
      setActiveTab("apercu")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      setError("Impossible de générer le PDF. Veuillez réessayer.")
    } finally {
      setGeneratingPDF(false)
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
    if (selectedResidents.length === filteredResidents.length) {
      setSelectedResidents([])
    } else {
      setSelectedResidents(filteredResidents.map((resident) => resident.id))
    }
  }

  const selectAllPrescriptions = () => {
    if (selectedPrescriptions.length === filteredPrescriptions.length) {
      setSelectedPrescriptions([])
    } else {
      setSelectedPrescriptions(filteredPrescriptions.map((prescription) => prescription.id))
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

  // Fonction pour obtenir les moments de prise sous forme de texte
  const getMomentText = (prescription: Prescription) => {
    const moments = []
    if (prescription.matin) moments.push("MATIN")
    if (prescription.midi) moments.push("MIDI")
    if (prescription.soir) moments.push("SOIR")
    if (prescription.coucher) moments.push("COUCHER")
    if (prescription.autreHoraire) moments.push(prescription.autreHoraire)

    return moments.length > 0 ? moments.join(", ") : `${prescription.frequence}x/jour`
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">Impression des étiquettes PDA</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchEtablissements()
              if (etablissementId) fetchResidents(etablissementId)
              if (selectedResidents.length > 0) fetchPrescriptions(selectedResidents)
            }}
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Actualiser
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={selectedPrescriptions.length === 0 || generatingPDF}
            className="bg-accent hover:bg-accent/90 text-white"
          >
            {generatingPDF ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                <PrinterIcon className="h-4 w-4 mr-2" />
                Imprimer ({selectedPrescriptions.length})
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages d'erreur ou de succès */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 flex items-center gap-3">
          <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-accent/10 border border-accent/30 text-accent-foreground rounded-lg p-4 flex items-center gap-3">
          <CheckIcon className="h-5 w-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="selection" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Sélection
          </TabsTrigger>
          <TabsTrigger value="apercu" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Aperçu des étiquettes
          </TabsTrigger>
        </TabsList>

        {/* Onglet de sélection */}
        <TabsContent value="selection" className="space-y-6">
          {/* Sélection de l'établissement */}
          <Card className="shadow-sm border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">Établissement</CardTitle>
                  <CardDescription>Sélectionnez l'établissement pour les étiquettes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label htmlFor="etablissement" className="text-primary font-medium">
                  Établissement
                </Label>
                <Select value={etablissementId} onValueChange={setEtablissementId}>
                  <SelectTrigger className="rounded-lg border-primary/20 focus:ring-primary/20">
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
            </CardContent>
          </Card>

          {/* Grille pour résidents et prescriptions */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sélection des résidents */}
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">Résidents</CardTitle>
                    <CardDescription>Sélectionnez les résidents pour les étiquettes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingResidents ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-primary">Chargement des résidents...</p>
                    </div>
                  </div>
                ) : etablissementId && (!residents || residents.length === 0) ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <AlertCircleIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Aucun résident trouvé pour cet établissement</p>
                  </div>
                ) : !etablissementId ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Building className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Veuillez d'abord sélectionner un établissement</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher un résident..."
                          value={searchResident}
                          onChange={(e) => setSearchResident(e.target.value)}
                          className="pl-9 border-primary/20 focus-visible:ring-primary/30"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllResidents}
                        className="whitespace-nowrap border-accent text-accent hover:bg-accent hover:text-white"
                      >
                        {selectedResidents.length === (filteredResidents?.length || 0) &&
                        (filteredResidents?.length || 0) > 0
                          ? "Désélectionner tout"
                          : "Sélectionner tout"}
                      </Button>
                    </div>

                    <div className="border rounded-lg border-primary/20">
                      <ScrollArea className="h-[300px] rounded-md">
                        <div className="p-4 space-y-1">
                          {filteredResidents && filteredResidents.length > 0 ? (
                            filteredResidents.map((resident) => (
                              <div
                                key={resident.id}
                                className="flex items-center space-x-2 py-2 px-2 rounded-md hover:bg-muted/50 transition-colors"
                              >
                                <Checkbox
                                  id={`resident-${resident.id}`}
                                  checked={selectedResidents.includes(resident.id)}
                                  onCheckedChange={() => toggleResident(resident.id)}
                                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white"
                                />
                                <Label htmlFor={`resident-${resident.id}`} className="cursor-pointer flex-1">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {resident.nom} {resident.prenom}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      Chambre {resident.chambre}, Étage {resident.etage}
                                    </span>
                                  </div>
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <XCircleIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Aucun résident trouvé</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{filteredResidents?.length || 0} résidents affichés</span>
                      <span>{selectedResidents.length} résidents sélectionnés</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sélection des prescriptions */}
            <Card className="shadow-sm border-primary/10">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">Prescriptions</CardTitle>
                    <CardDescription>Sélectionnez les prescriptions pour les étiquettes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingPrescriptions ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-primary">Chargement des prescriptions...</p>
                    </div>
                  </div>
                ) : prescriptions && prescriptions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher une prescription..."
                          value={searchPrescription}
                          onChange={(e) => setSearchPrescription(e.target.value)}
                          className="pl-9 border-primary/20 focus-visible:ring-primary/30"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllPrescriptions}
                        className="whitespace-nowrap border-accent text-accent hover:bg-accent hover:text-white"
                      >
                        {selectedPrescriptions.length === (filteredPrescriptions?.length || 0) &&
                        (filteredPrescriptions?.length || 0) > 0
                          ? "Désélectionner tout"
                          : "Sélectionner tout"}
                      </Button>
                    </div>

                    <div className="border rounded-lg border-primary/20">
                      <ScrollArea className="h-[300px] rounded-md">
                        <div className="p-4 space-y-1">
                          {filteredPrescriptions && filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map((prescription) => (
                              <div
                                key={prescription.id}
                                className="flex items-start space-x-2 py-2 px-2 rounded-md hover:bg-muted/50 transition-colors"
                              >
                                <Checkbox
                                  id={`prescription-${prescription.id}`}
                                  checked={selectedPrescriptions.includes(prescription.id)}
                                  onCheckedChange={() => togglePrescription(prescription.id)}
                                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-white mt-1"
                                />
                                <Label htmlFor={`prescription-${prescription.id}`} className="cursor-pointer flex-1">
                                  <div className="flex flex-col">
                                    <span className="font-medium">{prescription.medicament.nom}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {prescription.resident.nom} {prescription.resident.prenom}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                                        {prescription.posologie}
                                      </Badge>
                                      {prescription.matin && (
                                        <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                                          Matin
                                        </Badge>
                                      )}
                                      {prescription.midi && (
                                        <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                                          Midi
                                        </Badge>
                                      )}
                                      {prescription.soir && (
                                        <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                                          Soir
                                        </Badge>
                                      )}
                                      {prescription.coucher && (
                                        <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                                          Coucher
                                        </Badge>
                                      )}
                                      {prescription.autreHoraire && (
                                        <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                                          {prescription.autreHoraire}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <XCircleIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Aucune prescription trouvée</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{filteredPrescriptions?.length || 0} prescriptions affichées</span>
                      <span>{selectedPrescriptions.length} prescriptions sélectionnées</span>
                    </div>
                  </div>
                ) : selectedResidents.length > 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <AlertCircleIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Aucune prescription trouvée pour les résidents sélectionnés</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <User className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Veuillez d'abord sélectionner des résidents</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button
                  className="w-full rounded-lg bg-accent hover:bg-accent/90 text-white"
                  onClick={handleDownloadPDF}
                  disabled={selectedPrescriptions.length === 0 || generatingPDF}
                >
                  {generatingPDF ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <PrinterIcon className="mr-2 h-5 w-5" />
                      Imprimer les étiquettes ({selectedPrescriptions.length})
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet d'aperçu des étiquettes */}
        <TabsContent value="apercu" className="space-y-6">
          {selectedPrescriptions && selectedPrescriptions.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">Aperçu des étiquettes</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  className="border-accent text-accent hover:bg-accent hover:text-white"
                >
                  {generatingPDF ? (
                    <>
                      <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin mr-2"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <FileDownIcon className="h-4 w-4 mr-2" />
                      Télécharger PDF
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedPrescriptions.map((id) => {
                  const prescription = prescriptions.find((p) => p.id === id)
                  if (!prescription) return null

                  const momentText = getMomentText(prescription)
                  const dateFormatted = formatDate(prescription.dateDebut)

                  return (
                    <Card key={prescription.id} className="overflow-hidden border-primary/10 shadow-sm">
                      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-primary text-lg">
                              {prescription.resident.etablissement.nom}
                            </CardTitle>
                          </div>
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                            PDA
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-primary">{prescription.medicament.nom}</h3>
                            <p className="text-lg font-medium text-accent">{prescription.posologie}</p>
                          </div>

                          <Separator className="my-2" />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Patient</p>
                              <p className="font-medium">
                                {prescription.resident.nom} {prescription.resident.prenom}
                              </p>
                              <p className="text-sm">
                                Chambre {prescription.resident.chambre}, Étage {prescription.resident.etage}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Prise</p>
                              <p className="font-medium">{momentText}</p>
                              <p className="text-sm">Début: {dateFormatted}</p>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-dashed border-primary/10">
                            <p className="text-xs text-muted-foreground">ID: {prescription.id.substring(0, 10)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-primary/5 rounded-full p-4 mb-4">
                <PrinterIcon className="h-10 w-10 text-primary/40" />
              </div>
              <h3 className="text-xl font-medium text-primary mb-2">Aucune étiquette sélectionnée</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Veuillez sélectionner des prescriptions dans l'onglet "Sélection" pour voir l'aperçu des étiquettes.
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveTab("selection")}
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                Aller à la sélection
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="hidden print:block">
        {selectedPrescriptions.map((id) => {
          const prescription = prescriptions.find((p) => p.id === id)
          if (!prescription) return null

          // Formatage des moments de prise pour l'étiquette
          const momentText = getMomentText(prescription)
          const dateFormatted = formatDate(prescription.dateDebut)

          return (
            <div
              key={prescription.id}
              className="page-break-after border-none overflow-hidden bg-white"
              style={{ width: "210mm", height: "105mm", pageBreakAfter: "always" }}
            >
              <div className="p-4 pl-10">
                {/* Nom du médicament */}
                <div className="text-4xl font-bold text-primary">{prescription.medicament.nom}</div>
                <div className="text-2xl font-bold text-accent">{prescription.resident.etablissement.nom}</div>
              </div>

              {/* Informations du patient et posologie */}
              <div className="p-4 pl-10">
                <div className="text-2xl font-bold text-primary">
                  Patient : {prescription.resident.nom} {prescription.resident.prenom}
                </div>
                <div className="text-xl font-bold text-gray-700">
                  {dateFormatted} {prescription.medicament.nom.substring(0, 10)} {prescription.posologie}
                </div>
                <div className="text-2xl font-bold mt-4 text-accent">{prescription.posologie}</div>
                <div className="text-2xl font-bold text-primary">{momentText}</div>
              </div>

              {/* Informations complémentaires */}
              <div className="p-4 pl-10">
                <div className="text-lg font-bold text-gray-600">
                  Chambre {prescription.resident.chambre}, Étage {prescription.resident.etage}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
