import { useState } from "react";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Obchodní a kuchyňské váhy",
    description: "Přesné váhy pro maloobchod, gastronomii a potravinářský průmysl.",
    image: "https://images.unsplash.com/photo-1764795849833-6e9d6e399a77?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwb2ludCUyMG9mJTIwc2FsZSUyMHN5c3RlbSUyMHJldGFpbHxlbnwwfHx8fDE3NzQwMjMwMzh8MA&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-1 md:row-span-1",
    catalogParentId: "vahy",
    catalogSubId: "obchodni",
  },
  {
    title: "Průmyslové, plošinové a paletové váhy",
    description: "Robustní řešení pro sklady, výrobu a logistiku. Kapacity od 30 kg do 10 t.",
    image: "https://images.unsplash.com/photo-1700582053942-44c81e76a168?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzZ8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhdGZvcm0lMjBzY2FsZSUyMG1ldGFsJTIwZmxvb3J8ZW58MHx8fHwxNzc0MDIzMDQ0fDA&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-2 md:row-span-2",
    featured: true,
    catalogParentId: "vahy",
    catalogSubId: "paletove",
  },
  {
    title: "Laboratorní přesné váhy",
    description: "Analytické a přesné váhy s rozlišením od 0,001 mg.",
    image: "https://images.pexels.com/photos/3912364/pexels-photo-3912364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    span: "md:col-span-1 md:row-span-2",
    catalogParentId: "vahy",
    catalogSubId: "laboratorni",
  },
  {
    title: "Silniční mostové a jeřábové váhy",
    description: "Velkokapacitní vážení pro silniční dopravu a těžký průmysl.",
    image: "https://images.unsplash.com/photo-1720036236632-fdb6211cf317?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxpbmR1c3RyaWFsJTIwZGlnaXRhbCUyMHNjYWxlJTIwd2FyZWhvdXNlfGVufDB8fHx8MTc3NDAyMzAzN3ww&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-1 md:row-span-1",
    catalogParentId: "vahy",
    catalogSubId: "silnicni",
  },
  {
    title: "Registrační pokladny a snímače čárových kódů",
    description: "Kompletní pokladní systémy a příslušenství pro maloobchod.",
    image: "https://images.unsplash.com/photo-1764795850459-3e73e5013ae8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwb2ludCUyMG9mJTIwc2FsZSUyMHN5c3RlbSUyMHJldGFpbHxlbnwwfHx8fDE3NzQwMjMwMzh8MA&ixlib=rb-4.1.0&q=85",
    span: "md:col-span-2 md:row-span-1",
    catalogParentId: "pokladny",
    catalogSubId: "pokladny-all",
  },
];

export default function CategoriesGrid() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCategoryClick = (cat, index) => {
    setActiveCard(index);
    // Dispatch event to ProductCatalog
    window.dispatchEvent(
      new CustomEvent("selectCatalogCategory", {
        detail: {
          parentId: cat.catalogParentId,
          subId: cat.catalogSubId,
        },
      })
    );
    // Scroll to catalog section
    setTimeout(() => {
      const el = document.querySelector("#katalog");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <section
      id="produkty"
      className="py-24 md:py-32 bg-white section-reveal"
      data-testid="categories-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3 block">
            Katalog
          </span>
          <h2
            className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight font-['Manrope']"
            data-testid="categories-title"
          >
            Naše produkty
          </h2>
          <p className="text-base md:text-lg text-slate-500 mt-3 max-w-xl">
            Klikněte na kategorii pro zobrazení kompletní nabídky produktů.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[260px] gap-4" data-testid="categories-grid">
          {categories.map((cat, i) => {
            const isActive = activeCard === i;
            return (
              <button
                key={cat.title}
                type="button"
                onClick={() => handleCategoryClick(cat, i)}
                className={`category-card group relative overflow-hidden border-2 cursor-pointer transition-all duration-300 text-left ${cat.span} ${
                  isActive
                    ? "border-[#0F172A] ring-2 ring-[#0F172A]/20 scale-[1.01]"
                    : "border-transparent hover:border-orange-500/40"
                }`}
                data-testid={`category-card-${i}`}
                aria-label={`Zobrazit ${cat.title}`}
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="category-image absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay gradient */}
                <div className={`absolute inset-0 transition-colors duration-300 ${
                  isActive
                    ? "bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/50 to-[#0F172A]/20"
                    : "bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"
                }`} />

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-4 left-4 z-10 bg-[#0F172A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Aktivní
                  </div>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                  <h3 className={`font-bold text-white font-['Manrope'] ${cat.featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-slate-300 mt-2 ${cat.featured ? 'text-sm md:text-base' : 'text-sm'} line-clamp-2`}>
                    {cat.description}
                  </p>
                  <div className={`flex items-center gap-1 mt-4 transition-colors ${
                    isActive ? "text-white" : "text-orange-400 group-hover:text-orange-300"
                  }`}>
                    <span className="text-sm font-medium">Zobrazit nabídku</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
