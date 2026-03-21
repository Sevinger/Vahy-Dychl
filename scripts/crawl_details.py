"""Crawl all product detail pages from vahy-dychl.cz and save descriptions."""
import requests
import re
import json
import time

BASE = "https://www.vahy-dychl.cz"

# Map product IDs to their detail page URLs
PRODUCT_URLS = {
    # Lab
    "l1": "/vahy/laboratorni-presne-vahy/kern-aet",
    "l2": "/vahy/laboratorni-presne-vahy/abs-abj",
    "l3": "/vahy/laboratorni-presne-vahy/ald",
    "l4": "/vahy/laboratorni-presne-vahy/cas-xe600g-_-xe6000g",
    # Obchodni bez tisku
    "ob1": "/vahy/obchodni-vahy-bez-tisku/aclas-ps1-15b",
    "ob2": "/vahy/obchodni-vahy-bez-tisku/cas-pr2",
    "ob3": "/vahy/obchodni-vahy-bez-tisku/tsqtp-_-tsqsp",
    "ob4": "/vahy/obchodni-vahy-bez-tisku/cas-er-plus",
    # Obchodni s tiskem
    "os1": "/vahy/obchodni-vahy-s-tiskem/cas-cl5000",
    "os2": "/vahy/obchodni-vahy-s-tiskem/sm-500",
    "os3": "/vahy/obchodni-vahy-s-tiskem/digi-sm5100",
    # Kuchyne
    "k1": "/vahy/kuchyne-a-sklady/tst28",
    "k2": "/vahy/kuchyne-a-sklady/ts-sw",
    "k3": "/vahy/kuchyne-a-sklady/tss29b",
    "k4": "/vahy/kuchyne-a-sklady/cas-ed",
    "k5": "/vahy/kuchyne-a-sklady/cas-sw",
    # Pocitaci
    "pc1": "/vahy/pocitaci-vahy/nhb",
    "pc2": "/vahy/pocitaci-vahy/nhbm",
    "pc3": "/vahy/pocitaci-vahy/tscale-qhw__",
    "pc4": "/vahy/pocitaci-vahy/cas-sw2",
    "pc5": "/vahy/pocitaci-vahy/tsjw",
    # Jerabove
    "j1": "/vahy/jerabove-vahy/jev",
    "j2": "/vahy/jerabove-vahy/j1-rws",
    "j3": "/vahy/jerabove-vahy/j1-rwp",
    # Mustkove
    "m1": "/vahy/mustkove-a-plosinove-vahy/4txxxxdfwl",
    "m2": "/vahy/kuchyne-a-sklady/fox---i",
    "m3": "/vahy/kuchyne-a-sklady/fox---ii",
    "m4": "/vahy/kuchyne-a-sklady/cas-db2",
    # Paletove
    "p1": "/vahy/pocitaci-vahy/kpz-2-04-7",
    "p2": "/vahy/paletove-vahy/p4tldfwl---uni",
    "p3": "/vahy/paletove-vahy/p4tdfwl",
    "p4": "/vahy/paletove-vahy/4tldfwl",
    # Silnicni
    "s1": "/vahy/silnicni-mostove-vahy/ocelove",
    "s2": "/vahy/silnicni-mostove-vahy/profi-universal",
    "s3": "/vahy/silnicni-mostove-vahy/zelezobetonove",
    # Zdravotnicke
    "z1": "/vahy/vahy-pro-zdravotnictvi/kojenecka-vaha",
    "z2": "/vahy/vahy-pro-zdravotnictvi/osobni-vaha",
    "z3": "/vahy/vahy-pro-zdravotnictvi/vazici-kreslo",
    "z4": "/vahy/vahy-pro-zdravotnictvi/najezdova-vaha",
    "z5": "/vahy/vahy-pro-zdravotnictvi/transportni-luzko",
    # Indikatory
    "i1": "/vahy/mustkove-a-plosinove-vahy/indikatory/bw",
    "i2": "/vahy/mustkove-a-plosinove-vahy/indikatory/bws",
    "i3": "/vahy/mustkove-a-plosinove-vahy/indikatory/sb520",
    "i4": "/vahy/mustkove-a-plosinove-vahy/indikatory/dfwl",
    "i5": "/vahy/mustkove-a-plosinove-vahy/indikatory/smart",
    # Pokladny
    "pk1": "/eet---registracni-pokladny/obchodni-pokladny/chd-3050",
    "pk2": "/eet---registracni-pokladny/obchodni-pokladny/chd-3850",
}

def extract_text(html):
    """Extract meaningful text from product detail page HTML."""
    # Remove scripts and styles
    html = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
    
    # Try to find the main content area
    # Look for typical content markers
    content = ""
    
    # Find table rows with product specs
    rows = re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.DOTALL)
    specs = []
    for row in rows:
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        if len(cells) >= 2:
            key = re.sub(r'<[^>]+>', '', cells[0]).strip()
            val = re.sub(r'<[^>]+>', '', cells[1]).strip()
            if key and val and len(key) < 100 and len(val) < 200:
                if any(c.isalpha() for c in key):
                    specs.append(f"{key}: {val}")
    
    # Find paragraphs and divs with text content
    paras = re.findall(r'<(?:p|div|span|li|h[1-6])[^>]*>(.*?)</(?:p|div|span|li|h[1-6])>', html, re.DOTALL)
    texts = []
    seen = set()
    for p in paras:
        clean = re.sub(r'<[^>]+>', ' ', p).strip()
        clean = re.sub(r'\s+', ' ', clean)
        if len(clean) > 15 and len(clean) < 1000 and clean not in seen:
            # Skip navigation/footer/header texts
            skip_words = ['košík', 'kontakt', 'obchodní podmínky', 'copyright', 'Nízkou cenu', 'Kvalitní servis',
                         'registračn', 'EET', 'Facebook', 'vytiskni', 'Tato stránka', 'zpět', 'Úvod']
            if not any(sw.lower() in clean.lower() for sw in skip_words):
                texts.append(clean)
                seen.add(clean)
    
    return {
        "specs": specs[:20],
        "descriptions": texts[:10]
    }

def main():
    results = {}
    for pid, url_path in PRODUCT_URLS.items():
        full_url = BASE + url_path
        try:
            resp = requests.get(full_url, timeout=15, headers={
                "User-Agent": "Mozilla/5.0"
            })
            if resp.status_code == 200:
                data = extract_text(resp.text)
                results[pid] = {
                    "url": url_path,
                    "specs": data["specs"],
                    "descriptions": data["descriptions"]
                }
                spec_count = len(data["specs"])
                desc_count = len(data["descriptions"])
                print(f"  [{pid}] OK - {spec_count} specs, {desc_count} texts")
            else:
                print(f"  [{pid}] HTTP {resp.status_code}")
                results[pid] = {"url": url_path, "specs": [], "descriptions": []}
        except Exception as e:
            print(f"  [{pid}] ERROR: {e}")
            results[pid] = {"url": url_path, "specs": [], "descriptions": []}
        time.sleep(0.2)
    
    with open("/app/scripts/product_details.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved {len(results)} product details to /app/scripts/product_details.json")

if __name__ == "__main__":
    main()
