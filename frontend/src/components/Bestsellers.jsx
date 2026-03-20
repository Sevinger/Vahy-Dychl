import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const bestsellers = [
  {
    title: "Paletová váha PW-3000",
    spec: "Kapacita: 3000 kg | Dílek: 1 kg | Nerez plošina",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1772683709393-f0cf8c226872?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwcHJlY2lzaW9uJTIwc2NhbGUlMjBkaWdpdGFsfGVufDB8fHx8MTc3NDAyMzA0NXww&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Obchodní váha CAS CL5200",
    spec: "S tiskem etiket | Kapacita: 30 kg | LCD displej",
    badge: "Novinka",
    image: "https://images.unsplash.com/photo-1764795850459-3e73e5013ae8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBwb2ludCUyMG9mJTIwc2FsZSUyMHN5c3RlbSUyMHJldGFpbHxlbnwwfHx8fDE3NzQwMjMwMzh8MA&ixlib=rb-4.1.0&q=85",
  },
  {
    title: "Plošinová váha 4T-1215",
    spec: "Kapacita: 600 kg | Rozměr: 1200x1500 mm | IP67",
    badge: "Akce",
    image: "https://images.unsplash.com/photo-1720036236632-fdb6211cf317?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxpbmR1c3RyaWFsJTIwZGlnaXRhbCUyMHNjYWxlJTIwd2FyZWhvdXNlfGVufDB8fHx8MTc3NDAyMzAzN3ww&ixlib=rb-4.1.0&q=85",
  },
];

export default function Bestsellers() {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="py-24 md:py-32 bg-[#F8FAFC] section-reveal"
      data-testid="bestsellers-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3 block">
              Doporučujeme
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight font-['Manrope']"
              data-testid="bestsellers-title"
            >
              Nejžádanější řešení
            </h2>
          </div>
          <button
            onClick={() => scrollTo("#produkty")}
            className="mt-4 md:mt-0 text-sm font-medium text-slate-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
            data-testid="bestsellers-view-all"
          >
            Zobrazit vše <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8" data-testid="bestsellers-grid">
          {bestsellers.map((product, i) => (
            <div
              key={product.title}
              className="bestseller-card group bg-white border border-slate-200 overflow-hidden hover:border-orange-500/30"
              data-testid={`bestseller-card-${i}`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${
                      product.badge === "Bestseller"
                        ? "bg-orange-100 text-orange-700"
                        : product.badge === "Novinka"
                        ? "bg-slate-900 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 font-['Manrope']">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {product.spec}
                </p>
                <Button
                  onClick={() => scrollTo("#kontakt")}
                  className="mt-5 w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-md transition-all"
                  data-testid={`bestseller-cta-${i}`}
                >
                  Zjistit cenu
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
