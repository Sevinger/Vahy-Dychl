import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesGrid from "@/components/CategoriesGrid";
import ProductCatalog from "@/components/ProductCatalog";
import Bestsellers from "@/components/Bestsellers";
import ServiceSection from "@/components/ServiceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

function App() {
  // Scroll reveal effect
  useEffect(() => {
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
    <div className="min-h-screen bg-white" data-testid="app-root">
      <Navbar />
      <main>
        <HeroSection />
        <CategoriesGrid />
        <ProductCatalog />
        <Bestsellers />
        <ServiceSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
