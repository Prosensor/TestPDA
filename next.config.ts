import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   // Désactiver les vérifications ESLint pendant le build
   eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignorer les erreurs TypeScript pendant le build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Désactiver la génération statique pour les pages qui utilisent des hooks client
  output: 'standalone',
  // Ignorer les avertissements de taille de page
  reactStrictMode: true,
};

export default nextConfig;
