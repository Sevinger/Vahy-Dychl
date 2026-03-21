"""Enhanced scraper to get missing product details from vahy-dychl.cz"""
import requests
import re
import json
import time
from bs4 import BeautifulSoup

BASE = "https://www.vahy-dychl.cz"

# Products that need details - mapped to correct URLs
MISSING_PRODUCTS = {
    # Laboratorni
    "l3": "/vahy/laboratorni-presne-vahy/ald",
    
    # Obchodni bez tisku
    "ob1": "/vahy/obchodni-vahy-bez-tisku/aclas-ps1-15b",
    "ob2": "/vahy/obchodni-vahy-bez-tisku/cas-pr2",
    "ob3": "/vahy/obchodni-vahy-bez-tisku/tsqtp-_-tsqsp",
    "ob4": "/vahy/obchodni-vahy-bez-tisku/cas-er-plus",
    
    # Obchodni s tiskem
    "os2": "/vahy/obchodni-vahy-s-tiskem/sm-500",
    "os3": "/vahy/obchodni-vahy-s-tiskem/digi-sm5100",
    
    # Kuchyne
    "k1": "/vahy/kuchyne-a-sklady/tst28",
    "k2": "/vahy/kuchyne-a-sklady/ts-sw",
    "k3": "/vahy/kuchyne-a-sklady/tss29b",
    
    # Mustkove
    "m2": "/vahy/kuchyne-a-sklady/fox---i",
    "m3": "/vahy/kuchyne-a-sklady/fox---ii",
    "m4": "/vahy/kuchyne-a-sklady/cas-db2",
    
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
    "pk3": "/eet---registracni-pokladny/snimace-caroveho-kodu",
    "pk4": "/eet---registracni-pokladny/termokotucky-a-termoetikety",
}

def extract_specs_from_html(html):
    """Extract product specs from HTML using BeautifulSoup."""
    soup = BeautifulSoup(html, 'html.parser')
    specs = []
    descriptions = []
    
    # Find all tables with specs
    tables = soup.find_all('table')
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all(['td', 'th'])
            if len(cells) >= 2:
                key = cells[0].get_text(strip=True)
                val = cells[1].get_text(strip=True)
                if key and val and len(key) < 100 and len(val) < 200:
                    if any(c.isalpha() for c in key):
                        # Clean up the spec
                        spec = f"{key}: {val}"
                        if spec not in specs:
                            specs.append(spec)
    
    # Find product description paragraphs
    # Look for content area
    content_divs = soup.find_all(['div', 'p', 'span'])
    skip_words = ['košík', 'kontakt', 'obchodní podmínky', 'copyright', 
                  'registračn', 'EET', 'Facebook', 'vytiskni', 'zpět', 
                  'Úvod', 'Objednávkový formulář', 'Při koupi vah', 'TOPlist',
                  'Nízkou cenu', 'Kvalitní servis', 'Solidního prodejce']
    
    for div in content_divs:
        text = div.get_text(strip=True)
        if len(text) > 20 and len(text) < 500:
            if not any(sw.lower() in text.lower() for sw in skip_words):
                # Check if it's not a navigation or menu item
                if text not in descriptions and not text.startswith('http'):
                    descriptions.append(text)
    
    # Find bold text that might be product features
    bold_items = soup.find_all(['b', 'strong'])
    for item in bold_items:
        text = item.get_text(strip=True)
        parent_text = item.parent.get_text(strip=True) if item.parent else ""
        if len(text) > 5 and len(text) < 100:
            if not any(sw.lower() in text.lower() for sw in skip_words):
                if text not in descriptions:
                    descriptions.append(text)
    
    # Find list items
    list_items = soup.find_all('li')
    for li in list_items:
        text = li.get_text(strip=True)
        if len(text) > 10 and len(text) < 200:
            if not any(sw.lower() in text.lower() for sw in skip_words):
                if text not in descriptions and text not in specs:
                    descriptions.append(text)
    
    return {
        "specs": specs[:15],
        "descriptions": descriptions[:8]
    }

def scrape_category_page(url_path):
    """Scrape a category page to get product info from the listing."""
    full_url = BASE + url_path
    try:
        resp = requests.get(full_url, timeout=15, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Get all table cells which contain product info
            cells = soup.find_all('td')
            specs = []
            
            for cell in cells:
                text = cell.get_text(strip=True)
                # Look for price and feature patterns
                if 'Kč' in text or 'kg' in text.lower() or 'mm' in text.lower():
                    if len(text) > 5 and len(text) < 200:
                        specs.append(text)
                # Look for feature descriptions
                elif any(word in text.lower() for word in ['váživost', 'dvourozsah', 'akumulátor', 'nerez', 'displej', 'voděodol']):
                    if len(text) > 5 and len(text) < 200:
                        specs.append(text)
            
            return specs[:10]
    except Exception as e:
        print(f"Error scraping {url_path}: {e}")
    return []

def main():
    results = {}
    
    print("Scraping missing product details...")
    print("=" * 50)
    
    for pid, url_path in MISSING_PRODUCTS.items():
        full_url = BASE + url_path
        print(f"\n[{pid}] Fetching: {url_path}")
        
        try:
            resp = requests.get(full_url, timeout=15, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            })
            
            if resp.status_code == 200:
                data = extract_specs_from_html(resp.text)
                results[pid] = {
                    "url": url_path,
                    "specs": data["specs"],
                    "descriptions": data["descriptions"]
                }
                print(f"  ✓ Found {len(data['specs'])} specs, {len(data['descriptions'])} descriptions")
            else:
                print(f"  ✗ HTTP {resp.status_code}")
                results[pid] = {"url": url_path, "specs": [], "descriptions": []}
                
        except Exception as e:
            print(f"  ✗ ERROR: {e}")
            results[pid] = {"url": url_path, "specs": [], "descriptions": []}
        
        time.sleep(0.3)
    
    # Save results
    output_path = "/app/scripts/missing_details.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print("\n" + "=" * 50)
    print(f"Saved {len(results)} product details to {output_path}")
    
    # Summary
    with_specs = sum(1 for r in results.values() if r.get("specs"))
    print(f"Products with specs: {with_specs}/{len(results)}")
    
    return results

if __name__ == "__main__":
    main()
