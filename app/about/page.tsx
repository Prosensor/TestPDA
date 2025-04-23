"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Award, Heart, Users, Leaf, Shield, ChevronRight, Quote, Star, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("history")

  // Équipe de la pharmacie
  const team = [
    {
      name: "Dr. Sophie Martin",
      role: "Pharmacienne titulaire",
      image: "/images/pharmacien.jpg",
      bio: "Docteur en pharmacie diplômée de la faculté de Nancy, Sophie a fondé la Pharmacie Mozart en 1998. Elle est spécialisée en phytothérapie et aromathérapie.",
    },
    {
      name: "Dr. Thomas Dubois",
      role: "Pharmacien adjoint",
      image: "/images/pharmacien.jpg",
      bio: "Avec plus de 15 ans d'expérience, Thomas est spécialisé dans le suivi des patients atteints de maladies chroniques et la nutrition.",
    },
    {
      name: "Marie Leroy",
      role: "Préparatrice en pharmacie",
      image: "/images/pharmacien.jpg",
      bio: "Marie travaille à la Pharmacie Mozart depuis 10 ans. Elle est experte en cosmétique et conseils dermatologiques.",
    },
    {
      name: "Lucas Bernard",
      role: "Préparateur en pharmacie",
      image: "/images/pharmacien.jpg",
      bio: "Lucas a rejoint notre équipe en 2018. Il est particulièrement investi dans le matériel médical et l'accompagnement des patients.",
    },
  ]

  // Valeurs de la pharmacie
  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Bienveillance",
      description:
        "Nous plaçons l'humain au cœur de notre métier, avec une écoute attentive et un accompagnement personnalisé.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Expertise",
      description:
        "Notre équipe se forme continuellement pour vous offrir des conseils professionnels et à jour avec les dernières avancées.",
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Responsabilité",
      description:
        "Nous nous engageons pour une santé durable, avec des produits sélectionnés pour leur qualité et leur impact environnemental.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Proximité",
      description:
        "Ancrés dans la vie locale depuis plus de 25 ans, nous sommes fiers de faire partie de la communauté de Maizière-lès-Metz.",
    },
  ]

  // Témoignages clients
  const testimonials = [
    {
      quote:
        "L'équipe de la Pharmacie Mozart est toujours disponible pour répondre à mes questions. Leur service est impeccable et leurs conseils sont précieux.",
      author: "Marie D.",
      rating: 5,
    },
    {
      quote:
        "Je suis client depuis plus de 10 ans. Les conseils personnalisés et l'attention portée à ma santé font toute la différence.",
      author: "Pierre L.",
      rating: 5,
    },
    {
      quote:
        "Le service de livraison à domicile a été d'une grande aide pendant ma convalescence. Merci pour votre professionnalisme.",
      author: "Sophie M.",
      rating: 5,
    },
    {
      quote:
        "J'apprécie particulièrement les conseils en aromathérapie. Grâce à eux, j'ai pu soulager mes problèmes de sommeil naturellement.",
      author: "Jean P.",
      rating: 4,
    },
  ]

  // Jalons historiques
  const milestones = [
    {
      year: "1998",
      title: "Fondation",
      description: "Ouverture de la Pharmacie Mozart par Dr. Sophie Martin dans le centre de Maizière-lès-Metz.",
    },
    {
      year: "2005",
      title: "Agrandissement",
      description:
        "Rénovation et agrandissement des locaux pour mieux vous accueillir et élargir notre gamme de produits.",
    },
    {
      year: "2012",
      title: "Nouveaux services",
      description:
        "Introduction de nouveaux services comme les consultations personnalisées et le suivi des patients chroniques.",
    },
    {
      year: "2018",
      title: "Modernisation",
      description:
        "Digitalisation de la pharmacie avec la mise en place de la réservation en ligne et du click & collect.",
    },
    {
      year: "2023",
      title: "25 ans d'expertise",
      description: "Célébration de notre 25ème anniversaire et lancement de nouveaux services de prévention santé.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen container mx-auto">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4b8b]/10 to-[#f8fafc] -z-10" />

        {/* Formes décoratives */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1a4b8b]/5 -z-10"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#8cc63f]/5 -z-10"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

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
              className="inline-flex items-center gap-2 bg-[#1a4b8b]/10 px-4 py-1.5 rounded-full text-[#1a4b8b] text-sm font-medium mb-6"
            >
              <Users className="h-4 w-4" />
              Notre histoire
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1a4b8b]">
              À propos de la Pharmacie Mozart
            </h1>
            <p className="text-xl text-gray-600">
              Depuis plus de 25 ans, nous prenons soin de votre santé avec passion et expertise
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -top-6 -left-6 w-24 h-24 bg-[#8cc63f]/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <motion.div
                  className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1a4b8b]/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/images/pharmacie.jpg"
                    alt="Pharmacie Mozart"
                    width={800}
                    height={600}
                    className="object-cover w-full h-[500px]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#1a4b8b]/10 px-3 py-1 rounded-full text-[#1a4b8b] text-sm font-medium">
                <Award className="h-4 w-4" />
                Notre mission
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#1a4b8b]">
                Une pharmacie à l'écoute de vos besoins
              </h2>
              <p className="text-lg text-gray-600">
                Fondée en 1998, la Pharmacie Mozart est devenue un pilier de la communauté de Maizière-lès-Metz. Notre
                mission est de vous offrir des soins pharmaceutiques de qualité, avec une approche personnalisée et
                bienveillante.
              </p>
              <p className="text-lg text-gray-600">
                Nous croyons en une approche holistique de la santé, où chaque patient est unique. Notre équipe de
                professionnels qualifiés s'engage à vous fournir des conseils adaptés à vos besoins spécifiques et à
                vous accompagner dans votre parcours de santé.
              </p>

              <div className="pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  </div>
                  <div>
                    <p className="text-gray-700">Une équipe de professionnels qualifiés et passionnés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  </div>
                  <div>
                    <p className="text-gray-700">Des conseils personnalisés pour votre bien-être</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-[#8cc63f]" />
                  </div>
                  <div>
                    <p className="text-gray-700">Un engagement fort dans la vie locale</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <div className="mt-20">
            <Tabs defaultValue="history" onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="grid grid-cols-3 md:w-[600px]">
                  <TabsTrigger value="history" className="text-base">
                    Notre histoire
                  </TabsTrigger>
                  <TabsTrigger value="team" className="text-base">
                    Notre équipe
                  </TabsTrigger>
                  <TabsTrigger value="values" className="text-base">
                    Nos valeurs
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="history" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h3 className="text-2xl font-bold text-[#1a4b8b] mb-4">Notre parcours depuis 1998</h3>
                    <p className="text-gray-600">
                      Découvrez les moments clés qui ont façonné l'histoire de la Pharmacie Mozart au fil des années
                    </p>
                  </div>

                  <div className="relative max-w-4xl mx-auto">
                    {/* Ligne verticale */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-[#1a4b8b]/20"></div>

                    {/* Jalons */}
                    <div className="space-y-16">
                      {milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className={`relative flex items-center ${index % 2 === 0 ? "flex-row-reverse" : ""}`}
                        >
                          <div className="flex-1"></div>

                          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                            <div className="bg-[#1a4b8b] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold z-10">
                              {milestone.year}
                            </div>
                          </div>

                          <motion.div
                            className="flex-1 p-6"
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="border-[#1a4b8b]/10">
                              <CardContent className="p-6">
                                <h4 className="text-xl font-bold text-[#1a4b8b] mb-2">{milestone.title}</h4>
                                <p className="text-gray-600">{milestone.description}</p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="team" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h3 className="text-2xl font-bold text-[#1a4b8b] mb-4">Notre équipe de professionnels</h3>
                    <p className="text-gray-600">
                      Rencontrez les personnes dévouées qui prennent soin de votre santé au quotidien
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="border-[#1a4b8b]/10 overflow-hidden h-full">
                          <div className="aspect-square relative">
                            <Image
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-6">
                            <h4 className="text-xl font-bold text-[#1a4b8b] mb-1">{member.name}</h4>
                            <p className="text-[#8cc63f] font-medium mb-4">{member.role}</p>
                            <p className="text-gray-600">{member.bio}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-16 text-center">
                    <p className="text-lg text-gray-600 mb-6">
                      Vous souhaitez rejoindre notre équipe dynamique et passionnée ?
                    </p>
                    <Button className="rounded-full px-8 bg-[#1a4b8b] hover:bg-[#15407a]" asChild>
                      <Link href="/contact">
                        Voir nos offres d'emploi
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="values" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <h3 className="text-2xl font-bold text-[#1a4b8b] mb-4">Nos valeurs fondamentales</h3>
                    <p className="text-gray-600">
                      Les principes qui guident nos actions et notre engagement envers vous
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {values.map((value, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="border-[#1a4b8b]/10 h-full">
                          <CardContent className="p-6">
                            <div className="bg-[#1a4b8b]/10 p-3 rounded-full w-fit mb-4">
                              <div className="text-[#1a4b8b]">{value.icon}</div>
                            </div>
                            <h4 className="text-xl font-bold text-[#1a4b8b] mb-3">{value.title}</h4>
                            <p className="text-gray-600">{value.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-16 bg-[#1a4b8b] text-white rounded-2xl p-8 max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">Notre engagement qualité</h3>
                        <p className="mb-6">
                          Nous nous engageons à vous offrir des produits et services de la plus haute qualité,
                          sélectionnés avec soin par notre équipe d'experts.
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-3">
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span>Formation continue de notre équipe</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span>Sélection rigoureuse de nos produits</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="bg-white/20 p-1 rounded-full mt-1">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span>Respect des normes pharmaceutiques</span>
                          </li>
                        </ul>
                      </div>
                      <div className="relative h-[250px] md:h-auto rounded-xl overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=400&width=400"
                          alt="Engagement qualité"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-[#1a4b8b]/10 px-4 py-1.5 rounded-full text-[#1a4b8b] text-sm font-medium mb-4">
              <Quote className="h-4 w-4 inline mr-2" />
              Témoignages
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#1a4b8b]">Ce que disent nos clients</h2>
            <p className="text-lg text-gray-600">
              Découvrez pourquoi nos clients nous font confiance pour leurs besoins en matière de santé
            </p>
          </motion.div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-4">
                  <Card className="border-[#1a4b8b]/10 h-full">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`inline h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <blockquote className="text-gray-600 italic mb-6">"{testimonial.quote}"</blockquote>
                      <p className="font-medium text-[#1a4b8b]">— {testimonial.author}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative static translate-y-0 mr-2" />
              <CarouselNext className="relative static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
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

              <div className="relative text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-6">
                  Prenez rendez-vous avec nos pharmaciens
                </h2>
                <p className="text-white/90 text-lg mb-8">
                  Bénéficiez de conseils personnalisés pour votre santé et votre bien-être. Notre équipe est à votre
                  disposition pour répondre à toutes vos questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="rounded-full px-8" asChild>
                    <Link href="/contact">Prendre rendez-vous</Link>
                  </Button>
                  <Button size="lg" className="bg-[#8cc63f] hover:bg-[#78a835] text-white rounded-full px-8" asChild>
                    <Link href="/services">Découvrir nos services</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

