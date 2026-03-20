import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Phone,
  Mail,
  Wrench,
  Shield,
  FileCheck,
  Settings,
  ArrowRight,
} from "lucide-react";

const servicePoints = [
  {
    icon: Settings,
    title: "Seřízení a kalibrace",
    desc: "Přesné nastavení vah dle platných norem a požadavků zákazníka.",
  },
  {
    icon: Shield,
    title: "Úřední ověření ve spolupráci s ČMI",
    desc: "Spolupracujeme s Českým metrologickým institutem pro úřední ověření.",
  },
  {
    icon: FileCheck,
    title: "Vystavení kalibračních listů",
    desc: "Kompletní dokumentace a kalibrační listy pro vaše záznamy.",
  },
];

export default function ServiceSection() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="sluzby"
      className="py-24 md:py-32 bg-white section-reveal"
      data-testid="service-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left side - Content */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3 block">
              Servis & kalibrace
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight font-['Manrope']"
              data-testid="service-title"
            >
              Komplexní servis a úřední ověření
            </h2>
            <p className="text-base md:text-lg text-slate-500 mt-4 leading-relaxed">
              Maximální spokojenost a řešení na míru. Zajistíme kompletní servis
              vašich vážicích systémů včetně úředního ověření.
            </p>

            {/* Service points */}
            <div className="mt-10 space-y-6" data-testid="service-points">
              {servicePoints.map((point) => (
                <div key={point.title} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-50 border border-orange-100 rounded-sm flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    <point.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 font-['Manrope']">
                      {point.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* About section anchor */}
            <div id="o-nas" className="mt-12 p-6 bg-slate-50 border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">
                VÁHY-DYCHL je česká firma se sídlem v Šumperku, specializující se na
                prodej, montáž a servis vážicí techniky a pokladních systémů. S více
                než 20 lety zkušeností poskytujeme komplexní řešení pro průmyslové i
                obchodní zákazníky po celé České republice.
              </p>
            </div>
          </div>

          {/* Right side - Service contact card */}
          <div className="lg:sticky lg:top-28">
            <div
              className="bg-slate-900 p-8 md:p-10 text-white"
              data-testid="service-contact-card"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-600 rounded-sm flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Servisní oddělení
                  </p>
                </div>
              </div>

              <Separator className="bg-slate-700 mb-6" />

              {/* Contact person */}
              <div className="mb-8">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                  Vedoucí servisu
                </p>
                <p className="text-xl font-bold font-['Manrope']">
                  Martin Dytrich
                </p>
              </div>

              {/* Contact details */}
              <div className="space-y-4">
                <a
                  href="mailto:servisdychl@seznam.cz"
                  className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors group"
                  data-testid="service-email"
                >
                  <Mail className="w-5 h-5 text-slate-500 group-hover:text-orange-400" />
                  <span className="text-sm">servisdychl@seznam.cz</span>
                </a>
                <a
                  href="tel:+420775698555"
                  className="flex items-center gap-3 text-slate-300 hover:text-orange-400 transition-colors group"
                  data-testid="service-phone"
                >
                  <Phone className="w-5 h-5 text-slate-500 group-hover:text-orange-400" />
                  <span className="text-sm font-semibold">+420 775 698 555</span>
                </a>
              </div>

              <Separator className="bg-slate-700 my-6" />

              {/* CTA */}
              <Button
                onClick={() => scrollTo("#kontakt")}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 rounded-md shadow-lg shadow-orange-900/30 transition-all hover:-translate-y-0.5"
                data-testid="service-cta"
              >
                Objednat servis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {/* Trust note */}
              <div className="flex items-center gap-2 mt-6">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400">
                  Obvykle odpovídáme do 24 hodin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
