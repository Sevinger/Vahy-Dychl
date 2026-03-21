import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Scale, Phone, Mail, MapPin, Facebook, ArrowUpRight } from "lucide-react";

const productLinks = [
  { label: "Laboratorní váhy", parent: "vahy", sub: "laboratorni" },
  { label: "Obchodní váhy", parent: "vahy", sub: "obchodni-bez" },
  { label: "Průmyslové váhy", parent: "vahy", sub: "paletove" },
  { label: "Silniční váhy", parent: "vahy", sub: "silnicni" },
  { label: "Registrační pokladny", parent: "pokladny", sub: "pokladny-all" },
];

const serviceLinks = [
  "Kalibrace a ověření",
  "Servis a opravy",
  "Montáž a instalace",
  "Poradenství",
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollTo = (id) => {
    if (!isHomePage) {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToCategory = (cat) => {
    navigate(`/katalog?parent=${cat.parent}&sub=${cat.sub}`);
  };

  return (
    <footer className="bg-slate-900 text-slate-300" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Company */}
          <div>
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-9 h-9 bg-orange-600 rounded-sm flex items-center justify-center">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg font-['Manrope']">
                VÁHY DYCHL
              </span>
            </button>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                Kocourkova 3, 787 01 Šumperk
              </p>
              <p className="text-slate-500">IČ: 73235202</p>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-colors"
                data-testid="footer-facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">
              Produkty
            </p>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => goToCategory(link)}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate("/katalog")}
                  className="text-sm text-orange-500 hover:text-orange-400 transition-colors text-left font-semibold"
                >
                  Všechny produkty →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">
              Služby
            </p>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo("#sluzby")}
                    className="text-sm text-slate-400 hover:text-orange-400 transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">
              Kontakt
            </p>
            <div className="space-y-4">
              <a
                href="mailto:m.dytrich@seznam.cz"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-orange-400 transition-colors"
                data-testid="footer-email"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                m.dytrich@seznam.cz
              </a>
              <a
                href="tel:+420775698555"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-orange-400 transition-colors"
                data-testid="footer-phone"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                +420 775 698 555
              </a>
              <a
                href="mailto:servisdychl@seznam.cz"
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-orange-400 transition-colors"
                data-testid="footer-service-email"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                servisdychl@seznam.cz
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} VÁHY-DYCHL. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-6">
            <a
              href="/admin"
              className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors"
              data-testid="footer-admin-link"
            >
              Administrace
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs text-slate-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
              data-testid="footer-back-to-top"
            >
              Zpět nahoru <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
