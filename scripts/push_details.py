"""Push crawled product details to the API."""
import requests
import json

API_URL = "https://dychl-commerce-stage.preview.emergentagent.com"

def clean_texts(texts):
    """Remove navigation breadcrumbs and junk texts."""
    skip_patterns = [
        "VÁHY-DYCHL", "Laboratorní přesné", "Obchodní váhy",
        "Pokladny", "Kuchyně", "Počítací", "Jeřábové", "Můstkové",
        "Paletové", "Silniční", "Zdravotn", "Indikátor", 
        "nbsp", "registracni", "EET", "Nízkou cenu"
    ]
    cleaned = []
    seen = set()
    for t in texts:
        t = t.replace("&nbsp;", " ").replace("\xa0", " ").strip()
        t = t.strip("|").strip()
        if len(t) < 15:
            continue
        if any(p.lower() in t.lower() for p in skip_patterns):
            continue
        if t not in seen:
            cleaned.append(t)
            seen.add(t)
    return cleaned

def main():
    # Login
    resp = requests.post(f"{API_URL}/api/admin/login", json={"password": "admin123"})
    token = resp.json()["token"]

    # Load crawled data
    with open("/app/scripts/product_details.json", encoding="utf-8") as f:
        raw = json.load(f)

    products = {}
    for pid, data in raw.items():
        specs = data.get("specs", [])
        descs = clean_texts(data.get("descriptions", []))
        products[pid] = {"specs": specs, "descriptions": descs}

    # Add manual descriptions for products that had no crawlable text
    manual = {
        "pk3": {
            "specs": [],
            "descriptions": [
                "Snímače čárových kódů pro obchodní použití. Ruční i stacionární provedení. Kompatibilní se všemi typy pokladen."
            ]
        },
        "pk4": {
            "specs": [],
            "descriptions": [
                "Termokotoučky a termoetikety pro tisk účtenek a etiket. Různé rozměry dle typu pokladny nebo tiskárny."
            ]
        }
    }
    products.update(manual)

    # Upload
    resp = requests.post(
        f"{API_URL}/api/admin/products/details/bulk",
        json={"products": products},
        headers={"Authorization": f"Bearer {token}"},
        timeout=30
    )
    print(f"Response: {resp.json()}")

if __name__ == "__main__":
    main()
