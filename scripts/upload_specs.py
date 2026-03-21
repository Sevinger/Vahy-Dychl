"""Upload manually extracted product specs to database."""
import asyncio
import os
import sys
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient

# Import the manual specs
sys.path.insert(0, '/app/scripts')
from manual_specs import PRODUCT_DETAILS

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "vahy_dychl")

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db["product_details"]
    
    print("Uploading product specs to database...")
    print("=" * 50)
    
    updated = 0
    inserted = 0
    
    for product_id, details in PRODUCT_DETAILS.items():
        # Check if product already exists
        existing = await collection.find_one({"product_id": product_id})
        
        doc = {
            "product_id": product_id,
            "specs": details["specs"],
            "descriptions": details["descriptions"],
            "updated_at": datetime.now(timezone.utc)
        }
        
        if existing:
            # Update existing record
            result = await collection.update_one(
                {"product_id": product_id},
                {"$set": doc}
            )
            print(f"  ✓ Updated {product_id}: {len(details['specs'])} specs, {len(details['descriptions'])} descriptions")
            updated += 1
        else:
            # Insert new record
            await collection.insert_one(doc)
            print(f"  + Inserted {product_id}: {len(details['specs'])} specs, {len(details['descriptions'])} descriptions")
            inserted += 1
    
    print("=" * 50)
    print(f"Updated: {updated}, Inserted: {inserted}")
    
    # Verify total count
    total = await collection.count_documents({})
    with_specs = await collection.count_documents({"specs.0": {"$exists": True}})
    print(f"Total products in DB: {total}")
    print(f"Products with specs: {with_specs}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
