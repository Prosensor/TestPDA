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
  // Ignorer les avertissements de taille de page
  reactStrictMode: true,
  swcMinify: true,
  // Ajouter cette option pour éviter les problèmes avec certaines dépendances
  webpack: (config, { isServer }) => {
    // Configurations webpack spécifiques si nécessaire
    return config;
  },
};

export default nextConfig;
