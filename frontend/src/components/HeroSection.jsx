import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1747085040719-55282cc206b9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZGlnaXRhbCUyMHNjYWxlJTIwd2FyZWhvdXNlfGVufDB8fHx8MTc3NDAyMzAzN3ww&ixlib=rb-4.1.0&q=85";

export default function HeroSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[90vh] flex items-center bg-slate-900 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Průmyslové vážicí systémy"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-900/80" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 hero-grid-pattern" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-3xl">
          {/* Label */}
          <div
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up"
            data-testid="hero-badge"
          >
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
              Autorizovaný prodejce & servis
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] font-['Manrope'] animate-fade-in-up animate-delay-100"
            data-testid="hero-headline"
          >
            Profesionální vážicí systémy a servis{" "}
            <span className="text-orange-500">pro váš byznys</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl animate-fade-in-up animate-delay-200"
            data-testid="hero-subheadline"
          >
            Od přesných laboratorních vah po silniční mostové váhy. Prodej,
            montáž a úřední ověření (kalibrace) po celé ČR.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-fade-in-up animate-delay-300">
            <Button
              onClick={() => scrollTo("#produkty")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 px-8 rounded-md text-base shadow-lg shadow-orange-900/30 transition-all hover:-translate-y-0.5 active:translate-y-0 pulse-orange"
              data-testid="hero-cta-catalog"
            >
              Prohlédnout katalog
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => scrollTo("#sluzby")}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium py-6 px-8 rounded-md text-base transition-all"
              data-testid="hero-cta-service"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Kontaktovat servis
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-8 mt-14 animate-fade-in-up animate-delay-400">
            {[
              { value: "20+", label: "let zkušeností" },
              { value: "1000+", label: "spokojených klientů" },
              { value: "ČMI", label: "certifikovaný partner" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-bold text-white font-['Manrope']">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
