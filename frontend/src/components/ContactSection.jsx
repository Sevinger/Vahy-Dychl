import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Send, Loader2, MapPin, Phone, Mail } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Vyplňte prosím všechna povinná pole.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      toast.success(res.data.message);
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err) {
      toast.error("Odeslání se nezdařilo. Zkuste to prosím znovu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="kontakt"
      className="py-24 md:py-32 bg-[#F8FAFC] section-reveal"
      data-testid="contact-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left - Info (2 cols) */}
          <div className="lg:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3 block">
              Kontakt
            </span>
            <h2
              className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight font-['Manrope']"
              data-testid="contact-title"
            >
              Napište nám
            </h2>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              Rádi vám poradíme s výběrem vhodného vážicího systému nebo vám
              připravíme cenovou nabídku na míru.
            </p>

            <Separator className="my-8" />

            {/* Contact info */}
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Adresa</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Kocourkova 3, 787 01 Šumperk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Telefon</p>
                  <a
                    href="tel:+420775698555"
                    className="text-sm text-orange-600 hover:text-orange-700 mt-0.5 block transition-colors"
                    data-testid="contact-phone"
                  >
                    +420 775 698 555
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email</p>
                  <a
                    href="mailto:m.dytrich@seznam.cz"
                    className="text-sm text-orange-600 hover:text-orange-700 mt-0.5 block transition-colors"
                    data-testid="contact-email"
                  >
                    m.dytrich@seznam.cz
                  </a>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                IČ
              </p>
              <p className="text-sm text-slate-600">73235202</p>
            </div>
          </div>

          {/* Right - Form (3 cols) */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 p-8 md:p-10"
              data-testid="contact-form"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                    Jméno *
                  </label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jan Novák"
                    className="h-12 rounded-md border-slate-200 focus-visible:ring-orange-600"
                    data-testid="contact-input-name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                    Email *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jan@firma.cz"
                    className="h-12 rounded-md border-slate-200 focus-visible:ring-orange-600"
                    data-testid="contact-input-email"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                    Telefon
                  </label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+420 ..."
                    className="h-12 rounded-md border-slate-200 focus-visible:ring-orange-600"
                    data-testid="contact-input-phone"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                    Firma
                  </label>
                  <Input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Název firmy"
                    className="h-12 rounded-md border-slate-200 focus-visible:ring-orange-600"
                    data-testid="contact-input-company"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 block">
                  Zpráva *
                </label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Popište nám vaše požadavky..."
                  rows={5}
                  className="rounded-md border-slate-200 focus-visible:ring-orange-600 resize-none"
                  data-testid="contact-input-message"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 rounded-md shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-base"
                data-testid="contact-submit-btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Odesílám...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Odeslat poptávku
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-400 mt-4 text-center">
                Odesláním souhlasíte se zpracováním osobních údajů.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
