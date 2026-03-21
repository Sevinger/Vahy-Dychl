"""Download images from vahy-dychl.cz and upload to Object Storage."""
import requests
import os
import sys
import json
import time

API_URL = os.environ.get("API_URL", "https://dychl-commerce-stage.preview.emergentagent.com")
ADMIN_PASSWORD = "admin123"

# All product image mappings from the original site
PRODUCT_IMAGES = {
    # Lab
    "l1": "https://new.vahy-dychl.cz/AET/image001.jpg",
    "l2": "https://new.vahy-dychl.cz/ABS/1.jpg",
    "l3": "https://new.vahy-dychl.cz/ALD/1.jpg",
    "l4": "https://new.vahy-dychl.cz/CASXE/1.jpg",
    # Obchodni bez tisku
    "ob1": "https://new.vahy-dychl.cz/ACLAS15B/1.jpg",
    "ob2": "https://new.vahy-dychl.cz/CASPR2/1.jpg",
    "ob3": "https://new.vahy-dychl.cz/TSQHW/1.jpg",
    "ob4": "https://new.vahy-dychl.cz/CAS-ER/1.jpg",
    # Obchodni s tiskem
    "os1": "https://new.vahy-dychl.cz/CASCL5000/1.jpg",
    "os2": "https://new.vahy-dychl.cz/SM500/1.jpg",
    "os3": "https://new.vahy-dychl.cz/SM5100/1.jpg",
    # Kuchyne a sklady
    "k1": "https://new.vahy-dychl.cz/TST28/image002.jpg",
    "k2": "https://new.vahy-dychl.cz/TS-SW/1.jpg",
    "k3": "https://new.vahy-dychl.cz/TSS29B/1.jpg",
    "k4": "https://new.vahy-dychl.cz/CAS-ED/1.jpg",
    "k5": "https://new.vahy-dychl.cz/CAS-SW/1.jpg",
    # Pocitaci
    "pc1": "https://new.vahy-dychl.cz/NHB/1.jpg",
    "pc2": "https://new.vahy-dychl.cz/NHBM/1.jpg",
    "pc3": "https://new.vahy-dychl.cz/QHW/1.jpg",
    "pc4": "https://new.vahy-dychl.cz/CAS-SW2/1.jpg",
    "pc5": "https://new.vahy-dychl.cz/TSJW/1.jpg",
    # Jerabove
    "j1": "https://new.vahy-dychl.cz/JEV/1.jpg",
    "j2": "https://new.vahy-dychl.cz/JRWS/1.jpg",
    "j3": "https://new.vahy-dychl.cz/JRWP/1.jpg",
    # Mustkove
    "m1": "https://new.vahy-dychl.cz/4TxxxxDFWL/image001.jpg",
    "m2": "https://new.vahy-dychl.cz/FOX1/1.jpg",
    "m3": "https://new.vahy-dychl.cz/FOX2/1.jpg",
    "m4": "https://new.vahy-dychl.cz/casdb2a.jpg",
    # Paletove
    "p1": "https://new.vahy-dychl.cz/paletak.jpg",
    "p2": "https://new.vahy-dychl.cz/P4TLDFWL/1.jpg",
    "p3": "https://new.vahy-dychl.cz/P4TDFWL/image002.jpg",
    "p4": "https://new.vahy-dychl.cz/4TLDFWL/image001.jpg",
    # Silnicni
    "s1": "https://new.vahy-dychl.cz/najezd1.JPG",
    "s2": "https://new.vahy-dychl.cz/profi/001.jpg",
    "s3": "https://new.vahy-dychl.cz/najezd3.JPG",
    # Zdravotnicke
    "z1": "https://new.vahy-dychl.cz/kojenecka/image001.jpg",
    "z2": "https://new.vahy-dychl.cz/osobni/image001.jpg",
    "z3": "https://new.vahy-dychl.cz/kreslo/image001.jpg",
    "z4": "https://new.vahy-dychl.cz/najezd/image002.jpg",
    "z5": "https://new.vahy-dychl.cz/luzko/image001.jpg",
    # Indikatory
    "i1": "https://new.vahy-dychl.cz/smindikator3.JPG",
    "i2": "https://new.vahy-dychl.cz/smindikator4.JPG",
    "i3": "https://new.vahy-dychl.cz/smindikator6.JPG",
    "i4": "https://new.vahy-dychl.cz/DFWL/image001.jpg",
    "i5": "https://new.vahy-dychl.cz/smindikator7.JPG",
    # Pokladny
    "pk1": "https://new.vahy-dychl.cz/CHD30502.gif",
    "pk2": "https://new.vahy-dychl.cz/CHD38501.png",
}

def main():
    # Login
    print("Logging in...")
    resp = requests.post(f"{API_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    resp.raise_for_status()
    token = resp.json()["token"]
    print(f"Got token: {token[:30]}...")

    success = 0
    failed = 0
    skipped = 0

    for product_id, image_url in PRODUCT_IMAGES.items():
        print(f"\n[{product_id}] Downloading {image_url}...")
        try:
            # Download image
            img_resp = requests.get(image_url, timeout=15, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://www.vahy-dychl.cz/"
            })
            if img_resp.status_code != 200:
                print(f"  SKIP: HTTP {img_resp.status_code}")
                skipped += 1
                continue

            content_type = img_resp.headers.get("Content-Type", "image/jpeg")
            if "image" not in content_type:
                # Guess from URL
                url_lower = image_url.lower()
                if url_lower.endswith(".png"):
                    content_type = "image/png"
                elif url_lower.endswith(".gif"):
                    content_type = "image/gif"
                elif url_lower.endswith(".webp"):
                    content_type = "image/webp"
                else:
                    content_type = "image/jpeg"

            img_data = img_resp.content
            print(f"  Downloaded {len(img_data)} bytes ({content_type})")

            # Determine file extension
            ext = "jpg"
            if "png" in content_type: ext = "png"
            elif "gif" in content_type: ext = "gif"
            elif "webp" in content_type: ext = "webp"

            # Save to temp file
            tmp_path = f"/tmp/product_{product_id}.{ext}"
            with open(tmp_path, "wb") as f:
                f.write(img_data)

            # Upload to API
            with open(tmp_path, "rb") as f:
                upload_resp = requests.post(
                    f"{API_URL}/api/admin/products/{product_id}/image",
                    headers={"Authorization": f"Bearer {token}"},
                    files={"file": (f"product_{product_id}.{ext}", f, content_type)},
                    timeout=30
                )
            if upload_resp.status_code == 200:
                print(f"  UPLOADED: {upload_resp.json()}")
                success += 1
            else:
                print(f"  UPLOAD FAIL: {upload_resp.status_code} {upload_resp.text}")
                failed += 1

            # Clean up
            os.remove(tmp_path)
            time.sleep(0.3)

        except Exception as e:
            print(f"  ERROR: {e}")
            failed += 1

    print(f"\n\nDONE: {success} uploaded, {failed} failed, {skipped} skipped out of {len(PRODUCT_IMAGES)}")

if __name__ == "__main__":
    main()
