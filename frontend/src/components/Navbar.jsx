import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Phone, Search, ChevronDown, Menu, Scale, X } from "lucide-react";

const navCategories = [
  { label: "Laboratorní váhy", parent: "vahy", sub: "laboratorni" },
  { label: "Obchodní váhy", parent: "vahy", sub: "obchodni-bez" },
  { label: "Průmyslové váhy", parent: "vahy", sub: "paletove" },
  { label: "Silniční váhy", parent: "vahy", sub: "silnicni" },
  { label: "Zdravotnické váhy", parent: "vahy", sub: "zdravotnicke" },
  { label: "Registrační pokladny", parent: "pokladny", sub: "pokladny-all" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setMobileOpen(false);
  };

  const goToCategory = (cat) => {
    navigate(`/katalog?parent=${cat.parent}&sub=${cat.sub}`);
    setMobileOpen(false);
  };

  const goHome = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 nav-blur shadow-lg shadow-slate-900/10"
          : "bg-slate-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={goHome}
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <div className="w-10 h-10 bg-orange-600 rounded-sm flex items-center justify-center group-hover:bg-orange-500 transition-colors">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-white font-bold text-lg tracking-tight font-['Manrope']">
                VÁHY DYCHL
              </span>
              <span className="text-slate-400 text-[10px] uppercase tracking-[0.2em] hidden sm:block">
                Vážicí systémy & servis
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-1"
                  data-testid="nav-produkty-dropdown"
                >
                  Produkty <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-white border border-slate-200">
                {navCategories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.label}
                    onClick={() => goToCategory(cat)}
                    className="cursor-pointer text-slate-700 hover:text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                    data-testid={`nav-category-${cat.sub}`}
                  >
                    {cat.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => navigate("/katalog")}
                  className="cursor-pointer text-orange-600 font-semibold hover:text-orange-700 focus:text-orange-700 focus:bg-orange-50 border-t border-slate-100 mt-1 pt-2"
                  data-testid="nav-all-products"
                >
                  Všechny produkty →
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => scrollTo("#sluzby")}
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
              data-testid="nav-sluzby"
            >
              Služby & Servis
            </button>
            <button
              onClick={() => scrollTo("#kontakt")}
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors"
              data-testid="nav-kontakt"
            >
              Kontakty
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+420775698555"
              className="hidden md:flex items-center gap-2 text-white font-semibold text-sm"
              data-testid="phone-link"
            >
              <Phone className="w-4 h-4 text-orange-500" />
              +420 775 698 555
            </a>

            <Button
              onClick={() => scrollTo("#kontakt")}
              className="hidden sm:inline-flex bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              data-testid="cta-poptat-reseni"
            >
              Poptat řešení
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden text-slate-300 hover:text-white p-2"
                  data-testid="mobile-menu-trigger"
                  aria-label="Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900 border-slate-800 w-80">
                <SheetTitle className="text-white font-['Manrope'] text-lg">
                  VÁHY DYCHL
                </SheetTitle>
                <nav className="flex flex-col gap-2 mt-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
                    Produkty
                  </p>
                  {navCategories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => goToCategory(cat)}
                      className="text-left text-sm text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { navigate("/katalog"); setMobileOpen(false); }}
                    className="text-left text-sm text-orange-500 hover:text-orange-400 hover:bg-white/5 px-3 py-2 rounded-md transition-colors font-semibold"
                  >
                    Všechny produkty →
                  </button>
                  <div className="h-px bg-slate-800 my-3" />
                  <button onClick={() => scrollTo("#sluzby")} className="text-left text-sm text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">
                    Služby & Servis
                  </button>
                  <button onClick={() => scrollTo("#kontakt")} className="text-left text-sm text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md transition-colors">
                    Kontakty
                  </button>
                  <div className="h-px bg-slate-800 my-3" />
                  <a href="tel:+420775698555" className="flex items-center gap-2 text-white font-semibold text-sm px-3 py-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    +420 775 698 555
                  </a>
                  <Button
                    onClick={() => scrollTo("#kontakt")}
                    className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md"
                    data-testid="mobile-cta"
                  >
                    Poptat řešení
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
