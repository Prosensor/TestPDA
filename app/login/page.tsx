"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

// Composant pour gérer les paramètres de recherche
function LoginForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)

  // Utiliser useEffect pour lire les paramètres d'URL côté client
  useEffect(() => {
    // Récupérer les paramètres d'URL manuellement
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get("error")
    const registeredParam = params.get("registered")

    if (errorParam) {
      setErrorMessage(
        errorParam === "CredentialsSignin" ? "Identifiants invalides" : "Une erreur est survenue lors de la connexion",
      )
    }

    if (registeredParam === "true") {
      setIsRegistered(true)
    }
  }, [])

  // Rediriger si déjà connecté
  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Tentative de connexion avec:", email)

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      console.log("Résultat de la connexion:", result)

      if (result?.error) {
        setError("Identifiants invalides")
        setIsLoading(false)
        return
      }

      // Récupérer le paramètre callbackUrl manuellement
      const params = new URLSearchParams(window.location.search)
      const callbackUrl = params.get("callbackUrl") || "/dashboard"

      router.push(callbackUrl)
      router.refresh()
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      setError("Une erreur est survenue")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Connexion</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder à votre espace personnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          {isRegistered && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription>
                Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
              </AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Page de connexion avec Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
      <LoginForm />
    </Suspense>
  )
}
