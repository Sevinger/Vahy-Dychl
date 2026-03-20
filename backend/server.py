from fastapi import FastAPI, APIRouter, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
