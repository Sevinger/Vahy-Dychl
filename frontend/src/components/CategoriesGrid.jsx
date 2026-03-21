import { useNavigate } from "react-router-dom";
import { ArrowRight, Scale, ShoppingCart, FlaskConical, Truck, Stethoscope, Gauge } from "lucide-react";

const categories = [
  {
    id: "laboratorni",
    title: "Laboratorní váhy",
    description: "Analytické a přesné váhy",
    icon: FlaskConical,
    color: "from-violet-500 to-purple-600",
    catalogParentId: "vahy",
    catalogSubId: "laboratorni",
  },
  {
    id: "obchodni",
    title: "Obchodní váhy",
    description: "Pro maloobchod a gastronomii",
    icon: ShoppingCart,
    color: "from-orange-500 to-red-500",
    catalogParentId: "vahy",
    catalogSubId: "obchodni-bez",
  },
  {
    id: "prumyslove",
    title: "Průmyslové váhy",
    description: "Plošinové a paletové váhy",
    icon: Scale,
    color: "from-slate-600 to-slate-800",
    catalogParentId: "vahy",
    catalogSubId: "paletove",
  },
  {
    id: "silnicni",
    title: "Silniční váhy",
    description: "Mostové a jeřábové váhy",
    icon: Truck,
    color: "from-blue-500 to-cyan-500",
    catalogParentId: "vahy",
    catalogSubId: "silnicni",
  },
  {
    id: "zdravotnicke",
    title: "Zdravotnické váhy",
    description: "Kojenecké a osobní váhy",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-500",
    catalogParentId: "vahy",
    catalogSubId: "zdravotnicke",
  },
  {
    id: "pokladny",
    title: "Registrační pokladny",
    description: "Pokladny a příslušenství",
    icon: Gauge,
    color: "from-amber-500 to-orange-500",
    catalogParentId: "pokladny",
    catalogSubId: "pokladny-all",
  },
];

export default function CategoriesGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    // Navigate to catalog page with category info
    navigate(`/katalog?parent=${cat.catalogParentId}&sub=${cat.catalogSubId}`);
  };

  return (
    <section
      id="produkty"
      className="py-24 md:py-32 bg-[#F8FAFC] section-reveal"
      data-testid="categories-section"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DC2626] mb-3 block">
            Katalog
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight font-['Manrope']"
            data-testid="categories-title"
          >
            Naše produkty
          </h2>
          <p className="text-base text-slate-500 mt-4 max-w-md mx-auto">
            Vyberte kategorii pro zobrazení kompletní nabídky
          </p>
        </div>

        {/* Category Cards Grid - 6 simple cards */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          data-testid="categories-grid"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-left transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
                data-testid={`category-card-${cat.id}`}
              >
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#0F172A] font-['Manrope'] mb-2">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 mb-4">
                  {cat.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-[#DC2626] font-medium text-sm group-hover:gap-2.5 transition-all">
                  <span>Zobrazit nabídku</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-[#DC2626] to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </button>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/katalog")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#DC2626] transition-colors"
            data-testid="view-all-products"
          >
            Zobrazit všechny produkty
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
