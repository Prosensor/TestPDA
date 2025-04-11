"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DebugPage() {
  const [email, setEmail] = useState("pharmaciemozart@gmail.com")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const checkUser = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Une erreur est survenue" })
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Une erreur est survenue" })
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Une erreur est survenue" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Page de débogage</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vérifier l'utilisateur</CardTitle>
            <CardDescription>Vérifier si l'utilisateur existe dans la base de données</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="check-email">Email</Label>
                <Input
                  id="check-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email à vérifier"
                />
              </div>
              <Button onClick={checkUser} disabled={loading}>
                {loading ? "Vérification..." : "Vérifier l'utilisateur"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tester la connexion</CardTitle>
            <CardDescription>Tester les identifiants de connexion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-email">Email</Label>
                <Input id="test-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-password">Mot de passe</Label>
                <Input
                  id="test-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                />
              </div>
              <Button onClick={testLogin} disabled={loading}>
                {loading ? "Test en cours..." : "Tester la connexion"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>Définir un nouveau mot de passe pour l'utilisateur</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input id="reset-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                />
              </div>
              <Button onClick={resetPassword} disabled={loading}>
                {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résultat</CardTitle>
            <CardDescription>Résultat de l'opération</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {result ? JSON.stringify(result, null, 2) : "Aucun résultat"}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
