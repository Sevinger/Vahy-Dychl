"""Re-upload product images with CORRECT URLs from vahy-dychl.cz."""
import requests, os, time

API_URL = "https://dychl-commerce-stage.preview.emergentagent.com"

# Only products that had WRONG image URLs in the first upload
FIXES = {
    # Lab
    "l1": "https://new.vahy-dychl.cz/KERNAET/image001.jpg",
    "l2": "https://new.vahy-dychl.cz/smabsabj.JPG",
    "l3": "https://new.vahy-dychl.cz/ALD114CM/1.jpg",
    "l4": "https://new.vahy-dychl.cz/sm440.JPG",
    # Obchodni bez tisku
    "ob2": "https://new.vahy-dychl.cz/CASPR2D.jpg",
    "ob3": "https://new.vahy-dychl.cz/smtsqtp.JPG",
    "ob4": "https://new.vahy-dychl.cz/smcaserplus1.JPG",
    # Obchodni s tiskem
    "os1": "https://new.vahy-dychl.cz/smcas50001.JPG",
    "os2": "https://new.vahy-dychl.cz/smsm5001.JPG",
    "os3": "https://new.vahy-dychl.cz/5100/image001.jpg",
    # Kuchyne
    "k1": "https://new.vahy-dychl.cz/smtst28.jpg",
    "k2": "https://new.vahy-dychl.cz/smtssw1.png",
    "k3": "https://new.vahy-dychl.cz/smtss29b.PNG",
    "k5": "https://new.vahy-dychl.cz/smsw.JPG",
    # Pocitaci
    "pc1": "https://new.vahy-dychl.cz/smNBH.PNG",
    "pc2": "https://new.vahy-dychl.cz/smNHBM1.PNG",
    "pc3": "https://new.vahy-dychl.cz/qhw1.jpg",
    "pc5": "https://new.vahy-dychl.cz/smtsjw.JPG",
    # Jerabove
    "j2": "https://new.vahy-dychl.cz/J1RWS/1.jpg",
    "j3": "https://new.vahy-dychl.cz/J1RWP/1.jpg",
}

def main():
    resp = requests.post(f"{API_URL}/api/admin/login", json={"password": "admin123"})
    token = resp.json()["token"]
    print(f"Logged in. Fixing {len(FIXES)} images...\n")
    
    ok, fail = 0, 0
    for pid, url in FIXES.items():
        try:
            r = requests.get(url, timeout=15, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://www.vahy-dychl.cz/"})
            if r.status_code != 200:
                print(f"  [{pid}] SKIP: HTTP {r.status_code} for {url}")
                fail += 1
                continue
            ct = r.headers.get("Content-Type", "image/jpeg")
            if "image" not in ct:
                ext_map = {".png": "image/png", ".gif": "image/gif", ".webp": "image/webp"}
                ct = next((v for k, v in ext_map.items() if url.lower().endswith(k)), "image/jpeg")
            ext = "png" if "png" in ct else "gif" if "gif" in ct else "jpg"
            tmp = f"/tmp/fix_{pid}.{ext}"
            with open(tmp, "wb") as f: f.write(r.content)
            with open(tmp, "rb") as f:
                up = requests.post(f"{API_URL}/api/admin/products/{pid}/image",
                    headers={"Authorization": f"Bearer {token}"},
                    files={"file": (f"product_{pid}.{ext}", f, ct)}, timeout=30)
            os.remove(tmp)
            if up.status_code == 200:
                print(f"  [{pid}] OK ({len(r.content)} bytes)")
                ok += 1
            else:
                print(f"  [{pid}] UPLOAD FAIL: {up.status_code}")
                fail += 1
            time.sleep(0.2)
        except Exception as e:
            print(f"  [{pid}] ERROR: {e}")
            fail += 1
    print(f"\nDone: {ok} fixed, {fail} failed")

if __name__ == "__main__":
    main()
