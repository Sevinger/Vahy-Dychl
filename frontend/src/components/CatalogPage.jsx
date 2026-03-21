import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCatalog from "@/components/ProductCatalog";
import Footer from "@/components/Footer";

export default function CatalogPage() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Section reveal animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".section-reveal").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white" data-testid="catalog-page">
      <Navbar />
      <main className="pt-20">
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  );
}
