import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Lock,
  LogOut,
  Upload,
  Trash2,
  Check,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Scale,
  ShoppingCart,
} from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/* ── All products (same as in ProductCatalog) ── */
const ALL_CATEGORIES = [
  {
    group: "VÁHY",
    categories: [
      {
        label: "Laboratorní přesné váhy",
        products: [
          { id: "l1", name: "Kern AET" },
          { id: "l2", name: "ABS-ABJ" },
          { id: "l3", name: "ALD" },
          { id: "l4", name: "CAS XE600g / 6000g" },
        ],
      },
      {
        label: "Obchodní váhy bez tisku",
        products: [
          { id: "ob1", name: "ACLAS PS1-15B" },
          { id: "ob2", name: "CAS PR2 / PR2 s nožkou" },
          { id: "ob3", name: "TSQTP / TSQSP" },
          { id: "ob4", name: "CAS-ER plus" },
        ],
      },
      {
        label: "Obchodní váhy s tiskem",
        products: [
          { id: "os1", name: "CAS-CL5000" },
          { id: "os2", name: "SM-500" },
          { id: "os3", name: "DIGI SM 5100 B/P" },
        ],
      },
      {
        label: "Váhy pro kuchyně a sklady",
        products: [
          { id: "k1", name: "TST28" },
          { id: "k2", name: "TS-SW" },
          { id: "k3", name: "TSS29B" },
          { id: "k4", name: "CAS-ED" },
          { id: "k5", name: "CAS-SW" },
        ],
      },
      {
        label: "Počítací váhy",
        products: [
          { id: "pc1", name: "NHB" },
          { id: "pc2", name: "NHBM" },
          { id: "pc3", name: "TSCALE QHW++" },
          { id: "pc4", name: "CAS SW2" },
          { id: "pc5", name: "TSJW" },
        ],
      },
      {
        label: "Jeřábové váhy",
        products: [
          { id: "j1", name: "JEV" },
          { id: "j2", name: "J1-RWS NEREZ" },
          { id: "j3", name: "J1-RWP" },
        ],
      },
      {
        label: "Můstkové a plošinové váhy",
        products: [
          { id: "m1", name: "Plošinová váha 4TxxxxDFWL" },
          { id: "m2", name: "FOX - 1" },
          { id: "m3", name: "FOX - 2" },
          { id: "m4", name: "CAS-DB2" },
        ],
      },
      {
        label: "Paletové váhy",
        products: [
          { id: "p1", name: "KPZ1" },
          { id: "p2", name: "P4TLDFWL - UNI" },
          { id: "p3", name: "P4TDFWL Paletová váha" },
          { id: "p4", name: "Ližinová váha 4TLDFWL" },
        ],
      },
      {
        label: "Silniční mostové váhy",
        products: [
          { id: "s1", name: "Ocelová konstrukce" },
          { id: "s2", name: "PROFI UNIVERSAL" },
          { id: "s3", name: "ZAPUŠTĚNÉ Železobetonové" },
        ],
      },
      {
        label: "Váhy pro zdravotnictví",
        products: [
          { id: "z1", name: "Kojenecká váha TSCALE" },
          { id: "z2", name: "Osobní váha TSCALE" },
          { id: "z3", name: "Mobilní vážící křeslo" },
          { id: "z4", name: "Nájezdová váha pro inv. vozíky" },
          { id: "z5", name: "Transportní lůžko s váhou" },
        ],
      },
      {
        label: "Indikátory",
        products: [
          { id: "i1", name: "BW" },
          { id: "i2", name: "BWS" },
          { id: "i3", name: "SB520" },
          { id: "i4", name: "DFWL" },
          { id: "i5", name: "Smart" },
        ],
      },
    ],
  },
  {
    group: "POKLADNY A PŘÍSLUŠENSTVÍ",
    categories: [
      {
        label: "Registrační pokladny a příslušenství",
        products: [
          { id: "pk1", name: "CHD 3050" },
          { id: "pk2", name: "CHD 3850" },
          { id: "pk3", name: "Snímače čárového kódu" },
          { id: "pk4", name: "Termokotoučky a Termoetikety" },
        ],
      },
    ],
  },
];

