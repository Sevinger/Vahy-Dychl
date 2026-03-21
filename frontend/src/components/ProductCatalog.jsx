import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
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
  ShieldCheck,
} from "lucide-react";
import ProductDetailModal from "./ProductDetailModal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

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
        id: "laboratorni",
        label: "Laboratorní přesné váhy, analytické",
        products: [
          { id: "l1", name: "Kern AET", specs: "Analytická váha, Cejchovatelná, Dotykový displej", price: "158.600 Kč bez DPH", badge: "C", badgeLabel: "Cejchovatelná" },
          { id: "l2", name: "ABS-ABJ", specs: "Analytická váha, Cejchovatelná, Jednočlánkový vážící systém", price: "24.960 Kč bez DPH", badge: "C", badgeLabel: "Cejchovatelná" },
          { id: "l3", name: "ALD", specs: "Analytická váha, Vnitřní kalibrace, Možnost ověření", price: "32.200 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "l4", name: "CAS XE600g / 6000g", specs: "Pro zlatníky, lékárny, laboratoře. Úředně ověřeno", price: "9.600 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
        ],
      },
      {
        id: "obchodni-bez",
        label: "Obchodní váhy bez tisku",
        products: [
          { id: "ob1", name: "ACLAS PS1-15B", specs: "Výpočet ceny, Váživost 6/15kg, Úředně ověřeno", price: "3.790 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "ob2", name: "CAS PR2 / PR2 s nožkou", specs: "Dvourozsahová, Akumulátor, Úředně ověřeno", price: "4.290 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "ob3", name: "TSQTP / TSQSP", specs: "Výpočet vratné částky, Úředně ověřeno", price: "5.990 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "ob4", name: "CAS-ER plus", specs: "Skvělý poměr výkon/cena, Úředně ověřeno", price: "7.790 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
        ],
      },
      {
        id: "obchodni-s",
        label: "Obchodní váhy s tiskem",
        products: [
          { id: "os1", name: "CAS-CL5000", specs: "Tisk účtenek nebo etiket, Úředně ověřeno", price: "27.800 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "os2", name: "SM-500", specs: "Dvourozsahová, Tisk účtenek/etiket, Úředně ověřeno", price: "37.700 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "os3", name: "DIGI SM 5100 B/P", specs: "Tisk účtenek i etiket, Úředně ověřeno", price: "33.780 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
        ],
      },
      {
        id: "kuchyne",
        label: "Váhy pro kuchyně a sklady",
        products: [
          { id: "k1", name: "TST28", specs: "Dvourozsahová, s akumulátorem, Úředně ověřeno", price: "4.790 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "k2", name: "TS-SW", specs: "Voděodolná s akumulátorem, Úředně ověřeno", price: "6.490 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "k3", name: "TSS29B", specs: "Nerezová, Voděodolná proti stříkající vodě, Úředně ověřeno", price: "7.290 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "k4", name: "CAS-ED", specs: "S akumulátorem, Váživost do 30kg, Úředně ověřeno", price: "7.200 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "k5", name: "CAS-SW", specs: "Řada W - voděodolná, Dvourozsahová, Úředně ověřeno", price: "5.190 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
        ],
      },
      {
        id: "pocitaci",
        label: "Počítací váhy",
        products: [
          { id: "pc1", name: "NHB", specs: "Laboratorní váha, Neověřená, Rychlé vážení", price: "5.390 Kč bez DPH" },
          { id: "pc2", name: "NHBM", specs: "Laboratorní váha, Úředně ověřená", price: "8.690 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "pc3", name: "TSCALE QHW++", specs: "Přesnost 0.02g, Výdrž aku 90 hod", price: "6.890 Kč bez DPH" },
          { id: "pc4", name: "CAS SW2", specs: "Řada SW2, Druhý displej, Počítání kusů, Úředně ověřeno", price: "5.400 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "pc5", name: "TSJW", specs: "Nízká cena, velké číslice, kontrolní vážení", price: "5.990 Kč bez DPH" },
        ],
      },
      {
        id: "jerabove",
        label: "Jeřábové váhy",
        products: [
          { id: "j1", name: "JEV", specs: "Necejchovatelná, Dálkové ovládání, Váživost 3.5t-15t", price: "10.290 Kč bez DPH" },
          { id: "j2", name: "J1-RWS NEREZ", specs: "Možnost ověření, Dálkové ovládání, 60kg-9t", price: "16.870 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "j3", name: "J1-RWP", specs: "Možnost ověření, Dálkové ovládání, 6kg-150kg", price: "7.990 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
        ],
      },
      {
        id: "mustkove",
        label: "Můstkové a plošinové váhy",
        products: [
          { id: "m1", name: "Plošinová váha 4TxxxxDFWL", specs: "Možnost ověření, do 1500kg, Včetně indikátoru", price: "23.140 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "m2", name: "FOX - 1", specs: "Stolní dvourozsahová, Ověřená, do 45kg", price: "6.260 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "m3", name: "FOX - 2", specs: "Stolní dvourozsahová, Ověřená, do 250kg", price: "7.690 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "m4", name: "CAS-DB2", specs: "Počítací funkce, S akumulátorem, Úředně ověřeno", price: "8.890 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
        ],
      },
      {
        id: "paletove",
        label: "Paletové váhy",
        products: [
          { id: "p1", name: "KPZ1", specs: "Váživost 2200kg, Přesnost 500g, Možnost ověření", price: "22.590 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "p2", name: "P4TLDFWL - UNI", specs: "Váživost do 1500kg, Možnost ověření", price: "19.790 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "p3", name: "P4TDFWL Paletová váha", specs: "Váživost do 2000kg, Možnost ověření", price: "17.690 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "p4", name: "Ližinová váha 4TLDFWL", specs: "Váživost do 3000kg, Možnost ověření", price: "19.900 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
        ],
      },
      {
        id: "silnicni",
        label: "Silniční mostové váhy",
        products: [
          { id: "s1", name: "Ocelová konstrukce (Nájezdové/Zapuštěné)", noPrice: true, ctaText: "Nezávazná poptávka" },
          { id: "s2", name: "PROFI UNIVERSAL", specs: "Železobetonová konstrukce, Váživost 60t, Třída OIML III", noPrice: true, ctaText: "Nezávazná poptávka" },
          { id: "s3", name: "ZAPUŠTĚNÉ Železobetonové", noPrice: true, ctaText: "Nezávazná poptávka" },
        ],
      },
      {
        id: "zdravotnicke",
        label: "Váhy pro zdravotnictví",
        products: [
          { id: "z1", name: "Kojenecká váha TSCALE", price: "7.190 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "z2", name: "Osobní váha TSCALE", price: "11.970 Kč bez DPH", badge: "M", badgeLabel: "Ověřeno" },
          { id: "z3", name: "Mobilní vážící křeslo 1TVKLDFWLB", price: "23.700 Kč bez DPH", badge: "O", badgeLabel: "Ověřitelná" },
          { id: "z4", name: "Nájezdová váha pro invalidní vozíky", specs: "S vestavěnými nájezdy", price: "25.990 Kč bez DPH" },
          { id: "z5", name: "Transportní lůžko s váhou 4TVL-DFWL", price: "59.990 Kč bez DPH" },
        ],
      },
      {
        id: "indikatory",
        label: "Indikátory",
        products: [
          { id: "i1", name: "BW", specs: "Plastový, S akumulátorem, Limitní vážení", price: "3.990 Kč bez DPH" },
          { id: "i2", name: "BWS", specs: "Nerezový, S akumulátorem", price: "5.190 Kč bez DPH" },
          { id: "i3", name: "SB520", specs: "Počítací, 3 displeje", price: "4.000 Kč bez DPH" },
          { id: "i4", name: "DFWL", specs: "Možnost úředního ověření", noPrice: true, ctaText: "Cena na dotaz" },
          { id: "i5", name: "Smart", specs: "Nerez, pro automobilové váhy", noPrice: true, ctaText: "Cena na dotaz" },
        ],
      },
    ],
  },
  {
    id: "pokladny",
    label: "POKLADNY A PŘÍSLUŠENSTVÍ",
    icon: ShoppingCart,
    subcategories: [
      {
        id: "pokladny-all",
        label: "Registrační pokladny a příslušenství",
        products: [
          { id: "pk1", name: "CHD 3050", specs: "Bez měsíčních poplatků, Pro malé prodejny", price: "Od 6.690 Kč bez DPH" },
          { id: "pk2", name: "CHD 3850", specs: "Bez měsíčních poplatků, Pro menší prodejny", price: "Od 6.890 Kč bez DPH" },
          { id: "pk3", name: "Snímače čárového kódu", noPrice: true, ctaText: "Více informací" },
          { id: "pk4", name: "Termokotoučky a Termoetikety", noPrice: true, ctaText: "Více informací" },
        ],
      },
    ],
  },
];

/* ──────────────────────────────────────────────────────────── */
/*  PRODUCT CARD                                                */
/* ──────────────────────────────────────────────────────────── */
function ProductCard({ product, imageUrl, onProductClick }) {
  const isMBadge = product.badge === "M";
  const isCBadge = product.badge === "C";
  const isOBadge = product.badge === "O";
  const [imgError, setImgError] = useState(false);

  const handleCardClick = (e) => {
    // Prevent click if user clicked the CTA button
    if (e.target.closest('[data-testid^="product-cta-"]')) return;
    onProductClick?.(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/60 hover:border-slate-300 hover:-translate-y-0.5 flex flex-col cursor-pointer"
      data-testid={`product-card-${product.id}`}
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-3 right-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm ${
            isMBadge
              ? "bg-emerald-500 text-white"
              : isCBadge
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : "bg-sky-100 text-sky-700 border border-sky-200"
          }`}
          data-testid={`product-badge-${product.id}`}
        >
          {isMBadge ? (
            <BadgeCheck className="w-3 h-3" />
          ) : (
            <ShieldCheck className="w-3 h-3" />
          )}
          {product.badgeLabel || product.badge}
        </div>
      )}

      {/* Image — shows upload or placeholder */}
      <div className="relative h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center overflow-hidden">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-slate-400 transition-colors">
            <Scale className="w-10 h-10" />
            <span className="text-[10px] font-medium uppercase tracking-widest">
              Foto produktu
            </span>
          </div>
        )}
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
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
            {product.specs}
          </p>
        )}

        <div className="mt-auto pt-4">
          {!product.noPrice && product.price && (
            <p
              className="text-lg font-bold text-[#0F172A] font-['Inter']"
              data-testid={`product-price-${product.id}`}
            >
              {product.price}
            </p>
          )}
          <Button
            className={`w-full font-semibold text-sm rounded-md h-10 shadow-sm transition-all hover:-translate-y-px active:translate-y-0 ${
              product.noPrice ? "mt-1" : "mt-3"
            } bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-red-900/10`}
            data-testid={`product-cta-${product.id}`}
          >
            {product.ctaText || "Poptat produkt"}
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
  const [searchParams] = useSearchParams();
  const urlParent = searchParams.get("parent");
  const urlSub = searchParams.get("sub");
  
  const [expandedParent, setExpandedParent] = useState(urlParent || "vahy");
  const [activeSub, setActiveSub] = useState(urlSub || "laboratorni");
  const [searchQuery, setSearchQuery] = useState("");
  const [imageProductIds, setImageProductIds] = useState(new Set());
  
  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Set category from URL params on mount
  useEffect(() => {
    if (urlParent) setExpandedParent(urlParent);
    if (urlSub) setActiveSub(urlSub);
  }, [urlParent, urlSub]);

  // Fetch which products have images
  useEffect(() => {
    axios
      .get(`${API}/products/images/all`)
      .then((res) => setImageProductIds(new Set(res.data.product_ids)))
      .catch(() => {});
  }, []);

  // Listen for category selection events from CategoriesGrid
  useEffect(() => {
    const handler = (e) => {
      const { parentId, subId } = e.detail;
      setExpandedParent(parentId);
      setActiveSub(subId);
      setSearchQuery("");
    };
    window.addEventListener("selectCatalogCategory", handler);
    return () => window.removeEventListener("selectCatalogCategory", handler);
  }, []);

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
              {totalProducts} produktů ve 12 kategoriích
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
                  <ProductCard
                    key={product.id}
                    product={product}
                    imageUrl={
                      imageProductIds.has(product.id)
                        ? `${API}/products/${product.id}/image`
                        : null
                    }
                    onProductClick={handleProductClick}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
        imageUrl={
          selectedProduct && imageProductIds.has(selectedProduct.id)
            ? `${API}/products/${selectedProduct.id}/image`
            : null
        }
      />
    </section>
  );
}
