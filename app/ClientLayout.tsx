"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  Home,
  Stethoscope,
  ShoppingBag,
  Info,
  X,
  LayoutDashboard,
  LogIn,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [menuAnimating, setMenuAnimating] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Gérer le blocage du défilement lorsque le menu est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      // Petit délai pour permettre à l'animation de se terminer avant de réactiver le défilement
      const timer = setTimeout(() => {
        document.body.style.overflow = ""
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [mobileMenuOpen])

  // Gérer l'ouverture du menu avec animation
  const openMenu = () => {
    setMenuAnimating(true)
    setMobileMenuOpen(true)
  }

  // Gérer la fermeture du menu avec animation
  const closeMenu = () => {
    setMenuAnimating(true)
    setMobileMenuOpen(false)
  }

  // Vérifier si un lien est actif
  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            {/* Barre d'informations */}
            <div className="hidden md:block bg-[#1a4b8b] text-white py-2">
              <div className="container mx-auto px-4 md:px-6 flex justify-between items-center text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> 03 87 80 21 06
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> contact@pharmaciemozart.com
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span>Lun-Ven: 8h00-12h30 14h00-19h30 | Sam: 8h00-17h00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Header principal */}
            <header className="sticky top-0 z-40 bg-white shadow-sm">
              <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex justify-between items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/images/logo.png"
                      alt="Pharmacie Mozart"
                      width={180}
                      height={60}
                      className="h-12 w-auto"
                    />
                  </Link>

                  {/* Menu desktop */}
                  <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-1">
                      <Link
                        href="/"
                        className={`px-4 py-2 rounded-md font-medium transition-colors relative group ${
                          isActive("/")
                            ? "text-[#1a4b8b] bg-[#1a4b8b]/5"
                            : "text-gray-700 hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/5"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Home className="h-4 w-4" />
                          Accueil
                        </span>
                        {isActive("/") && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a4b8b] rounded-full"></span>
                        )}
                      </Link>

                      <Link
                        href="/services"
                        className={`px-4 py-2 rounded-md font-medium transition-colors relative group ${
                          isActive("/services")
                            ? "text-[#1a4b8b] bg-[#1a4b8b]/5"
                            : "text-gray-700 hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/5"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Stethoscope className="h-4 w-4" />
                          Services
                        </span>
                        {isActive("/services") && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a4b8b] rounded-full"></span>
                        )}
                      </Link>

                      <Link
                        href="/products"
                        className={`px-4 py-2 rounded-md font-medium transition-colors relative group ${
                          isActive("/products")
                            ? "text-[#1a4b8b] bg-[#1a4b8b]/5"
                            : "text-gray-700 hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/5"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="h-4 w-4" />
                          Produits
                        </span>
                        {isActive("/products") && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a4b8b] rounded-full"></span>
                        )}
                      </Link>

                      <Link
                        href="/about"
                        className={`px-4 py-2 rounded-md font-medium transition-colors relative group ${
                          isActive("/about")
                            ? "text-[#1a4b8b] bg-[#1a4b8b]/5"
                            : "text-gray-700 hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/5"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Info className="h-4 w-4" />À propos
                        </span>
                        {isActive("/about") && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a4b8b] rounded-full"></span>
                        )}
                      </Link>

                      <Link
                        href="/contact"
                        className={`px-4 py-2 rounded-md font-medium transition-colors relative group ${
                          isActive("/contact")
                            ? "text-[#1a4b8b] bg-[#1a4b8b]/5"
                            : "text-gray-700 hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/5"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" />
                          Contact
                        </span>
                        {isActive("/contact") && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a4b8b] rounded-full"></span>
                        )}
                      </Link>
                    </nav>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Bouton Dashboard/Login pour desktop */}
                    <div className="hidden md:block">
                      {session ? (
                        <Button className="bg-[#8cc63f] hover:bg-[#78a835] text-white rounded-full" asChild>
                          <Link href="/dashboard" className="flex items-center gap-1.5">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </Button>
                      ) : (
                        <Button className="bg-[#1a4b8b] hover:bg-[#15407a] text-white rounded-full" asChild>
                          <Link href="/login" className="flex items-center gap-1.5">
                            <LogIn className="h-4 w-4" />
                            Connexion
                          </Link>
                        </Button>
                      )}
                    </div>

                    {/* Menu mobile button */}
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={openMenu}>
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Overlay pour le menu mobile */}
            <div
              className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={closeMenu}
            />

            {/* Menu mobile personnalisé avec animation */}
            <div
              className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              onTransitionEnd={() => setMenuAnimating(false)}
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/images/logo.png"
                      alt="Pharmacie Mozart"
                      width={150}
                      height={50}
                      className="h-10 w-auto"
                    />
                  </Link>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={closeMenu}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </div>

                <div className="flex-1 overflow-auto p-6">
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a4b8b]/10 transition-colors"
                      onClick={closeMenu}
                    >
                      <Home className="h-5 w-5 text-[#1a4b8b]" />
                      <span className="text-lg">Accueil</span>
                    </Link>
                    <Link
                      href="/services"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a4b8b]/10 transition-colors"
                      onClick={closeMenu}
                    >
                      <Stethoscope className="h-5 w-5 text-[#1a4b8b]" />
                      <span className="text-lg">Services</span>
                    </Link>
                    <Link
                      href="/products"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a4b8b]/10 transition-colors"
                      onClick={closeMenu}
                    >
                      <ShoppingBag className="h-5 w-5 text-[#1a4b8b]" />
                      <span className="text-lg">Produits</span>
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a4b8b]/10 transition-colors"
                      onClick={closeMenu}
                    >
                      <Info className="h-5 w-5 text-[#1a4b8b]" />
                      <span className="text-lg">À propos</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1a4b8b]/10 transition-colors"
                      onClick={closeMenu}
                    >
                      <Mail className="h-5 w-5 text-[#1a4b8b]" />
                      <span className="text-lg">Contact</span>
                    </Link>

                    {/* Bouton Dashboard/Login pour mobile */}
                    {session ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg bg-[#8cc63f] text-white transition-colors"
                        onClick={closeMenu}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="text-lg">Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-3 mt-4 rounded-lg bg-[#1a4b8b] text-white transition-colors"
                        onClick={closeMenu}
                      >
                        <LogIn className="h-5 w-5" />
                        <span className="text-lg">Connexion</span>
                      </Link>
                    )}
                  </nav>
                </div>

                <div className="p-6 border-t bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-5 w-5 text-[#1a4b8b]" />
                    <span className="text-lg">03 87 80 21 06</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#1a4b8b]" />
                    <span>5 Rte de Metz, 57280 Maizière-lès-Metz</span>
                  </div>
                </div>
              </div>
            </div>

            <main className="flex-1">{children}</main>

            <footer className="bg-[#f8fafc] border-t">
              <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                  <div className="space-y-4 md:max-w-xs">
                    <Image
                      src="/images/logo.png"
                      alt="Pharmacie Mozart"
                      width={180}
                      height={60}
                      className="h-12 w-auto"
                    />
                    <p className="text-muted-foreground">
                      Votre pharmacie de confiance à Maizière-lès-Metz depuis 1998. Une équipe de professionnels à votre
                      écoute pour tous vos besoins de santé.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-[#1a4b8b]">Liens rapides</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/" className="hover:text-[#1a4b8b] transition-colors">
                            Accueil
                          </Link>
                        </li>
                        <li>
                          <Link href="/services" className="hover:text-[#1a4b8b] transition-colors">
                            Services
                          </Link>
                        </li>
                        <li>
                          <Link href="/products" className="hover:text-[#1a4b8b] transition-colors">
                            Produits
                          </Link>
                        </li>
                        <li>
                          <Link href="/about" className="hover:text-[#1a4b8b] transition-colors">
                            À propos
                          </Link>
                        </li>
                        <li>
                          <Link href="/contact" className="hover:text-[#1a4b8b] transition-colors">
                            Contact
                          </Link>
                        </li>
                        {session && (
                          <li>
                            <Link href="/dashboard" className="hover:text-[#1a4b8b] transition-colors">
                              Dashboard
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-[#1a4b8b]">Services</h3>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/services" className="hover:text-[#1a4b8b] transition-colors">
                            Dispensation de médicaments
                          </Link>
                        </li>
                        <li>
                          <Link href="/services" className="hover:text-[#1a4b8b] transition-colors">
                            Conseils santé
                          </Link>
                        </li>
                        <li>
                          <Link href="/services" className="hover:text-[#1a4b8b] transition-colors">
                            Suivi thérapeutique
                          </Link>
                        </li>
                        <li>
                          <Link href="/services" className="hover:text-[#1a4b8b] transition-colors">
                            Vaccination
                          </Link>
                        </li>
                        <li>
                          <Link href="/services" className="hover:text-[#1a4b8b] transition-colors">
                            Matériel médical
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-[#1a4b8b]">Contact</h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-[#1a4b8b]" />
                          <span>
                            5 Rte de Metz
                            <br />
                            57280 Maizière-lès-Metz
                            <br />
                            France
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#1a4b8b]" />
                          <span>03 87 80 21 06</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#1a4b8b]" />
                          <span>contact@pharmaciemozart.com</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Pharmacie Mozart. Tous droits réservés.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <Link href="/privacy" className="hover:text-[#1a4b8b] transition-colors">
                      Politique de confidentialité
                    </Link>
                    <Link href="/terms" className="hover:text-[#1a4b8b] transition-colors">
                      Conditions d'utilisation
                    </Link>
                    <Link href="/legal" className="hover:text-[#1a4b8b] transition-colors">
                      Mentions légales
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
