from fastapi import FastAPI, APIRouter, BackgroundTasks, UploadFile, File, Header, HTTPException, Depends
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import requests as http_requests
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ── Object Storage ───────────────────────────────────────────
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "vahy-dychl"
storage_key = None

def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    resp = http_requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = http_requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = http_requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key}, timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ── Admin Auth ───────────────────────────────────────────────
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD")
JWT_SECRET = os.environ.get("JWT_SECRET")

class AdminLogin(BaseModel):
    password: str

class TokenResponse(BaseModel):
    token: str
    message: str

def verify_admin_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Neautorizováno")
    token = authorization.split(" ")[1]
    try:
        jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token vypršel")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Neplatný token")
    return True

# Models
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = ""
    company: Optional[str] = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    company: Optional[str] = ""
    message: str

class ContactResponse(BaseModel):
    status: str
    message: str

# SendGrid email helper (optional - only works if SENDGRID_API_KEY is set)
def send_contact_email(name: str, email: str, phone: str, company: str, message: str):
    sendgrid_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('SENDER_EMAIL')
    recipient_email = os.environ.get('CONTACT_RECIPIENT_EMAIL', 'm.dytrich@seznam.cz')
    
    if not sendgrid_key or not sender_email:
        logging.info("SendGrid not configured, skipping email send")
        return
    
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        
        html_content = f"""
        <h2>Nová zpráva z kontaktního formuláře</h2>
        <p><strong>Jméno:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Telefon:</strong> {phone or 'Neuvedeno'}</p>
        <p><strong>Firma:</strong> {company or 'Neuvedeno'}</p>
        <hr/>
        <p><strong>Zpráva:</strong></p>
        <p>{message}</p>
        """
        
        msg = Mail(
            from_email=sender_email,
            to_emails=recipient_email,
            subject=f"Nová poptávka od {name} - VÁHY DYCHL",
            html_content=html_content
        )
        
        sg = SendGridAPIClient(sendgrid_key)
        sg.send(msg)
        logging.info(f"Contact email sent for {name}")
    except Exception as e:
        logging.error(f"Failed to send email: {e}")

# Routes
@api_router.get("/")
async def root():
    return {"message": "VÁHY DYCHL API"}

@api_router.post("/contact", response_model=ContactResponse)
async def create_contact(input_data: ContactMessageCreate, background_tasks: BackgroundTasks):
    contact = ContactMessage(**input_data.model_dump())
    doc = contact.model_dump()
    await db.contact_messages.insert_one(doc)
    
    # Send email in background (only if SendGrid is configured)
    background_tasks.add_task(
        send_contact_email,
        input_data.name,
        input_data.email,
        input_data.phone or "",
        input_data.company or "",
        input_data.message
    )
    
    return ContactResponse(
        status="success",
        message="Vaše zpráva byla úspěšně odeslána. Budeme vás kontaktovat co nejdříve."
    )

@api_router.get("/contacts", response_model=List[ContactMessage])
async def get_contacts():
    contacts = await db.contact_messages.find({}, {"_id": 0}).to_list(1000)
    return contacts

# ── Admin Auth Routes ────────────────────────────────────────
@api_router.post("/admin/login", response_model=TokenResponse)
async def admin_login(data: AdminLogin):
    if data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Nesprávné heslo")
    token = jwt.encode(
        {"role": "admin", "exp": datetime.now(timezone.utc) + timedelta(hours=24)},
        JWT_SECRET,
        algorithm="HS256"
    )
    return TokenResponse(token=token, message="Přihlášení úspěšné")

# ── Product Image Routes ────────────────────────────────────
@api_router.post("/admin/products/{product_id}/image")
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    _auth: bool = Depends(verify_admin_token)
):
    allowed = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Povolené formáty: JPG, PNG, WebP, GIF")
    if file.size and file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Maximální velikost souboru je 5 MB")

    data = await file.read()
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    storage_path = f"{APP_NAME}/products/{product_id}/{uuid.uuid4()}.{ext}"

    result = put_object(storage_path, data, file.content_type)

    # Soft-delete previous images for this product
    await db.product_images.update_many(
        {"product_id": product_id, "is_deleted": False},
        {"$set": {"is_deleted": True}}
    )

    # Store new reference
    doc = {
        "id": str(uuid.uuid4()),
        "product_id": product_id,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result.get("size", len(data)),
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.product_images.insert_one(doc)

    return {"status": "success", "product_id": product_id, "path": result["path"]}

@api_router.get("/products/{product_id}/image")
async def get_product_image(product_id: str):
    record = await db.product_images.find_one(
        {"product_id": product_id, "is_deleted": False},
        {"_id": 0}
    )
    if not record:
        raise HTTPException(status_code=404, detail="Obrázek nenalezen")
    content, content_type = get_object(record["storage_path"])
    return Response(content=content, media_type=record.get("content_type", content_type))

@api_router.delete("/admin/products/{product_id}/image")
async def delete_product_image(
    product_id: str,
    _auth: bool = Depends(verify_admin_token)
):
    result = await db.product_images.update_many(
        {"product_id": product_id, "is_deleted": False},
        {"$set": {"is_deleted": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Žádný obrázek k odstranění")
    return {"status": "success", "message": "Obrázek odstraněn"}

@api_router.get("/products/images/all")
async def get_all_product_images():
    images = await db.product_images.find(
        {"is_deleted": False},
        {"_id": 0, "product_id": 1}
    ).to_list(1000)
    return {"product_ids": [img["product_id"] for img in images]}

# ── Product Details Routes ───────────────────────────────────
@api_router.post("/admin/products/details/bulk")
async def bulk_upsert_product_details(
    data: dict,
    _auth: bool = Depends(verify_admin_token)
):
    """Bulk upsert product details. Expects {products: {id: {specs: [...], descriptions: [...]}}}"""
    products = data.get("products", {})
    count = 0
    for pid, details in products.items():
        await db.product_details.update_one(
            {"product_id": pid},
            {"$set": {
                "product_id": pid,
                "specs": details.get("specs", []),
                "descriptions": details.get("descriptions", []),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }},
            upsert=True
        )
        count += 1
    return {"status": "success", "count": count}

@api_router.get("/products/{product_id}/details")
async def get_product_details(product_id: str):
    record = await db.product_details.find_one(
        {"product_id": product_id},
        {"_id": 0}
    )
    if not record:
        return {"product_id": product_id, "specs": [], "descriptions": []}
    return record

@api_router.get("/products/details/all")
async def get_all_product_details():
    records = await db.product_details.find({}, {"_id": 0}).to_list(1000)
    return {r["product_id"]: {"specs": r.get("specs", []), "descriptions": r.get("descriptions", [])} for r in records}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    try:
        init_storage()
        logger.info("Object storage initialized successfully")
    except Exception as e:
        logger.error(f"Object storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
