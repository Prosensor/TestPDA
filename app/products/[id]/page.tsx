"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, Heart, ShoppingCart, Plus, Minus, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductDetailPage({ params }) {
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])

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

  // Produits en promotion (base de données simulée)
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
    // ... autres produits
  ]

  // Gérer la quantité
  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  // Charger les données du produit
  useEffect(() => {
    const productId = Number.parseInt(params.id)

    // Simuler un appel API
    setTimeout(() => {
      const foundProduct = promotionalProducts.find((p) => p.id === productId) || {
        id: productId,
        name: "Produit exemple",
        description: "Description du produit exemple.",
        originalPrice: 10.0,
        salePrice: 7.5,
        image: "/placeholder.svg?height=300&width=300",
        category: "medicaments",
        stock: true,
        featured: false,
        details: "Détails du produit exemple.",
        usage: "Mode d'emploi du produit exemple.",
        warnings: "Précautions d'emploi du produit exemple.",
      }

      setProduct(foundProduct)

      // Trouver des produits similaires (même catégorie)
      const similar = promotionalProducts
        .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 3)

      setRelatedProducts(similar)
      setLoading(false)
    }, 500)
  }, [params.id])

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-16 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a4b8b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container px-4 md:px-6 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-[#1a4b8b] mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-8">Désolé, le produit que vous recherchez n'existe pas ou a été retiré.</p>
          <Button asChild className="rounded-full bg-[#1a4b8b]">
            <Link href="/products">Retour aux produits</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto">
      {/* Breadcrumb */}
      <div className="bg-[#f8fafc] border-b">
        <div className="container px-4 md:px-6 py-4">
          <Button variant="ghost" size="sm" className="flex items-center text-[#1a4b8b]" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative">
              <div className="bg-white rounded-xl overflow-hidden shadow-md border">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-[#8cc63f] hover:bg-[#8cc63f]">
                    -{calculateDiscount(product.originalPrice, product.salePrice)}%
                  </Badge>
                </div>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-auto object-contain aspect-square p-8"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#1a4b8b] mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-[#8cc63f]">{product.salePrice.toFixed(2)} €</span>
                <span className="text-lg text-gray-500 line-through">{product.originalPrice.toFixed(2)} €</span>
                <Badge variant="outline" className="ml-2 border-[#8cc63f] text-[#8cc63f]">
                  Économisez {(product.originalPrice - product.salePrice).toFixed(2)} €
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-amber-700">Offre valable jusqu'au {formatDate(promoEndDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                {product.stock ? (
                  <>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-green-700">En stock</span>
                  </>
                ) : (
                  <>
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-red-700">Rupture de stock</span>
                  </>
                )}
              </div>

              {product.stock && (
                <div className="flex flex-col space-y-6 pt-4">
                  <div className="flex items-center">
                    <span className="mr-4 text-gray-700">Quantité:</span>
                    <div className="flex items-center border rounded-full overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={incrementQuantity}
                        disabled={quantity >= 10}
                        className="h-10 w-10 rounded-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="rounded-full bg-[#1a4b8b] hover:bg-[#15407a] text-white flex-1">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Ajouter au panier
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-[#1a4b8b] text-[#1a4b8b] hover:bg-[#1a4b8b] hover:text-white"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Ajouter aux favoris
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-8 w-full justify-start overflow-x-auto">
                <TabsTrigger value="details">Détails du produit</TabsTrigger>
                <TabsTrigger value="usage">Conseils d'utilisation</TabsTrigger>
                <TabsTrigger value="warnings">Précautions d'emploi</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="text-gray-700">
                <p className="text-lg leading-relaxed">{product.details}</p>
              </TabsContent>

              <TabsContent value="usage" className="text-gray-700">
                <p className="text-lg leading-relaxed">{product.usage}</p>
              </TabsContent>

              <TabsContent value="warnings" className="text-gray-700">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700 text-lg">{product.warnings}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-[#1a4b8b] mb-8">Produits similaires</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <motion.div
                    key={relatedProduct.id}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="overflow-hidden h-full border border-gray-200 hover:border-[#1a4b8b]/30 hover:shadow-md transition-all">
                      <div className="relative">
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-[#8cc63f] hover:bg-[#8cc63f] text-xs">
                            -{calculateDiscount(relatedProduct.originalPrice, relatedProduct.salePrice)}%
                          </Badge>
                        </div>
                        <Image
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          width={300}
                          height={300}
                          className="w-full h-[180px] object-contain p-4"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-[#1a4b8b] mb-1 line-clamp-1">{relatedProduct.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedProduct.description}</p>

                        <div className="flex items-end gap-2 mb-3">
                          <span className="text-lg font-bold text-[#8cc63f]">
                            {relatedProduct.salePrice.toFixed(2)} €
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {relatedProduct.originalPrice.toFixed(2)} €
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {relatedProduct.stock ? (
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
                            className="text-[#1a4b8b] hover:text-[#1a4b8b] hover:bg-[#1a4b8b]/10 p-0"
                            asChild
                          >
                            <Link href={`/products/${relatedProduct.id}`}>Voir détails</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Products */}
          <div className="mt-16 text-center">
            <Button asChild className="rounded-full bg-[#1a4b8b] hover:bg-[#15407a] px-8">
              <Link href="/products">Retour à tous les produits</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

