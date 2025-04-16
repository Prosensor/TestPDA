"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Bug, CheckCircle, Database, RefreshCw, Search, User, Building } from "lucide-react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Etablissement = {
  id: string
  nom: string
  adresse?: string
  telephone?: string
}

type Resident = {
  id: string
  nom: string
  prenom: string
  chambre: string
  etage: string
  etablissementId: string
  etablissement?: {
    nom: string
  }
}

export default function DebugPage() {
  const [activeTab, setActiveTab] = useState("etablissements")
  const [etablissements, setEtablissements] = useState<Etablissement[]>([])
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [etablissementId, setEtablissementId] = useState("")
  const [etablissementDetails, setEtablissementDetails] = useState<Etablissement | null>(null)
  const [etablissementResidents, setEtablissementResidents] = useState<Resident[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [loadingResidents, setLoadingResidents] = useState(false)
  const [responseLog, setResponseLog] = useState<string>("")
  const [searchEtablissement, setSearchEtablissement] = useState("")
  const [searchResident, setSearchResident] = useState("")

  useEffect(() => {
    fetchEtablissements()
    fetchAllResidents()
  }, [])

  const fetchEtablissements = async () => {
    try {
      setLoading(true)
      setError(null)
      setResponseLog("")

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

      const responseText = await response.text()
      setResponseLog(responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e)
        setError(`Erreur lors du parsing JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }

      console.log("Données reçues:", data)

      if (!response.ok) {
        setError(`Erreur HTTP: ${response.status} ${response.statusText}`)
        return
      }

      if (data && data.etablissements && Array.isArray(data.etablissements)) {
        setEtablissements(data.etablissements)
        setSuccess(`${data.etablissements.length} établissements récupérés avec succès`)
      } else if (Array.isArray(data)) {
        setEtablissements(data)
        setSuccess(`${data.length} établissements récupérés avec succès`)
      } else {
        // Chercher un tableau dans les propriétés de l'objet
        let foundArray = null
        let key = "" // Déclaration de la variable key
        for (key in data) {
          if (Array.isArray(data[key])) {
            foundArray = data[key]
            break
          }
        }

        if (foundArray) {
          setEtablissements(foundArray)
          setSuccess(`${foundArray.length} établissements récupérés avec succès (propriété: ${key})`)
        } else {
          setError("Format de données inattendu. Aucun tableau d'établissements trouvé.")
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError(`Erreur: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllResidents = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Récupération de tous les résidents...")
      const response = await fetch("/api/residents", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        const errorText = await response.text()
        setError(`Erreur HTTP: ${response.status} ${response.statusText} - ${errorText}`)
        return
      }

      const data = await response.json()
      console.log("Données reçues:", data)

      if (data && data.residents && Array.isArray(data.residents)) {
        setResidents(data.residents)
        setSuccess(`${data.residents.length} résidents récupérés avec succès`)
      } else if (Array.isArray(data)) {
        setResidents(data)
        setSuccess(`${data.length} résidents récupérés avec succès`)
      } else {
        // Chercher un tableau dans les propriétés de l'objet
        let foundArray = null
        let key = "" // Déclaration de la variable key
        for (key in data) {
          if (Array.isArray(data[key])) {
            foundArray = data[key]
            break
          }
        }

        if (foundArray) {
          setResidents(foundArray)
          setSuccess(`${foundArray.length} résidents récupérés avec succès (propriété: ${key})`)
        } else {
          setError("Format de données inattendu. Aucun tableau de résidents trouvé.")
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError(`Erreur: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchEtablissementDetails = async (id: string) => {
    if (!id) {
      setError("Veuillez sélectionner un établissement")
      return
    }

    try {
      setLoadingDetails(true)
      setError(null)
      setEtablissementDetails(null)
      setResponseLog("")

      console.log(`Récupération des détails de l'établissement ${id}...`)
      const response = await fetch(`/api/etablissements/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      const responseText = await response.text()
      setResponseLog(responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e)
        setError(`Erreur lors du parsing JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }

      console.log("Données reçues:", data)

      if (!response.ok) {
        setError(`Erreur HTTP: ${response.status} ${response.statusText}`)
        return
      }

      if (data && data.etablissement) {
        setEtablissementDetails(data.etablissement)
        setSuccess(`Détails de l'établissement récupérés avec succès`)
      } else {
        // Chercher un objet établissement dans les propriétés
        let foundEtablissement = null
        for (const key in data) {
          if (data[key] && typeof data[key] === "object" && !Array.isArray(data[key]) && data[key].id) {
            foundEtablissement = data[key]
            break
          }
        }

        if (foundEtablissement) {
          setEtablissementDetails(foundEtablissement)
          setSuccess(`Détails de l'établissement récupérés avec succès`)
        } else if (data && data.id) {
          // L'objet lui-même est l'établissement
          setEtablissementDetails(data)
          setSuccess(`Détails de l'établissement récupérés avec succès`)
        } else {
          setError("Format de données inattendu. Aucun établissement trouvé.")
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError(`Erreur: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoadingDetails(false)
    }
  }

  const fetchEtablissementResidents = async (id: string) => {
    if (!id) {
      setError("Veuillez sélectionner un établissement")
      return
    }

    try {
      setLoadingResidents(true)
      setError(null)
      setEtablissementResidents([])
      setResponseLog("")

      console.log(`Récupération des résidents de l'établissement ${id}...`)
      const response = await fetch(`/api/etablissements/${id}/residents`, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      const responseText = await response.text()
      setResponseLog(responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error("Erreur lors du parsing JSON:", e)
        setError(`Erreur lors du parsing JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }

      console.log("Données reçues:", data)

      if (!response.ok) {
        setError(`Erreur HTTP: ${response.status} ${response.statusText}`)
        return
      }

      if (data && data.residents && Array.isArray(data.residents)) {
        setEtablissementResidents(data.residents)
        setSuccess(`${data.residents.length} résidents récupérés avec succès`)
      } else if (Array.isArray(data)) {
        setEtablissementResidents(data)
        setSuccess(`${data.length} résidents récupérés avec succès`)
      } else {
        // Chercher un tableau dans les propriétés de l'objet
        let foundArray = null
        let key = "" // Déclaration de la variable key
        for (key in data) {
          if (Array.isArray(data[key])) {
            foundArray = data[key]
            break
          }
        }

        if (foundArray) {
          setEtablissementResidents(foundArray)
          setSuccess(`${foundArray.length} résidents récupérés avec succès (propriété: ${key})`)
        } else {
          setError("Format de données inattendu. Aucun tableau de résidents trouvé.")

          // Essayer de récupérer les résidents via l'API alternative
          try {
            console.log("Tentative de récupération via l'API alternative...")
            const altResponse = await fetch(`/api/residents?etablissementId=${id}`, {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
              cache: "no-store",
            })

            if (altResponse.ok) {
              const altData = await altResponse.json()
              console.log("Données alternatives reçues:", altData)

              if (altData && altData.residents && Array.isArray(altData.residents)) {
                setEtablissementResidents(altData.residents)
                setSuccess(`${altData.residents.length} résidents récupérés via l'API alternative`)
              } else if (Array.isArray(altData)) {
                setEtablissementResidents(altData)
                setSuccess(`${altData.length} résidents récupérés via l'API alternative`)
              } else {
                setError("Format de données inattendu dans l'API alternative.")
              }
            } else {
              setError(`L'API alternative a également échoué: ${altResponse.status} ${altResponse.statusText}`)
            }
          } catch (altError) {
            console.error("Erreur avec l'API alternative:", altError)
          }
        }
      }
    } catch (error) {
      console.error("Erreur:", error)
      setError(`Erreur: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoadingResidents(false)
    }
  }

  // Filtrer les établissements en fonction de la recherche
  const filteredEtablissements = etablissements.filter(
    (etablissement) =>
      etablissement.nom.toLowerCase().includes(searchEtablissement.toLowerCase()) ||
      (etablissement.adresse && etablissement.adresse.toLowerCase().includes(searchEtablissement.toLowerCase())),
  )

  // Filtrer les résidents en fonction de la recherche
  const filteredResidents = residents.filter(
    (resident) =>
      `${resident.nom} ${resident.prenom}`.toLowerCase().includes(searchResident.toLowerCase()) ||
      `${resident.chambre} ${resident.etage}`.toLowerCase().includes(searchResident.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Outil de débogage</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            fetchEtablissements()
            fetchAllResidents()
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="etablissements" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Établissements
          </TabsTrigger>
          <TabsTrigger value="residents" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Résidents
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Tests API
          </TabsTrigger>
        </TabsList>

        {/* Onglet Établissements */}
        <TabsContent value="etablissements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Liste des établissements
              </CardTitle>
              <CardDescription>{etablissements.length} établissements trouvés dans la base de données</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un établissement..."
                  value={searchEtablissement}
                  onChange={(e) => setSearchEtablissement(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-primary">Chargement des établissements...</p>
                  </div>
                </div>
              ) : filteredEtablissements.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredEtablissements.map((etablissement) => (
                      <div
                        key={etablissement.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setEtablissementId(etablissement.id)
                          fetchEtablissementDetails(etablissement.id)
                          fetchEtablissementResidents(etablissement.id)
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{etablissement.nom}</h3>
                            {etablissement.adresse && (
                              <p className="text-sm text-muted-foreground">{etablissement.adresse}</p>
                            )}
                            {etablissement.telephone && (
                              <p className="text-sm text-muted-foreground">{etablissement.telephone}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ID: {etablissement.id.substring(0, 8)}...
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Database className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Aucun établissement trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>

          {etablissementDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Détails de l'établissement
                </CardTitle>
                <CardDescription>Informations détaillées sur l'établissement sélectionné</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDetails ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-primary">Chargement des détails...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">ID</Label>
                        <p className="font-mono text-sm">{etablissementDetails.id}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Nom</Label>
                        <p className="font-medium">{etablissementDetails.nom}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Adresse</Label>
                        <p>{etablissementDetails.adresse || "Non spécifiée"}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Téléphone</Label>
                        <p>{etablissementDetails.telephone || "Non spécifié"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {etablissementId && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Résidents de l'établissement
                </CardTitle>
                <CardDescription>
                  {etablissementResidents.length} résidents trouvés pour cet établissement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingResidents ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-primary">Chargement des résidents...</p>
                    </div>
                  </div>
                ) : etablissementResidents.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {etablissementResidents.map((resident) => (
                        <div key={resident.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">
                                {resident.nom} {resident.prenom}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Chambre {resident.chambre}, Étage {resident.etage}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              ID: {resident.id.substring(0, 8)}...
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <User className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Aucun résident trouvé pour cet établissement</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Résidents */}
        <TabsContent value="residents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Liste des résidents
              </CardTitle>
              <CardDescription>{residents.length} résidents trouvés dans la base de données</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un résident..."
                  value={searchResident}
                  onChange={(e) => setSearchResident(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-primary">Chargement des résidents...</p>
                  </div>
                </div>
              ) : filteredResidents.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {filteredResidents.map((resident) => (
                      <div key={resident.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {resident.nom} {resident.prenom}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Chambre {resident.chambre}, Étage {resident.etage}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Établissement ID: {resident.etablissementId}
                              {resident.etablissement && ` (${resident.etablissement.nom})`}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ID: {resident.id.substring(0, 8)}...
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <User className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Aucun résident trouvé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Tests API */}
        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Tests API
              </CardTitle>
              <CardDescription>Tester les API pour diagnostiquer les problèmes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Test d'accès à un établissement</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="etablissement-test" className="mb-2 block">
                        Sélectionner un établissement
                      </Label>
                      <Select value={etablissementId} onValueChange={setEtablissementId}>
                        <SelectTrigger id="etablissement-test">
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
                    <Button
                      onClick={() => fetchEtablissementDetails(etablissementId)}
                      disabled={!etablissementId || loadingDetails}
                    >
                      {loadingDetails ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Test en cours...
                        </>
                      ) : (
                        "Tester l'accès"
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Test de récupération des résidents</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <Label htmlFor="etablissement-residents" className="mb-2 block">
                        Sélectionner un établissement
                      </Label>
                      <Select value={etablissementId} onValueChange={setEtablissementId}>
                        <SelectTrigger id="etablissement-residents">
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
                    <Button
                      onClick={() => fetchEtablissementResidents(etablissementId)}
                      disabled={!etablissementId || loadingResidents}
                    >
                      {loadingResidents ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Test en cours...
                        </>
                      ) : (
                        "Tester la récupération"
                      )}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Réponse brute de l'API</h3>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <ScrollArea className="h-[200px]">
                      <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                        {responseLog || "Aucune réponse disponible. Exécutez un test pour voir la réponse brute."}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
