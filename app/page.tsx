"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Clock, MapPin, ChevronRight, ArrowRight, Heart, Shield, Pill, Calendar, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  const [activeTab, setActiveTab] = useState(0)

  const services = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "PDA (Préparation des Doses à Administrer)",
      description:
        "Préparation personnalisée des doses de médicaments selon votre prescription pour une meilleure observance.",
    },
    {
      icon: <Pill className="h-6 w-6" />,
      title: "Dispensation de médicaments",
      description: "Ordonnances, médicaments sans ordonnance, et conseils personnalisés pour votre traitement.",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Suivi thérapeutique",
      description: "Programmes de suivi pour les maladies chroniques et les traitements à long terme.",
    },
    {
      icon: <PlusCircle className="h-6 w-6" />,
      title: "Vaccination",
      description: "Service de vaccination contre la grippe saisonnière et autres vaccins disponibles en pharmacie.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen container mx-auto">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" />

          {/* Decorative circles */}
          <motion.div
            className="absolute top-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-[#1a4b8b]/5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-[5%] w-[300px] h-[300px] rounded-full bg-[#8cc63f]/5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          />

          {/* Cross pattern */}
          <div className="absolute inset-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231a4b8b' fillOpacity='1' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: "60px 60px",
              }}
            />
          </div>
        </div>

        <div className="container px-4 md:px-6 pt-24 pb-12 md:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-[#1a4b8b]/10 px-3 py-1 rounded-full text-[#1a4b8b] text-sm font-medium"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a4b8b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a4b8b]"></span>
                </span>
                Votre pharmacie à Maizière-lès-Metz
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1a4b8b]">
                  Votre santé, <br />
                  <span className="text-[#8cc63f]">notre expertise</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-lg">
                  Une équipe de professionnels passionnés à votre écoute pour tous vos besoins de santé et de bien-être.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-[#1a4b8b] hover:bg-[#15407a] text-white rounded-full px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/services">Nos services</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#1a4b8b] text-[#1a4b8b] hover:bg-[#1a4b8b] hover:text-white rounded-full px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/contact">Contactez-nous</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-8 grid grid-cols-2 gap-6"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#1a4b8b]/10 p-2 rounded-full mt-1">
                    <Clock className="h-5 w-5 text-[#1a4b8b]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a4b8b]">Horaires étendus</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Lun-Ven: 8h00-12h30 | 14h00-19h30
                      <br />
                      Sam: 8h00-17h00
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#1a4b8b]/10 p-2 rounded-full mt-1">
                    <MapPin className="h-5 w-5 text-[#1a4b8b]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1a4b8b]">Notre adresse</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      5 Rte de Metz 
                      <br />
                      57280 Maizière-lès-Metz
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a4b8b] to-[#8cc63f] rounded-full opacity-20 blur-2xl" />
                  <div className="absolute inset-8 bg-white rounded-full shadow-xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-2/3 h-2/3">
                      <svg viewBox="0 0 200 200" className="absolute w-full h-full">
                        <path
                          d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                          fill="none"
                          stroke="#1a4b8b"
                          strokeWidth="6"
                          strokeDasharray="1 8"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src="/images/logo.png"
                          alt="Pharmacie Mozart"
                          width={200}
                          height={200}
                          className="w-2/3 h-auto"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      repeatDelay: 2,
                    }}
                    className="absolute top-[15%] right-[5%]"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                      <div className="bg-[#8cc63f]/20 p-2 rounded-full">
                        <Heart className="h-5 w-5 text-[#8cc63f]" />
                      </div>
                      <span className="font-medium text-sm">Conseils experts</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      repeatDelay: 3,
                    }}
                    className="absolute bottom-[15%] left-[5%]"
                  >
                    <div className="bg-white p-3 rounded-xl shadow-lg flex items-center gap-3">
                      <div className="bg-[#1a4b8b]/20 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-[#1a4b8b]" />
                      </div>
                      <span className="font-medium text-sm">Produits de qualité</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <ArrowRight className="h-8 w-8 text-[#1a4b8b]/60 rotate-90" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-24 relative overflow-hidden bg-[#f8fafc]" ref={targetRef}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-white" />

          {/* Decorative elements */}
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#8cc63f]/5"
            style={{ opacity, y }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[#1a4b8b]/5"
            style={{ opacity, y: useTransform(scrollYProgress, [0, 1], [50, 0]) }}
          />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#8cc63f]/10 px-3 py-1 rounded-full text-[#8cc63f] text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8cc63f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8cc63f]"></span>
              </span>
              Nos prestations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a4b8b] mb-6">
              Services Pharmaceutiques
            </h2>
            <p className="text-xl text-gray-600">
              Des solutions complètes pour votre santé et votre bien-être, adaptées à vos besoins spécifiques.
            </p>
          </motion.div>

          {/* Services Tabs */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {services.map((service, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    activeTab === index
                      ? "bg-[#1a4b8b] text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-[#1a4b8b]/10 shadow"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className={activeTab === index ? "text-white" : "text-[#1a4b8b]"}>{service.icon}</span>
                  {service.title}
                </motion.button>
              ))}
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="bg-[#1a4b8b]/10 p-3 rounded-full w-fit mb-6">{services[activeTab].icon}</div>
                    <h3 className="text-2xl font-bold text-[#1a4b8b] mb-4">{services[activeTab].title}</h3>
                    <p className="text-gray-600 mb-6">{services[activeTab].description}</p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#8cc63f]"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-700">Conseils personnalisés par des professionnels qualifiés</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#8cc63f]"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-700">Suivi régulier de votre traitement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-[#8cc63f]/10 p-1 rounded-full mt-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-[#8cc63f]"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-700">Solutions adaptées à vos besoins spécifiques</p>
                        </div>
                      </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="rounded-full px-6 bg-[#1a4b8b] hover:bg-[#15407a] text-white" asChild>
                        <Link href="/services">
                          En savoir plus <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>

                  <div className="relative h-[300px] md:h-auto">
                    <Image
                      src="/images/pda.jpg"
                      alt={services[activeTab].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Featured Services */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <Card className="overflow-hidden h-full bg-gradient-to-br from-[#1a4b8b] to-[#15407a] text-white">
                <div className="p-8 md:p-10 h-full">
                  <div className="grid md:grid-cols-2 gap-8 h-full">
                    <div className="space-y-6">
                      <div className="bg-white/10 p-3 rounded-full w-fit">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Bilan de médication</h3>
                      <p className="text-white/80">
                        Un service personnalisé pour les patients prenant plusieurs médicaments. Notre pharmacien
                        examine l'ensemble de vos traitements pour identifier les interactions potentielles.
                      </p>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#8cc63f]/20 p-1 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-[#8cc63f]"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span className="text-white/90">Analyse complète de vos prescriptions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-[#8cc63f]/20 p-1 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-[#8cc63f]"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          <span className="text-white/90">Détection des interactions médicamenteuses</span>
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="pt-4">
                        <Button className="bg-white text-[#1a4b8b] hover:bg-white/90 rounded-full" asChild>
                          <Link href="/contact">Prendre rendez-vous</Link>
                        </Button>
                      </motion.div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden h-[250px] md:h-auto">
                      <Image
                        src="/images/dispensation.png"
                        alt="Bilan de médication"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden h-full bg-gradient-to-br from-[#8cc63f] to-[#78a835] text-white">
                <div className="p-8 md:p-10 h-full flex flex-col">
                  <div className="bg-white/10 p-3 rounded-full w-fit mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Conseils en nutrition</h3>
                  <p className="text-white/80 mb-6">
                    Consultations personnalisées avec notre pharmacien spécialisé en nutrition pour des conseils adaptés
                    à vos besoins spécifiques.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-white/90">Plans alimentaires personnalisés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-white/20 p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-white/90">Suivi régulier de vos progrès</span>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-auto">
                    <Button className="bg-white text-[#8cc63f] hover:bg-white/90 rounded-full" asChild>
                      <Link href="/services">En savoir plus</Link>
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button size="lg" asChild className="rounded-full px-8 bg-[#1a4b8b] hover:bg-[#15407a] text-white">
              <Link href="/services">
                Découvrir tous nos services <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
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
                    src="/images/equipes.jpg"
                    alt="L'équipe de la Pharmacie Mozart"
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
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1a4b8b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1a4b8b]"></span>
                </span>
                Notre histoire
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-[#1a4b8b]">Une équipe passionnée</h2>
              <p className="text-lg text-gray-600">
                Depuis 1998, la Pharmacie Mozart est au service des habitants de Maizière-lès-Metz. Notre équipe de
                pharmaciens qualifiés s'engage à fournir des soins pharmaceutiques de la plus haute qualité.
              </p>
              <p className="text-lg text-gray-600">
                Nous croyons en une approche personnalisée de la santé, en prenant le temps d'écouter vos préoccupations
                et de vous offrir des conseils adaptés à vos besoins spécifiques.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="rounded-full mt-4 border-[#1a4b8b] text-[#1a4b8b] hover:bg-[#1a4b8b] hover:text-white"
                >
                  <Link href="/about">
                    En savoir plus sur nous <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative bg-[#f8fafc]">
        <div className="container px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#8cc63f]/10 px-3 py-1 rounded-full text-[#8cc63f] text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8cc63f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8cc63f]"></span>
              </span>
              Témoignages
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-[#1a4b8b] mb-6">Ce que disent nos clients</h2>
            <p className="text-xl text-gray-600">
              Découvrez pourquoi nos clients nous font confiance pour leurs besoins en matière de santé
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="L'équipe de la Pharmacie Mozart est toujours disponible pour répondre à mes questions. Leur service est impeccable et leurs conseils sont précieux."
              author="Marie D."
              delay={0}
            />
            <TestimonialCard
              quote="Je suis client depuis plus de 10 ans. Les conseils personnalisés et l'attention portée à ma santé font toute la différence."
              author="Pierre L."
              delay={0.1}
            />
            <TestimonialCard
              quote="Le service de livraison à domicile a été d'une grande aide pendant ma convalescence. Merci pour votre professionnalisme."
              author="Sophie M."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a4b8b] to-[#15407a] rounded-3xl p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            <div className="relative text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-white">Restez informé</h2>
              <p className="text-white/90 text-lg max-w-2xl mx-auto">
                Inscrivez-vous à notre newsletter pour recevoir des conseils santé, des promotions exclusives et les
                dernières actualités de votre pharmacie.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex h-12 w-full rounded-full border border-white/20 bg-white/10 px-6 py-2 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="h-12 rounded-full px-6 bg-white text-[#1a4b8b] hover:bg-white/90">
                    S'inscrire
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function TestimonialCard({ quote, author, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 h-full border border-[#1a4b8b]/10 relative overflow-hidden"
        whileHover={{ y: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="text-5xl text-[#8cc63f]/20 font-serif absolute top-4 left-4">"</div>
        <div className="relative z-10">
          <p className="italic mb-6 pt-4 text-gray-700">{quote}</p>
          <p className="font-medium text-[#1a4b8b]">— {author}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