/* ── Login Screen ── */
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem("admin_token", res.data.token);
      onLogin(res.data.token);
      toast.success("Přihlášení úspěšné");
    } catch {
      toast.error("Nesprávné heslo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-[#0F172A] text-center font-['Manrope'] mb-1">
            Administrace
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            VÁHY DYCHL - Správa produktových fotek
          </p>
          <form onSubmit={handleSubmit}>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Zadejte heslo..."
              className="h-11 mb-4"
              data-testid="admin-password-input"
              autoFocus
            />
            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#0F172A] hover:bg-slate-800 text-white h-11 font-semibold"
              data-testid="admin-login-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Přihlásit se"}
            </Button>
          </form>
        </div>
        <div className="text-center mt-4">
          <a href="/" className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Zpět na web
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Product Image Card ── */
function ProductImageCard({ product, token, hasImage, onImageChange }) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (hasImage) {
      setImageUrl(`${API}/products/${product.id}/image?t=${Date.now()}`);
    } else {
      setImageUrl(null);
    }
  }, [hasImage, product.id]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max. velikost 5 MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(`${API}/admin/products/${product.id}/image`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setImageUrl(`${API}/products/${product.id}/image?t=${Date.now()}`);
      onImageChange();
      toast.success(`Foto nahráno: ${product.name}`);
    } catch (err) {
      toast.error("Nahrávání selhalo");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API}/admin/products/${product.id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImageUrl(null);
      onImageChange();
      toast.success(`Foto odstraněno: ${product.name}`);
    } catch {
      toast.error("Odstranění selhalo");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors"
      data-testid={`admin-product-${product.id}`}
    >
      {/* Image area */}
      <div className="relative h-36 bg-slate-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageUrl(null)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-300">
            <ImageIcon className="w-8 h-8" />
            <span className="text-[9px] uppercase tracking-widest">Bez fotky</span>
          </div>
        )}
        {imageUrl && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-xs font-bold text-[#0F172A] truncate" title={product.name}>
          {product.name}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">ID: {product.id}</p>

        <div className="flex gap-2 mt-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleUpload}
            data-testid={`admin-upload-input-${product.id}`}
          />
          <Button
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex-1 h-8 text-xs bg-[#0F172A] hover:bg-slate-800 text-white"
            data-testid={`admin-upload-btn-${product.id}`}
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
            {uploading ? "..." : "Nahrát"}
          </Button>
          {imageUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
              data-testid={`admin-delete-btn-${product.id}`}
            >
              {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Admin Panel ── */
export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem("admin_token") || "");
  const [authenticated, setAuthenticated] = useState(false);
  const [imageProductIds, setImageProductIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/products/images/all`);
      setImageProductIds(new Set(res.data.product_ids));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify token on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        await axios.get(`${API}/products/images/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuthenticated(true);
        fetchImages();
      } catch {
        localStorage.removeItem("admin_token");
        setToken("");
        setLoading(false);
      }
    })();
  }, [token, fetchImages]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setAuthenticated(true);
    fetchImages();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken("");
    setAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const totalProducts = ALL_CATEGORIES.reduce(
    (sum, g) => sum + g.categories.reduce((s, c) => s + c.products.length, 0),
    0
  );
  const uploadedCount = imageProductIds.size;

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-panel">
      {/* Header */}
      <header className="bg-[#0F172A] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-sm flex items-center justify-center">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold font-['Manrope'] text-sm">VÁHY DYCHL - Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">
              {uploadedCount}/{totalProducts} fotek
            </span>
            <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3 inline mr-1" />Web
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={handleLogout}
              className="h-8 text-xs border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-3 h-3 mr-1" /> Odhlásit
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A] font-['Manrope']" data-testid="admin-title">
            Správa produktových fotek
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Nahrajte fotky k jednotlivým produktům. Zobrazí se na webu v katalogu.
          </p>
          {/* Progress bar */}
          <div className="mt-4 bg-slate-200 rounded-full h-2 overflow-hidden max-w-md">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${totalProducts ? (uploadedCount / totalProducts) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {uploadedCount} z {totalProducts} produktů má fotku
          </p>
        </div>

        {ALL_CATEGORIES.map((group) => (
          <div key={group.group} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {group.group === "VÁHY" ? (
                <Scale className="w-4 h-4 text-slate-500" />
              ) : (
                <ShoppingCart className="w-4 h-4 text-slate-500" />
              )}
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                {group.group}
              </h2>
            </div>
            {group.categories.map((cat) => (
              <div key={cat.label} className="mb-8">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-3 font-['Manrope']">
                  {cat.label}
                  <span className="text-xs text-slate-400 font-normal ml-2">
                    ({cat.products.filter((p) => imageProductIds.has(p.id)).length}/{cat.products.length})
                  </span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {cat.products.map((product) => (
                    <ProductImageCard
                      key={product.id}
                      product={product}
                      token={token}
                      hasImage={imageProductIds.has(product.id)}
                      onImageChange={fetchImages}
                    />
                  ))}
                </div>
                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
