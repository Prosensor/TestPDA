import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pharmacie Mozart - Maizière-lès-Metz",
  description:
    "Votre pharmacie de confiance à Maizière-lès-Metz. Services pharmaceutiques, conseils santé et bien-être.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <ClientLayout>{children}</ClientLayout>
    </Providers>
  )
}
