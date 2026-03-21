import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Scale,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Info,
} from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductDetailModal({ product, open, onOpenChange, imageUrl }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      setLoading(true);
      axios
        .get(`${API}/products/${product.id}/details`)
        .then((res) => setDetails(res.data))
        .catch(() => setDetails({ specs: [], descriptions: [] }))
        .finally(() => setLoading(false));
    }
  }, [open, product]);

  if (!product) return null;

  const isMBadge = product.badge === "M";
  const isCBadge = product.badge === "C";

  const scrollToContact = () => {
    onOpenChange(false);
    setTimeout(() => {
      const el = document.querySelector("#kontakt");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0"
        data-testid="product-detail-modal"
      >
        {/* Image header */}
        <div className="relative h-56 sm:h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-contain bg-white p-4"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <Scale className="w-16 h-16" />
              <span className="text-xs uppercase tracking-widest">Foto produktu</span>
            </div>
          )}
          {/* Badge overlay */}
          {product.badge && (
            <div
              className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md ${
                isMBadge
                  ? "bg-emerald-500 text-white"
                  : isCBadge
                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                  : "bg-sky-100 text-sky-700 border border-sky-200"
              }`}
            >
              {isMBadge ? <BadgeCheck className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              {product.badgeLabel || product.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-[#0F172A] font-['Manrope'] text-left">
              {product.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 text-left mt-1">
              {product.specs || "Produktový detail"}
            </DialogDescription>
          </DialogHeader>

          {/* Price */}
          {!product.noPrice && product.price && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-5 py-3 mb-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cena</p>
              <p className="text-2xl font-bold text-[#0F172A] font-['Inter']">
                {product.price}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            </div>
          )}

          {/* Specs table */}
          {details && details.specs && details.specs.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                Technické parametry
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm" data-testid="product-specs-table">
                  <tbody>
                    {details.specs.map((spec, i) => {
                      const parts = spec.split(/:(.+)/);
                      const key = parts[0]?.trim();
                      const val = parts[1]?.trim() || "";
                      return (
                        <tr
                          key={i}
                          className={`${i % 2 === 0 ? "bg-white" : "bg-slate-50"} border-b border-slate-100 last:border-0`}
                        >
                          <td className="px-4 py-2.5 font-medium text-slate-700 w-2/5">
                            {key}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">
                            {val}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Descriptions */}
          {details && details.descriptions && details.descriptions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-3">
                Popis
              </h3>
              <div className="space-y-2">
                {details.descriptions.map((desc, i) => (
                  <p key={i} className="text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* No details fallback */}
          {details && details.specs?.length === 0 && details.descriptions?.length === 0 && (
            <p className="text-sm text-slate-400 italic py-4">
              Podrobné informace pro tento produkt připravujeme. Kontaktujte nás pro více informací.
            </p>
          )}

          <Separator className="my-5" />

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={scrollToContact}
              className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold h-12 rounded-md text-sm"
              data-testid="product-detail-cta"
            >
              {product.ctaText || "Poptat produkt"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-12 rounded-md text-sm border-slate-200"
            >
              Zavřít
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
