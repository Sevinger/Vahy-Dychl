import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronDown,
  ChevronRight,
  Scale,
  ShoppingCart,
  Search,
  Package,
  ArrowRight,
  BadgeCheck,
  Clock,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────── */
/*  CATALOG DATA                                                */
/* ──────────────────────────────────────────────────────────── */
const CATALOG = [
  {
    id: "vahy",
    label: "VÁHY",
    icon: Scale,
    subcategories: [
      {
        id: "zdravotnicke",
        label: "Zdravotnické váhy",
        products: [
          {
            id: "z1",
            name: "Kojenecká váha TSCALE",
            price: "od 7.190 Kč",
            badge: "M",
            badgeLabel: "M (Ověřeno)",
            specs: "Přesné vážení kojenců",
          },
          {
            id: "z2",
            name: "Mobilní vážící křeslo",
            price: "od 23.700 Kč",
            badge: "M",
            badgeLabel: "M",
            specs: "Pro imobilní pacienty",
          },
          {
            id: "z3",
            name: "Nájezdová váha pro vozíky",
            price: "od 25.990 Kč",
            badge: "M",
            badgeLabel: "M",
            specs: "Invalidní & nemocniční vozíky",
          },
        ],
      },
      {
        id: "paletove",
        label: "Paletové váhy",
        products: [
          {
            id: "p1",
            name: "Paletový vozík s váhou KPZ1",
            price: "od 22.590 Kč",
            specs: "Váživost 2200 kg",
          },
          {
            id: "p2",
            name: "Ližinová váha 4TLDFWL",
            price: "od 19.900 Kč",
            specs: "Pro standardní palety",
          },
        ],
      },
      {
        id: "mustkove",
        label: "Můstkové a plošinové váhy",
        products: [
          {
            id: "m1",
            name: "Plošinová váha 4T",
            price: "od 23.140 Kč",
            specs: "Až 1500 kg",
          },
          {
            id: "m2",
            name: "Stolní váha FOX-1",
            price: "od 6.260 Kč",
            specs: "Kompaktní stolní řešení",
          },
        ],
      },
      {
        id: "laboratorni",
        label: "Laboratorní váhy",
        products: [
          {
            id: "l1",
            name: "Analytická váha Kern AET",
            price: "158.600 Kč",
            specs: "Dotykový displej",
          },
          {
            id: "l2",
            name: "CAS XE600g",
            price: "9.600 Kč",
            specs: "Přesnost 0,01 g",
          },
        ],
      },
      {
        id: "obchodni",
        label: "Obchodní váhy",
        products: [
          {
            id: "o1",
            name: "ACLAS PS1-15B (bez tisku)",
            price: "3.790 Kč",
            specs: "Základní obchodní váha",
          },
          {
            id: "o2",
            name: "CAS-CL5000 (s tiskem)",
            price: "27.800 Kč",
            specs: "S tiskem etiket",
          },
        ],
      },
      { id: "silnicni", label: "Silniční váhy", products: [] },
      { id: "jerabove", label: "Jeřábové váhy", products: [] },
      { id: "pocitaci", label: "Počítací váhy", products: [] },
      { id: "indikatory", label: "Indikátory", products: [] },
    ],
  },
  {
    id: "pokladny",
    label: "POKLADNY A PŘÍSLUŠENSTVÍ",
    icon: ShoppingCart,
    subcategories: [
      {
        id: "pokladny-all",
        label: "Pokladny a příslušenství",
        products: [
          {
            id: "pk1",
            name: "Pokladna CHD 3050",
            price: "6.690 Kč",
            specs: "Bez měsíčních poplatků",
          },
          {
            id: "pk2",
            name: "Pokladna CHD 3850",
            price: "8.350 Kč",
            specs: "Velká zásuvka",
          },
          {
            id: "pk3",
            name: "Termokotoučky a etikety",
            price: "Dle typu",
            specs: "Příslušenství pro pokladny",
          },
        ],
      },
    ],
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  PRODUCT CARD                                                */
/* ──────────────────────────────────────────────────────────── */
function ProductCard({ product }) {
  return (
    <div
      className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/60 hover:border-slate-300 hover:-translate-y-0.5 flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      {/* Badge */}
      {product.badge && (
        <div
          className="absolute top-3 right-3 z-10 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm"
          data-testid={`product-badge-${product.id}`}
        >
          <BadgeCheck className="w-3 h-3" />
          {product.badgeLabel || product.badge}
        </div>
      )}

      {/* Image placeholder */}
      <div className="relative h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-slate-400 transition-colors">
          <Scale className="w-12 h-12" />
          <span className="text-[10px] font-medium uppercase tracking-widest">
            Foto produktu
          </span>
        </div>
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-[15px] font-bold text-[#0F172A] leading-snug line-clamp-2 font-['Inter']"
          data-testid={`product-name-${product.id}`}
        >
          {product.name}
        </h3>

        {product.specs && (
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {product.specs}
          </p>
        )}

        <div className="mt-auto pt-4">
          <p
            className="text-lg font-bold text-[#0F172A] font-['Inter']"
            data-testid={`product-price-${product.id}`}
          >
            {product.price}
          </p>
          <Button
            className="mt-3 w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-sm rounded-md h-10 shadow-sm shadow-red-900/10 transition-all hover:-translate-y-px active:translate-y-0"
            data-testid={`product-cta-${product.id}`}
          >
            Poptat produkt
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  EMPTY STATE                                                 */
/* ──────────────────────────────────────────────────────────── */
function EmptyState({ label }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
      data-testid="catalog-empty-state"
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Clock className="w-7 h-7 text-slate-400" />
      </div>
      <p className="text-lg font-semibold text-[#0F172A] font-['Inter']">
        {label}
      </p>
      <p className="text-sm text-slate-500 mt-1 max-w-xs">
        Produkty v této kategorii připravujeme. Kontaktujte nás pro aktuální
        nabídku.
      </p>
      <Button
        variant="outline"
        className="mt-5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#0F172A] rounded-md"
        onClick={() => {
          const el = document.querySelector("#kontakt");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        data-testid="catalog-empty-cta"
      >
        Kontaktovat nás
      </Button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  SIDEBAR ITEM                                                */
/* ──────────────────────────────────────────────────────────── */
function SidebarCategory({
  category,
  expandedParent,
  setExpandedParent,
  activeSub,
  setActiveSub,
}) {
  const isExpanded = expandedParent === category.id;
  const Icon = category.icon;

  return (
    <div data-testid={`sidebar-parent-${category.id}`}>
      {/* Parent header */}
      <button
        onClick={() => {
          setExpandedParent(isExpanded ? null : category.id);
          if (!isExpanded && category.subcategories.length > 0) {
            setActiveSub(category.subcategories[0].id);
          }
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
          isExpanded
            ? "bg-[#0F172A] text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]"
        }`}
        data-testid={`sidebar-toggle-${category.id}`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-semibold tracking-tight flex-1">
          {category.label}
        </span>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        )}
      </button>

      {/* Subcategories */}
      {isExpanded && (
        <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-200 pl-3">
          {category.subcategories.map((sub) => {
            const isActive = activeSub === sub.id;
            const isEmpty = sub.products.length === 0;
            return (
              <button
                key={sub.id}
                onClick={() => setActiveSub(sub.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between gap-2 ${
                  isActive
                    ? "bg-slate-100 text-[#0F172A] font-semibold"
                    : "text-slate-500 hover:text-[#0F172A] hover:bg-slate-50"
                }`}
                data-testid={`sidebar-sub-${sub.id}`}
              >
                <span className="truncate">{sub.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    isEmpty
                      ? "bg-slate-100 text-slate-400"
                      : isActive
                      ? "bg-[#0F172A] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {isEmpty ? "—" : sub.products.length}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  MOBILE CHIP NAV                                             */
/* ──────────────────────────────────────────────────────────── */
function MobileChipNav({
  expandedParent,
  setExpandedParent,
  activeSub,
  setActiveSub,
}) {
  return (
    <div className="lg:hidden mb-6" data-testid="mobile-chip-nav">
      {/* Parent category chips */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {CATALOG.map((cat) => {
          const Icon = cat.icon;
          const isActive = expandedParent === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setExpandedParent(cat.id);
                if (cat.subcategories.length > 0) {
                  setActiveSub(cat.subcategories[0].id);
                }
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
                isActive
                  ? "bg-[#0F172A] text-white border-[#0F172A]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
              data-testid={`mobile-parent-${cat.id}`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Subcategory chips */}
      {expandedParent && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATALOG.find((c) => c.id === expandedParent)?.subcategories.map(
            (sub) => {
              const isActive = activeSub === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSub(sub.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-slate-100 text-[#0F172A] border-slate-300 font-semibold"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                  data-testid={`mobile-sub-${sub.id}`}
                >
                  {sub.label}
                  {sub.products.length === 0 && (
                    <span className="ml-1 text-slate-400">-</span>
                  )}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/*  MAIN CATALOG COMPONENT                                      */
/* ──────────────────────────────────────────────────────────── */
export default function ProductCatalog() {
  const [expandedParent, setExpandedParent] = useState("vahy");
  const [activeSub, setActiveSub] = useState("zdravotnicke");
  const [searchQuery, setSearchQuery] = useState("");

  // Find currently active subcategory data
  const activeSubData = useMemo(() => {
    for (const cat of CATALOG) {
      const found = cat.subcategories.find((s) => s.id === activeSub);
      if (found) return found;
    }
    return null;
  }, [activeSub]);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!activeSubData) return [];
    if (!searchQuery.trim()) return activeSubData.products;
    const q = searchQuery.toLowerCase();
    return activeSubData.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.specs && p.specs.toLowerCase().includes(q))
    );
  }, [activeSubData, searchQuery]);

  // Count total products
  const totalProducts = useMemo(() => {
    return CATALOG.reduce(
      (sum, cat) =>
        sum + cat.subcategories.reduce((s, sub) => s + sub.products.length, 0),
      0
    );
  }, []);

  return (
    <section
      id="katalog"
      className="py-24 md:py-32 bg-[#F8FAFC] section-reveal"
      data-testid="product-catalog-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DC2626] mb-3 block">
              Katalog produktů
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold text-[#0F172A] tracking-tight font-['Manrope']"
              data-testid="catalog-title"
            >
              Kompletní nabídka
            </h2>
            <p className="text-base text-slate-500 mt-2">
              {totalProducts} produktů ve {CATALOG.length} kategoriích
            </p>
          </div>

          {/* Search */}
          <div className="mt-4 md:mt-0 relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hledat v kategorii..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-lg text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]/40 transition-all"
              data-testid="catalog-search-input"
            />
          </div>
        </div>

        {/* Mobile chip navigation */}
        <MobileChipNav
          expandedParent={expandedParent}
          setExpandedParent={setExpandedParent}
          activeSub={activeSub}
          setActiveSub={setActiveSub}
        />

        {/* Main layout: sidebar + grid */}
        <div className="flex gap-8">
          {/* ── Left sidebar (desktop) ──────────────────────── */}
          <aside
            className="hidden lg:block w-72 flex-shrink-0"
            data-testid="catalog-sidebar"
          >
            <div className="sticky top-28 bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 px-4 pb-2">
                Kategorie
              </p>
              {CATALOG.map((cat) => (
                <SidebarCategory
                  key={cat.id}
                  category={cat}
                  expandedParent={expandedParent}
                  setExpandedParent={setExpandedParent}
                  activeSub={activeSub}
                  setActiveSub={setActiveSub}
                />
              ))}
            </div>
          </aside>

          {/* ── Right product grid ─────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Breadcrumb / active label */}
            {activeSubData && (
              <div className="flex items-center gap-2 mb-6" data-testid="catalog-breadcrumb">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {CATALOG.find((c) =>
                    c.subcategories.some((s) => s.id === activeSub)
                  )?.label}
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-[#0F172A] uppercase tracking-wider font-bold">
                  {activeSubData.label}
                </span>
                {activeSubData.products.length > 0 && (
                  <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full ml-1">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "produkt" : "produktů"}
                  </span>
                )}
              </div>
            )}

            {/* Product grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              data-testid="catalog-product-grid"
            >
              {activeSubData && activeSubData.products.length === 0 ? (
                <EmptyState label={`${activeSubData.label} — Připravujeme`} />
              ) : filteredProducts.length === 0 ? (
                <EmptyState label="Žádné výsledky" />
              ) : (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
