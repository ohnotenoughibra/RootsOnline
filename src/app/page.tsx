import Link from "next/link";
import {
  ArrowRight,
  Users,
  MessageCircle,
  BookOpen,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const disciplines = [
  {
    name: "MMA",
    slug: "MMA",
    description: "Komplettes Mixed Martial Arts Training",
  },
  {
    name: "Kickboxen",
    slug: "KICKBOXING",
    description: "Schlagtechniken und Beinarbeit meistern",
  },
  {
    name: "Grappling",
    slug: "GRAPPLING",
    description: "Submissions und Bodenkontrolle",
  },
];

const communityFeatures = [
  {
    icon: Users,
    title: "Gemeinsam trainieren",
    description: "Vernetze dich mit Kampfsportlern weltweit, die deine Leidenschaft teilen",
  },
  {
    icon: MessageCircle,
    title: "Trainer-Feedback",
    description: "Erhalte persönliches Feedback von professionellen Trainern",
  },
  {
    icon: BookOpen,
    title: "Strukturiertes Lernen",
    description: "Folge bewährten Lehrplänen, die von Champions entwickelt wurden",
  },
  {
    icon: Award,
    title: "Fortschritt verfolgen",
    description: "Verdiene Zertifikate und feiere deine Erfolge",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Minimal */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Lerne Kampfsport
            <span className="block text-muted-foreground">von den Besten</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Werde Teil einer Community engagierter Kampfsportler. Trainiere mit
            erstklassigen Trainern in MMA, Kickboxen und Grappling.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="xl" className="w-full sm:w-auto">
                Kostenlos testen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Kurse durchsuchen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Wachsende Community von Kampfsportlern</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Wöchentlich neue Inhalte</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Lerne von Elite-Trainern</span>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Section - Minimal */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Wähle deinen Weg
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.name}
                href={`/courses?discipline=${discipline.slug}`}
              >
                <Card className="group h-full hover:bg-muted/50 transition-colors border-2 hover:border-foreground/20">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold">
                      {discipline.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {discipline.description}
                    </p>
                    <div className="mt-4 flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Entdecken</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Mehr als nur Videos
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Werde Teil einer unterstützenden Community, die dir beim Wachsen hilft
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {communityFeatures.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Einfache Preise
          </h2>
          <p className="mt-4 text-muted-foreground">
            Voller Zugang zu allem. Keine versteckten Gebühren.
          </p>

          <Card className="mt-8 p-8 border-2">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">19€</span>
              <span className="text-muted-foreground">/Monat</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              oder 199€/Jahr (spare 17%)
            </p>
            <ul className="mt-8 space-y-3 text-left max-w-xs mx-auto">
              {[
                "Unbegrenzter Kurszugang",
                "Wöchentlich neue Inhalte",
                "Trainer-Feedback",
                "Community-Zugang",
                "Fortschrittsverfolgung",
                "Jederzeit kündbar",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="block mt-8">
              <Button size="lg" className="w-full">
                7 Tage kostenlos testen
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-20 border-t">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Bereit anzufangen?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Starte deine Kampfsport-Reise heute mit 7 Tagen kostenlos.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="xl">
                Jetzt starten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
