"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingBag, Tag, Calendar, Check, ChevronRight, Pill, Sparkles, Leaf, Smile, Baby, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  // Date de fin des promotions (une semaine à partir d'aujourd'hui)
  const promoEndDate = new Date()
  promoEndDate.setDate(promoEndDate.getDate() + 7)

  // Formater la date pour l'affichage
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  // Calculer le pourcentage de réduction
  const calculateDiscount = (originalPrice, salePrice) => {
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }

  // Produits en promotion
  const promotionalProducts = [
    {
      id: 1,
      name: "Doliprane 1000mg",
      description: "Soulage la douleur et réduit la fièvre. Boîte de 8 comprimés.",
      originalPrice: 4.95,
      salePrice: 3.95,
      image: "/placeholder.svg?height=300&width=300",
      category: "medicaments",
      stock: true,
      featured: true,
      details:
        "Le paracétamol est utilisé pour traiter la douleur et la fièvre. Il peut être utilisé en cas de maux de tête, douleurs dentaires, courbatures, douleurs menstruelles, ou encore en cas de fièvre lors d'un rhume ou d'une grippe.",
      usage:
        "Adultes et enfants de plus de 50 kg (à partir d'environ 15 ans) : 1 comprimé par prise, à renouveler si nécessaire au bout de 6 heures minimum. En cas de douleurs ou de fièvre plus intenses, 2 comprimés par prise. Ne pas dépasser 3 g de paracétamol par jour.",
      warnings:
        "Ne pas dépasser la dose prescrite. En cas de surdosage, consultez immédiatement votre médecin. Ce médicament contient du paracétamol. D'autres médicaments en contiennent. Vérifiez que vous ne prenez pas d'autres médicaments contenant du paracétamol, pour ne pas dépasser la dose quotidienne recommandée.",
    },
    {
      id: 2,
      name: "Advil 200mg",
      description:
        "Anti-inflammatoire non stéroïdien. Soulage les douleurs et réduit l'inflammation. Boîte de 20 comprimés.",
      originalPrice: 6.5,
      salePrice: 4.95,
      image: "/placeholder.svg?height=300&width=300",
      category: "medicaments",
      stock: true,
      featured: false,
      details:
        "L'ibuprofène est un anti-inflammatoire non stéroïdien (AINS) qui soulage la douleur, réduit l'inflammation et fait baisser la fièvre. Il est particulièrement efficace pour les douleurs d'origine inflammatoire.",
      usage:
        "Adultes et enfants de plus de 12 ans : 1 comprimé par prise, à renouveler si nécessaire toutes les 6 à 8 heures. Ne pas dépasser 3 comprimés par jour. À prendre de préférence au cours d'un repas.",
      warnings:
        "Ne pas utiliser si vous avez des antécédents d'allergie ou d'asthme déclenchés par la prise d'ibuprofène ou d'autres anti-inflammatoires non stéroïdiens. Ne pas utiliser si vous avez un ulcère de l'estomac ou du duodénum en évolution.",
    },
    {
      id: 3,
      name: "Crème hydratante Avène",
      description: "Crème hydratante pour peaux sensibles. Hydrate et apaise la peau. Tube de 50ml.",
      originalPrice: 12.9,
      salePrice: 9.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "beaute",
      stock: true,
      featured: true,
      details:
        "Cette crème hydratante est spécialement formulée pour les peaux sensibles. Elle hydrate intensément la peau tout en l'apaisant grâce à l'eau thermale d'Avène. Sa texture légère pénètre rapidement sans laisser de film gras.",
      usage: "Appliquer matin et/ou soir sur le visage et le cou parfaitement nettoyés.",
      warnings: "Éviter le contact avec les yeux. En cas de contact, rincer abondamment à l'eau claire.",
    },
    {
      id: 4,
      name: "Vitamine D3 1000 UI",
      description:
        "Complément alimentaire pour maintenir des os solides et soutenir le système immunitaire. Flacon de 90 comprimés.",
      originalPrice: 15.5,
      salePrice: 11.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "complements",
      stock: true,
      featured: false,
      details:
        "La vitamine D contribue au maintien d'une ossature normale et au fonctionnement normal du système immunitaire. Elle aide également à l'absorption et à l'utilisation normales du calcium et du phosphore.",
      usage:
        "Adultes et adolescents : 1 comprimé par jour, à avaler avec un verre d'eau, de préférence pendant un repas.",
      warnings:
        "Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des jeunes enfants. Ce complément alimentaire ne doit pas se substituer à une alimentation variée et équilibrée et à un mode de vie sain.",
    },
    {
      id: 5,
      name: "Thermomètre digital",
      description:
        "Thermomètre électronique pour une mesure précise de la température corporelle. Résultat en 10 secondes.",
      originalPrice: 9.9,
      salePrice: 7.5,
      image: "/placeholder.svg?height=300&width=300",
      category: "materiel",
      stock: false,
      featured: false,
      details:
        "Ce thermomètre digital permet une mesure précise et rapide de la température corporelle. Il est équipé d'un signal sonore de fin de mesure et d'une mémoire qui enregistre la dernière température prise.",
      usage:
        "Peut être utilisé pour une prise de température buccale, axillaire ou rectale. Nettoyer avant et après chaque utilisation.",
      warnings: "Nettoyer soigneusement avant et après chaque utilisation. Ne pas faire bouillir pour stériliser.",
    },
    {
      id: 6,
      name: "Gel hydroalcoolique 100ml",
      description: "Désinfecte les mains sans eau ni savon. Élimine 99,9% des bactéries et virus.",
      originalPrice: 3.5,
      salePrice: 2.5,
      image: "/placeholder.svg?height=300&width=300",
      category: "hygiene",
      stock: true,
      featured: true,
      details:
        "Ce gel hydroalcoolique permet de désinfecter efficacement les mains sans eau ni savon. Sa formule enrichie en glycérine prévient le dessèchement de la peau, même en cas d'utilisations fréquentes.",
      usage:
        "Appliquer une noisette de gel dans le creux de la main et frictionner jusqu'à séchage complet. Ne pas rincer.",
      warnings:
        "Usage externe uniquement. Éviter le contact avec les yeux. Tenir hors de portée des enfants. Produit inflammable.",
    },
    {
      id: 7,
      name: "Compresses stériles",
      description: "Lot de 10 sachets de 2 compresses stériles 10x10cm. Idéales pour les soins de plaies.",
      originalPrice: 4.2,
      salePrice: 3.2,
      image: "/placeholder.svg?height=300&width=300",
      category: "materiel",
      stock: true,
      featured: false,
      details:
        "Ces compresses stériles sont idéales pour le nettoyage et la protection des plaies. Elles sont douces, absorbantes et ne collent pas à la plaie.",
      usage: "Ouvrir le sachet en respectant les règles d'asepsie. Appliquer sur la plaie après nettoyage.",
      warnings: "Usage unique. Ne pas réutiliser une compresse déjà utilisée pour éviter tout risque d'infection.",
    },
    {
      id: 8,
      name: "Crème solaire SPF50+",
      description: "Protection très haute contre les UVA et UVB. Résistante à l'eau. Tube de 50ml.",
      originalPrice: 14.9,
      salePrice: 11.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "beaute",
      stock: true,
      featured: false,
      details:
        "Cette crème solaire offre une très haute protection contre les rayons UVA et UVB. Sa formule résistante à l'eau est idéale pour les activités de plein air et la baignade.",
      usage:
        "Appliquer généreusement avant l'exposition au soleil. Renouveler fréquemment l'application, surtout après la baignade, la transpiration ou s'être essuyé.",
      warnings:
        "Même avec une bonne protection solaire, évitez les expositions prolongées au soleil. Protégez les bébés et les jeunes enfants des rayons directs du soleil.",
    },
    {
      id: 9,
      name: "Magnésium marin",
      description:
        "Contribue à réduire la fatigue et au fonctionnement normal du système nerveux. Boîte de 60 gélules.",
      originalPrice: 12.5,
      salePrice: 9.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "complements",
      stock: true,
      featured: false,
      details:
        "Le magnésium contribue à réduire la fatigue, au fonctionnement normal du système nerveux et à une fonction musculaire normale. Ce complément est particulièrement recommandé en cas de fatigue, stress ou crampes musculaires.",
      usage: "2 gélules par jour, à prendre au moment des repas avec un grand verre d'eau.",
      warnings:
        "Ne pas dépasser la dose journalière recommandée. Tenir hors de portée des jeunes enfants. Ce complément alimentaire ne doit pas se substituer à une alimentation variée et équilibrée et à un mode de vie sain.",
    },
    {
      id: 10,
      name: "Brosse à dents électrique",
      description: "Élimine jusqu'à 100% de plaque dentaire en plus qu'une brosse manuelle. Batterie rechargeable.",
      originalPrice: 49.9,
      salePrice: 39.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "hygiene",
      stock: true,
      featured: true,
      details:
        "Cette brosse à dents électrique offre un nettoyage supérieur grâce à ses mouvements oscillatoires et rotatifs. Elle est équipée d'un minuteur pour vous aider à respecter le temps de brossage recommandé par les dentistes.",
      usage: "Utiliser matin et soir pendant 2 minutes. Remplacer la tête de brosse tous les 3 mois.",
      warnings:
        "Ne pas partager votre brosse à dents avec d'autres personnes. Consulter un dentiste avant utilisation si vous avez subi une chirurgie bucco-dentaire récente.",
    },
    {
      id: 11,
      name: "Spray nasal eau de mer",
      description: "Nettoie et hydrate les fosses nasales. Convient aux adultes et enfants. Flacon de 100ml.",
      originalPrice: 6.9,
      salePrice: 4.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "medicaments",
      stock: true,
      featured: false,
      details:
        "Ce spray à l'eau de mer isotonique nettoie en douceur les fosses nasales et aide à éliminer les impuretés et les allergènes. Il hydrate la muqueuse nasale et facilite la respiration.",
      usage: "1 à 2 pulvérisations dans chaque narine, 2 à 3 fois par jour ou selon les besoins.",
      warnings:
        "Pour des raisons d'hygiène, il est recommandé de ne pas partager ce produit. Rincer l'embout à l'eau chaude après chaque utilisation.",
    },
    {
      id: 12,
      name: "Huile essentielle de Lavande",
      description: "100% pure et naturelle. Propriétés relaxantes et apaisantes. Flacon de 10ml.",
      originalPrice: 8.5,
      salePrice: 6.5,
      image: "/placeholder.svg?height=300&width=300",
      category: "aromatherapie",
      stock: true,
      featured: false,
      details:
        "L'huile essentielle de lavande est connue pour ses propriétés relaxantes et apaisantes. Elle peut aider à favoriser le sommeil, soulager le stress et les tensions nerveuses, et apaiser les petites irritations cutanées.",
      usage:
        "En diffusion : 5 à 10 gouttes dans un diffuseur. En massage : diluer 2 à 3 gouttes dans une huile végétale.",
      warnings:
        "Ne pas utiliser pure sur la peau. Tenir hors de portée des enfants. Déconseillé aux femmes enceintes ou allaitantes et aux enfants de moins de 7 ans sans avis médical.",
    },
    {
      id: 13,
      name: "Pansements hypoallergéniques",
      description: "Boîte de 40 pansements de différentes tailles. Imperméables et respirants.",
      originalPrice: 5.9,
      salePrice: 4.5,
      image: "/placeholder.svg?height=300&width=300",
      category: "materiel",
      stock: true,
      featured: false,
      details:
        "Ces pansements hypoallergéniques sont conçus pour les peaux sensibles. Ils sont imperméables à l'eau et aux bactéries, tout en laissant la peau respirer pour favoriser la cicatrisation.",
      usage:
        "Nettoyer et sécher la plaie avant d'appliquer le pansement. Changer le pansement quotidiennement ou dès qu'il est mouillé ou souillé.",
      warnings: "Usage externe uniquement. Si la plaie s'infecte ou ne cicatrise pas, consultez un médecin.",
    },
    {
      id: 14,
      name: "Tisane sommeil",
      description:
        "Mélange de plantes pour favoriser l'endormissement et améliorer la qualité du sommeil. Boîte de 20 sachets.",
      originalPrice: 7.9,
      salePrice: 5.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "aromatherapie",
      stock: true,
      featured: false,
      details:
        "Cette tisane combine plusieurs plantes reconnues pour leurs propriétés relaxantes et favorisant le sommeil : valériane, passiflore, mélisse et camomille. Elle aide à l'endormissement et améliore la qualité du sommeil.",
      usage:
        "Laisser infuser un sachet dans une tasse d'eau bouillante pendant 5 à 10 minutes. Boire une tasse 30 minutes avant le coucher.",
      warnings:
        "Déconseillé aux femmes enceintes ou allaitantes et aux enfants de moins de 12 ans sans avis médical. Ne pas consommer en cas de traitement médicamenteux sans avis médical.",
    },
    {
      id: 15,
      name: "Lait corporel hydratant",
      description: "Hydratation intense pour peaux sèches et sensibles. Sans parfum. Flacon pompe 400ml.",
      originalPrice: 11.9,
      salePrice: 8.9,
      image: "/placeholder.svg?height=300&width=300",
      category: "beaute",
      stock: true,
      featured: false,
      details:
        "Ce lait corporel offre une hydratation intense et durable pour les peaux sèches et sensibles. Sa formule enrichie en beurre de karité et en huile d'amande douce nourrit la peau en profondeur et restaure son film hydrolipidique.",
      usage:
        "Appliquer quotidiennement sur l'ensemble du corps après la douche ou le bain, sur peau sèche ou légèrement humide.",
      warnings: "Éviter le contact avec les yeux. En cas de contact, rincer abondamment à l'eau claire.",
    },
  ]

  // Catégories de produits
  const categories = [
    { id: "all", name: "Tous les produits", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "medicaments", name: "Médicaments sans ordonnance", icon: <Pill className="h-5 w-5" /> },
    { id: "beaute", name: "Beauté & Soins", icon: <Smile className="h-5 w-5" /> },
    { id: "complements", name: "Compléments alimentaires", icon: <Leaf className="h-5 w-5" /> },
    { id: "hygiene", name: "Hygiène", icon: <Baby className="h-5 w-5" /> },
    { id: "materiel", name: "Matériel médical", icon: <Info className="h-5 w-5" /> },
    { id: "aromatherapie", name: "Aromathérapie", icon: <Sparkles className="h-5 w-5" /> },
  ]

  // Filtrer les produits selon la catégorie active
  const filteredProducts =
    activeCategory === "all"
      ? promotionalProducts
      : promotionalProducts.filter((product) => product.category === activeCategory)

  // Produits mis en avant
  const featuredProducts = promotionalProducts.filter((product) => product.featured)

  // Réinitialiser la sélection lors du changement de catégorie
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeCategory])

  return (
    <div className="flex flex-col min-h-screen container mx-auto">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Fond principal */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-[#f8fafc]" />

          {/* Formes organiques */}
          <motion.div
            className="absolute top-0 right-0 w-[80%] h-[70%] bg-[#1a4b8b]/5 rounded-bl-[100px]"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[60%] h-[50%] bg-[#8cc63f]/5 rounded-tr-[80px]"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Points décoratifs */}
          <div className="absolute inset-0 opacity-[0.07]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(#1a4b8b 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
          </div>
        </motion.div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#1a4b8b]/10 px-3 py-1 rounded-full text-[#1a4b8b] text-sm font-medium mb-4"
            >
              <Tag className="h-4 w-4 text-[#1a4b8b]" />
              Promotions hebdomadaires
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-[#1a4b8b]">
              Nos offres spéciales
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez notre sélection de produits à prix réduits, renouvelée chaque semaine
            </p>

            <motion.div
              className="flex items-center justify-center gap-2 text-[#8cc63f] font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Calendar className="h-5 w-5" />
              <span>Offres valables jusqu'au {formatDate(promoEndDate)}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Produits mis en avant */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-[#1a4b8b] mb-8">Produits vedettes</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="overflow-hidden h-full border border-gray-200 hover:border-[#1a4b8b]/30 hover:shadow-lg transition-all">
                  <div className="relative">
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-[#8cc63f] hover:bg-[#8cc63f]">
                        -{calculateDiscount(product.originalPrice, product.salePrice)}%
                      </Badge>
                    </div>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-[200px] object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-[#1a4b8b] mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-xl font-bold text-[#8cc63f]">{product.salePrice.toFixed(2)} €</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice.toFixed(2)} €</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.stock ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-green-700">En stock</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-xs text-red-700">Rupture de stock</span>
                          </>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1a4b8b] hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/10"
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          Voir détails
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tous les produits */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-[#1a4b8b] mb-8">Tous nos produits en promotion</h2>

          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`rounded-full ${
                  activeCategory === category.id
                    ? "bg-[#1a4b8b] hover:bg-[#15407a] text-white"
                    : "border-[#1a4b8b]/30 text-[#1a4b8b] hover:bg-[#1a4b8b] hover:text-white"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="overflow-hidden h-full border border-gray-200 hover:border-[#1a4b8b]/30 hover:shadow-md transition-all">
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-[#8cc63f] hover:bg-[#8cc63f] text-xs">
                        -{calculateDiscount(product.originalPrice, product.salePrice)}%
                      </Badge>
                    </div>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-[140px] md:h-[180px] object-contain p-4"
                    />
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-bold text-[#1a4b8b] mb-1 line-clamp-1 text-sm md:text-base">{product.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-end gap-2 mb-2 md:mb-3">
                      <span className="text-base md:text-lg font-bold text-[#8cc63f]">
                        {product.salePrice.toFixed(2)} €
                      </span>
                      <span className="text-xs text-gray-500 line-through">{product.originalPrice.toFixed(2)} €</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {product.stock ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-xs text-green-700">En stock</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <span className="text-xs text-red-700">Rupture</span>
                          </>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#1a4b8b] hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/10 p-0 h-8"
                        asChild
                      >
                        <Link href={`/products/${product.id}`}>
                          Détails
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <motion.div
            className="bg-[#1a4b8b] rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative p-8 md:p-12">
              <motion.div
                className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[#8cc63f]/10"
                initial={{ scale: 0, x: 100 }}
                whileInView={{ scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-[#8cc63f]/10"
                initial={{ scale: 0, x: -50 }}
                whileInView={{ scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
              />

              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white space-y-6">
                  <h2 className="text-3xl font-bold tracking-tight">Ne manquez pas nos promotions!</h2>
                  <p className="text-white/80 text-lg">
                    Inscrivez-vous à notre newsletter pour être informé en avant-première des nouvelles offres et
                    promotions exclusives.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="secondary" asChild className="rounded-full px-8">
                        <Link href="/contact">S'inscrire à la newsletter</Link>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        className="bg-[#8cc63f] hover:bg-[#78a835] text-white rounded-full px-8"
                        asChild
                      >
                        <Link href="/services">Découvrir nos services</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-4">Avantages de nos promotions</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-[#8cc63f]" />
                        </div>
                        <span className="text-white/90">Nouvelles offres chaque semaine</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-[#8cc63f]" />
                        </div>
                        <span className="text-white/90">Réductions exclusives jusqu'à 50%</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-[#8cc63f]" />
                        </div>
                        <span className="text-white/90">Produits de qualité sélectionnés par nos pharmaciens</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                          <Check className="h-4 w-4 text-[#8cc63f]" />
                        </div>
                        <span className="text-white/90">Livraison gratuite à partir de 49€ d'achat</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

