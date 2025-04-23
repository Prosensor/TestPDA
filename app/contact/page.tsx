"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormState((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      setIsSubmitting(false)
      setFormStatus("success")

      // Réinitialiser le formulaire après un certain temps
      setTimeout(() => {
        setFormStatus("idle")
        setFormState({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      }, 5000)
    }, 1500)
  }

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
              <Mail className="h-4 w-4" />
              Contactez-nous
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-[#1a4b8b]">
              Nous sommes à votre écoute
            </h1>
            <p className="text-xl text-gray-600">
              Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner dans vos besoins de
              santé
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="contact" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="contact" className="text-base">
                Nous contacter
              </TabsTrigger>
              <TabsTrigger value="hours" className="text-base">
                Horaires d'ouverture
              </TabsTrigger>
              <TabsTrigger value="location" className="text-base">
                Nous trouver
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contact" className="mt-0">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Formulaire de contact */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a4b8b] mb-4">Envoyez-nous un message</h2>
                    <p className="text-gray-600">
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>

                  <Card className="border-[#1a4b8b]/10">
                    <CardContent className="p-6">
                      {formStatus === "success" ? (
                        <motion.div
                          className="text-center py-12 space-y-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="bg-[#8cc63f]/10 p-4 rounded-full inline-block mb-4">
                            <CheckCircle className="h-8 w-8 text-[#8cc63f]" />
                          </div>
                          <h3 className="text-xl font-bold text-[#1a4b8b]">Message envoyé avec succès!</h3>
                          <p className="text-gray-600">
                            Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
                          </p>
                        </motion.div>
                      ) : formStatus === "error" ? (
                        <motion.div
                          className="text-center py-12 space-y-4"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                          </div>
                          <h3 className="text-xl font-bold text-red-600">Une erreur est survenue</h3>
                          <p className="text-gray-600">
                            Veuillez réessayer ou nous contacter directement par téléphone.
                          </p>
                        </motion.div>
                      ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Prénom</Label>
                              <Input
                                id="firstName"
                                placeholder="Votre prénom"
                                value={formState.firstName}
                                onChange={handleChange}
                                className="rounded-lg"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Nom</Label>
                              <Input
                                id="lastName"
                                placeholder="Votre nom"
                                value={formState.lastName}
                                onChange={handleChange}
                                className="rounded-lg"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="votre.email@exemple.com"
                                value={formState.email}
                                onChange={handleChange}
                                className="rounded-lg"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Téléphone</Label>
                              <Input
                                id="phone"
                                placeholder="Votre numéro de téléphone"
                                value={formState.phone}
                                onChange={handleChange}
                                className="rounded-lg"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subject">Sujet</Label>
                            <Input
                              id="subject"
                              placeholder="Sujet de votre message"
                              value={formState.subject}
                              onChange={handleChange}
                              className="rounded-lg"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                              id="message"
                              placeholder="Votre message"
                              rows={5}
                              value={formState.message}
                              onChange={handleChange}
                              className="rounded-lg resize-none"
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            className="w-full rounded-lg bg-[#1a4b8b] hover:bg-[#15407a]"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                            <Send className="ml-2 h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Informations de contact */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a4b8b] mb-4">Informations de contact</h2>
                    <p className="text-gray-600">
                      N'hésitez pas à nous contacter directement par téléphone, email ou en personne.
                    </p>
                  </div>

                  <Card className="border-[#1a4b8b]/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6 space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-[#1a4b8b]/10 p-3 rounded-full">
                            <Phone className="h-6 w-6 text-[#1a4b8b]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Téléphone</h3>
                            <p className="text-gray-600">03 87 80 21 06</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Nous sommes disponibles par téléphone pendant nos heures d'ouverture
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-[#1a4b8b]/10 p-3 rounded-full">
                            <Mail className="h-6 w-6 text-[#1a4b8b]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Email</h3>
                            <p className="text-gray-600">contact@pharmaciemozart.com</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Nous répondons généralement dans un délai de 24 heures
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-[#1a4b8b]/10 p-3 rounded-full">
                            <MapPin className="h-6 w-6 text-[#1a4b8b]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">Adresse</h3>
                            <p className="text-gray-600">
                              5 Rte de Metz
                              <br />
                              57280 Maizière-lès-Metz
                              <br />
                              France
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Parking gratuit disponible à proximité</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#f8fafc] p-6 border-t">
                        <h3 className="font-bold text-lg mb-3 text-[#1a4b8b]">Services d'urgence</h3>
                        <p className="text-gray-600 mb-4">
                          En cas d'urgence médicale en dehors de nos heures d'ouverture, veuillez contacter :
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#1a4b8b]" />
                            <span className="font-medium">SAMU : 15</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#1a4b8b]" />
                            <span className="font-medium">Pharmacie de garde : 3237</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="bg-[#1a4b8b] text-white rounded-xl p-6">
                    <h3 className="font-bold text-xl mb-4">Besoin d'un conseil rapide ?</h3>
                    <p className="mb-6">
                      Notre équipe de pharmaciens est disponible pour répondre à vos questions par téléphone pendant nos
                      heures d'ouverture.
                    </p>
                    <Button variant="secondary" size="lg" className="w-full rounded-lg" asChild>
                      <a href="tel:0387802106">
                        <Phone className="mr-2 h-4 w-4" />
                        Appelez-nous maintenant
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-0">
              <div className="max-w-3xl mx-auto">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a4b8b] mb-4">Nos horaires d'ouverture</h2>
                    <p className="text-gray-600">
                      Nous sommes ouverts 6 jours sur 7 pour répondre à tous vos besoins de santé
                    </p>
                  </div>

                  <Card className="border-[#1a4b8b]/10 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="flex items-start gap-4">
                              <div className="bg-[#1a4b8b]/10 p-3 rounded-full">
                                <Clock className="h-6 w-6 text-[#1a4b8b]" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg mb-3">Horaires réguliers</h3>
                                <ul className="space-y-3">
                                  <li className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Lundi</span>
                                    <span>8h30 - 19h30</span>
                                  </li>
                                  <li className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Mardi</span>
                                    <span>8h30 - 19h30</span>
                                  </li>
                                  <li className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Mercredi</span>
                                    <span>8h30 - 19h30</span>
                                  </li>
                                  <li className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Jeudi</span>
                                    <span>8h30 - 19h30</span>
                                  </li>
                                  <li className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Vendredi</span>
                                    <span>8h30 - 19h30</span>
                                  </li>
                                  <li className="flex justify-between border-b pb-2">
                                    <span className="font-medium">Samedi</span>
                                    <span>9h00 - 18h00</span>
                                  </li>
                                  <li className="flex justify-between text-red-500">
                                    <span className="font-medium">Dimanche</span>
                                    <span>Fermé</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="bg-[#f8fafc] p-6 rounded-xl border border-[#1a4b8b]/10">
                              <h3 className="font-bold text-lg mb-3 text-[#1a4b8b]">Horaires spéciaux</h3>
                              <p className="text-gray-600 mb-4">
                                Nos horaires peuvent être modifiés lors des jours fériés et périodes spéciales.
                              </p>
                              <p className="text-sm text-gray-500">
                                Consultez notre page Facebook ou appelez-nous pour connaître nos horaires spéciaux.
                              </p>
                            </div>

                            <div className="bg-[#8cc63f]/10 p-6 rounded-xl border border-[#8cc63f]/20">
                              <h3 className="font-bold text-lg mb-3 text-[#8cc63f]">Service de garde</h3>
                              <p className="text-gray-600 mb-4">
                                Notre pharmacie participe au service de garde local. Les dates de garde sont affichées
                                en vitrine.
                              </p>
                              <p className="text-sm text-gray-500">
                                Pour connaître la pharmacie de garde, composez le 3237 (service payant).
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-0">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-[#1a4b8b] mb-4">Comment nous trouver</h2>
                    <p className="text-gray-600">Notre pharmacie est idéalement située au cœur de Maizière-lès-Metz</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <Card className="border-[#1a4b8b]/10 md:col-span-2">
                      <CardContent className="p-0">
                        <div className="aspect-video w-full rounded-t-lg overflow-hidden">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2606.81388697618!2d6.157824475787003!3d49.2040900763173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795275e4ef438cf%3A0xff738832b9d62b2d!2sPharmacie%20Mozart!5e0!3m2!1sfr!2sfr!4v1743407593137!5m2!1sfr!2sfr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-3 text-[#1a4b8b]">Notre adresse</h3>
                          <p className="text-gray-600 mb-4">
                            5 Rte de Metz
                            <br />
                            57280 Maizière-lès-Metz
                            <br />
                            France
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <Button variant="outline" className="rounded-lg border-[#1a4b8b] text-[#1a4b8b]" asChild>
                              <a
                                href="https://maps.google.com/?q=Pharmacie+Mozart,+5+Route+de+Metz,+57280+Maizières-lès-Metz"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Ouvrir dans Google Maps
                              </a>
                            </Button>
                            <Button variant="outline" className="rounded-lg border-[#1a4b8b] text-[#1a4b8b]" asChild>
                              <a href="#" onClick={(e) => e.preventDefault()}>
                                Itinéraire
                              </a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      <Card className="border-[#1a4b8b]/10">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-3 text-[#1a4b8b]">Stationnement</h3>
                          <p className="text-gray-600 mb-4">
                            Un parking gratuit est disponible à proximité de la pharmacie.
                          </p>
                          <p className="text-sm text-gray-500">
                            Des places de stationnement réservées aux personnes à mobilité réduite sont disponibles
                            devant l'entrée.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-[#1a4b8b]/10">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-3 text-[#1a4b8b]">Transports en commun</h3>
                          <p className="text-gray-600 mb-4">
                            Notre pharmacie est desservie par plusieurs lignes de bus.
                          </p>
                          <ul className="text-sm text-gray-500 space-y-1">
                            <li>• Ligne 1 : Arrêt "Mozart" (50m)</li>
                            <li>• Ligne 3 : Arrêt "Centre" (200m)</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border-[#1a4b8b]/10">
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-3 text-[#1a4b8b]">Accessibilité</h3>
                          <p className="text-gray-600">
                            Notre pharmacie est entièrement accessible aux personnes à mobilité réduite.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
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
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-[#1a4b8b]">Questions fréquentes</h2>
            <p className="text-lg text-gray-600">Trouvez rapidement des réponses aux questions les plus courantes</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FaqCard
              question="Comment puis-je renouveler mon ordonnance?"
              answer="Vous pouvez renouveler votre ordonnance en nous l'apportant directement à la pharmacie, en utilisant notre service en ligne, ou en nous envoyant une photo par email."
            />

            <FaqCard
              question="Proposez-vous un service de livraison?"
              answer="Oui, nous proposons un service de livraison gratuit pour les personnes âgées, à mobilité réduite ou dans l'impossibilité de se déplacer. Contactez-nous pour plus d'informations."
            />

            <FaqCard
              question="Puis-je parler à un pharmacien en privé?"
              answer="Absolument. Nous disposons d'un espace de confidentialité où vous pouvez discuter en privé avec un pharmacien. N'hésitez pas à demander ce service à votre arrivée."
            />

            <FaqCard
              question="Quels services de santé proposez-vous?"
              answer="Nous proposons divers services incluant la vaccination contre la grippe, le suivi des maladies chroniques, des tests de dépistage, et des conseils personnalisés en nutrition et bien-être."
            />
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-600 mb-4">Vous ne trouvez pas la réponse à votre question?</p>
            <Button className="rounded-full px-8 bg-[#1a4b8b] hover:bg-[#15407a]">Contactez-nous directement</Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function FaqCard({ question, answer }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-sm p-6 h-full border border-[#1a4b8b]/10 overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <h3 className="text-xl font-bold mb-4 text-[#1a4b8b]">{question}</h3>
        <p className="text-gray-600">{answer}</p>
      </motion.div>
    </motion.div>
  )
}

