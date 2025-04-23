"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Pill,
  Stethoscope,
  Calendar,
  PlusCircle,
  ShieldCheck,
  HeartPulse,
  Thermometer,
  Microscope,
  ChevronRight,
  Clock,
  Video,
  Truck,
  Sparkles,
  Smartphone,
  Users,
  Home,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ServicesPage() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  const [activeCategory, setActiveCategory] = useState("all")

  const serviceCategories = [
    { id: "all", label: "Tous les services" },
    { id: "specialized", label: "Services spécialisés" },
    { id: "traditional", label: "Services traditionnels" },
    { id: "digital", label: "Services numériques" },
  ]

  const services = [
    {
      id: 1,
      icon: <Pill className="h-6 w-6" />,
      title: "Dispensation de médicaments",
      description: "Ordonnances, médicaments sans ordonnance, et conseils personnalisés pour votre traitement.",
      category: "traditional",
    },
    {
      id: 2,
      icon: <Stethoscope className="h-6 w-6" />,
      title: "Conseils santé",
      description: "Consultations personnalisées pour vous aider à gérer votre santé et votre bien-être.",
      category: "traditional",
    },
    {
      id: 3,
      icon: <Calendar className="h-6 w-6" />,
      title: "Suivi thérapeutique",
      description: "Programmes de suivi pour les maladies chroniques et les traitements à long terme.",
      category: "specialized",
    },
    {
      id: 4,
      icon: <PlusCircle className="h-6 w-6" />,
      title: "Vaccination",
      description: "Service de vaccination contre la grippe saisonnière et autres vaccins disponibles en pharmacie.",
      category: "specialized",
    },
    {
      id: 5,
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Matériel médical",
      description: "Location et vente de matériel médical pour le maintien à domicile et les soins.",
      category: "traditional",
    },
    {
      id: 6,
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Préparations magistrales",
      description: "Médicaments préparés sur mesure selon les prescriptions spécifiques de votre médecin.",
      category: "specialized",
    },
    {
      id: 7,
      icon: <Thermometer className="h-6 w-6" />,
      title: "Tests de dépistage",
      description: "Tests rapides pour la COVID-19, la grippe, et autres pathologies pour un diagnostic rapide.",
      category: "specialized",
    },
    {
      id: 8,
      icon: <Microscope className="h-6 w-6" />,
      title: "Analyses biologiques",
      description: "Point de collecte pour vos analyses biologiques en partenariat avec des laboratoires.",
      category: "traditional",
    },
    {
      id: 9,
      icon: <Truck className="h-6 w-6" />,
      title: "Livraison à domicile",
      description:
        "Service de livraison gratuit pour les personnes âgées, à mobilité réduite ou dans l'impossibilité de se déplacer.",
      category: "specialized",
    },
    {
      id: 10,
      icon: <Video className="h-6 w-6" />,
      title: "Téléconsultation",
      description:
        "Consultations médicales à distance avec des médecins qualifiés, directement depuis notre pharmacie.",
      category: "digital",
    },
    {
      id: 11,
      icon: <Smartphone className="h-6 w-6" />,
      title: "Application mobile",
      description: "Gérez vos ordonnances, recevez des rappels pour vos médicaments et commandez en ligne.",
      category: "digital",
    },
    {
      id: 12,
      icon: <Clock className="h-6 w-6" />,
      title: "PDA (Préparation des Doses à Administrer)",
      description:
        "Préparation personnalisée des doses de médicaments selon votre prescription pour une meilleure observance.",
      category: "specialized",
    },
  ]

  const filteredServices =
    activeCategory === "all" ? services : services.filter((service) => service.category === activeCategory)

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
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a4b8b] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a4b8b]"></span>
              </span>
              Nos prestations
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 text-[#1a4b8b]">
              Services Pharmaceutiques
            </h1>
            <p className="text-xl text-gray-600">
              Découvrez notre gamme complète de services conçus pour répondre à tous vos besoins de santé avec une
              approche moderne et personnalisée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PDA Featured Service */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                  src="/images/pda-services.jpg"
                  alt="Service PDA - Préparation des Doses à Administrer"
                  width={800}
                  height={600}
                  className="object-cover w-full h-[500px]"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#1a4b8b]/10 px-3 py-1 rounded-full text-[#1a4b8b] text-sm font-medium">
                <Sparkles className="h-4 w-4 text-[#1a4b8b]" />
                Service exclusif
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a4b8b]">
                PDA - Préparation des Doses à Administrer
              </h2>
              <p className="text-lg text-gray-600">
                <em>
                  "La PDA consiste à préparer, dans le cas où cela contribue à une meilleure prise en charge
                  thérapeutique du patient, les doses de médicaments à administrer, de façon personnalisée, selon la
                  prescription, et donc par anticipation du séquencement et des moments des prises."
                </em>{" "}
                - Académie Nationale de Pharmacie
              </p>
              <p className="text-lg text-gray-600">
                À la Pharmacie Mozart, nous sommes fiers de proposer ce service rare qui améliore considérablement
                l'observance des traitements et réduit les risques d'erreurs de médication.
              </p>

              <div className="bg-[#f8fafc] p-6 rounded-xl border border-[#1a4b8b]/10 mt-6">
                <h3 className="text-xl font-bold text-[#1a4b8b] mb-4">Bientôt disponible pour les particuliers</h3>
                <p className="text-gray-600 mb-4">
                  Actuellement proposé aux établissements de santé, nous étendrons prochainement ce service aux
                  particuliers pour faciliter la prise de médicaments à domicile, notamment pour :
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                      <Check className="h-4 w-4 text-[#8cc63f]" />
                    </div>
                    <span className="text-gray-700">Les personnes âgées ou à mobilité réduite</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                      <Check className="h-4 w-4 text-[#8cc63f]" />
                    </div>
                    <span className="text-gray-700">Les patients avec des traitements complexes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                      <Check className="h-4 w-4 text-[#8cc63f]" />
                    </div>
                    <span className="text-gray-700">Les personnes ayant des difficultés à gérer leurs médicaments</span>
                  </li>
                </ul>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="rounded-full px-8 bg-[#1a4b8b] hover:bg-[#15407a] text-white mt-4">
                  En savoir plus sur le PDA <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Téléconsultation Section */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="order-2 md:order-1 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#8cc63f]/10 px-3 py-1 rounded-full text-[#8cc63f] text-sm font-medium">
                <Video className="h-4 w-4 text-[#8cc63f]" />
                Service innovant
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a4b8b]">
                Téléconsultation médicale
              </h2>
              <p className="text-lg text-gray-600">
                Accédez à des consultations médicales à distance avec des médecins qualifiés, directement depuis notre
                pharmacie. Un service pratique qui vous fait gagner du temps et facilite votre accès aux soins.
              </p>

              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="bg-[#1a4b8b]/10 p-2 rounded-full mt-1">
                    <Clock className="h-5 w-5 text-[#1a4b8b]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a4b8b]">Rapide et efficace</h3>
                    <p className="text-gray-600 mt-1">Consultez un médecin sans rendez-vous et sans attente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#1a4b8b]/10 p-2 rounded-full mt-1">
                    <Users className="h-5 w-5 text-[#1a4b8b]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a4b8b]">Médecins qualifiés</h3>
                    <p className="text-gray-600 mt-1">Accès à un réseau de médecins généralistes et spécialistes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#1a4b8b]/10 p-2 rounded-full mt-1">
                    <Home className="h-5 w-5 text-[#1a4b8b]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a4b8b]">Confort et confidentialité</h3>
                    <p className="text-gray-600 mt-1">Espace dédié et équipé dans notre pharmacie</p>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="rounded-full px-8 bg-[#8cc63f] hover:bg-[#78a835] text-white mt-4">
                  Prendre rendez-vous <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </motion.div>
            </div>

            <div className="order-1 md:order-2 relative">
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-[#8cc63f]/20 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#1a4b8b]/20 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/consultation.jpg"
                  alt="Service de téléconsultation"
                  width={800}
                  height={600}
                  className="object-cover w-full h-[500px]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-20" ref={targetRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a4b8b] mb-6">Tous nos services</h2>
            <p className="text-lg text-gray-600">
              Découvrez l'ensemble des services que nous proposons pour prendre soin de votre santé et votre bien-être
            </p>
          </motion.div>

          <Tabs defaultValue="all" className="w-full mb-12">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-8">
              {serviceCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className="rounded-full px-6 py-2 data-[state=active]:bg-[#1a4b8b] data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                  />
                ))}
              </div>
            </TabsContent>

            {serviceCategories.slice(1).map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      icon={service.icon}
                      title={service.title}
                      description={service.description}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#1a4b8b] to-[#0d2d56]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Formes décoratives */}
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

        {/* Motif de points */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="container px-4 md:px-6 relative">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <motion.div
              className="md:col-span-3 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                Besoin d'un avis pharmaceutique personnalisé?
              </h2>
              <p className="text-white/90 text-lg">
                Chaque patient est unique, c'est pourquoi nous proposons des consultations individuelles pour répondre à
                vos questions spécifiques et vous accompagner dans votre parcours de santé.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-start gap-3">
                  <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                    <Check className="h-4 w-4 text-[#8cc63f]" />
                  </div>
                  <span className="text-white/90">Conseils adaptés à votre profil médical</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                    <Check className="h-4 w-4 text-[#8cc63f]" />
                  </div>
                  <span className="text-white/90">Analyse de vos traitements et interactions médicamenteuses</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-[#8cc63f]/20 p-1 rounded-full mt-1">
                    <Check className="h-4 w-4 text-[#8cc63f]" />
                  </div>
                  <span className="text-white/90">Recommandations pour optimiser votre santé et bien-être</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="md:col-span-2 flex flex-col sm:flex-row md:flex-col gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">Prenez rendez-vous</h3>
                <p className="text-white/80 mb-6">
                  Réservez un créneau avec l'un de nos pharmaciens pour un entretien personnalisé.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="secondary" asChild className="rounded-full px-8 w-full">
                    <Link href="/contact">Prendre rendez-vous</Link>
                  </Button>
                </motion.div>
              </div>

              <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white mb-4">Contactez-nous</h3>
                <p className="text-white/80 mb-6">
                  Appelez-nous directement pour discuter avec un membre de notre équipe.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-[#8cc63f]/90 hover:bg-[#8cc63f] text-white rounded-full px-8 w-full"
                    asChild
                  >
                    <Link href="tel:0387801234">Nous appeler</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 h-full border border-[#1a4b8b]/10 overflow-hidden group"
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <motion.div
          className="bg-[#1a4b8b]/10 p-4 rounded-full inline-block mb-6"
          whileHover={{ scale: 1.1, backgroundColor: "#1a4b8b" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="text-[#1a4b8b] group-hover:text-white">{icon}</div>
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-[#1a4b8b]">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/contact" className="text-[#1a4b8b] flex items-center gap-1 hover:underline">
            En savoir plus <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

