# VÁHY DYCHL - Product Requirements Document

## Original Problem Statement
Complete redesign of the B2B e-commerce and corporate website for "VÁHY DYCHL" (industrial scales company). The project includes:
1. Modern, industrial-style landing page
2. Dynamic, filterable product catalog with 49 products across 12 categories
3. Secure admin panel for product image uploads
4. Data scraping from old website (www.vahy-dychl.cz)
5. Product detail modal with full specifications

## User Language
Czech (Čeština)

## Core Features

### 1. Landing Page (/)
- Hero section with company branding
- **6 Category Cards** - Simple, icon-based cards linking to catalog
- Services section
- Contact form (saves to database)
- **Removed:** Bestsellers section ("Nejžádanější řešení")

### 2. Product Catalog (/katalog)
- **Now on separate page** - `/katalog`
- Sidebar navigation with 12 categories
- Product grid with cards
- Search functionality
- Mobile responsive chip navigation
- URL parameters support (`/katalog?parent=vahy&sub=laboratorni`)
- **49 products** with images, prices, badges, and **full specs**

### 3. Product Detail Modal
- Opens on product card click
- Displays product image, name, specs, price
- **Technical parameters table** from database
- CTA button scrolls to contact section
- Close button functionality

### 4. Admin Panel (`/admin`)
- Password protected (admin123)
- Product image upload functionality
- Uses Emergent Object Storage

### 5. Data Integration
- Scraped product images and detailed descriptions from old website
- **All 49 products have specs** - manually extracted and uploaded
- Stored in MongoDB database

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI, react-router-dom
- **Backend:** FastAPI, Motor (MongoDB async)
- **Database:** MongoDB
- **Storage:** Emergent Object Storage

## API Endpoints
- `GET /api/products/{product_id}/details` - Product details
- `GET /api/products/{product_id}/image` - Product image
- `GET /api/products/images/all` - List of product IDs with images
- `GET /api/products/details/all` - All product details
- `POST /api/admin/login` - Admin authentication
- `POST /api/images/upload` - Image upload
- `POST /api/contact` - Contact form submission

## Completed (December 2025)
- [x] Landing page redesign
- [x] Dynamic product catalog
- [x] Interactive category grid → **Simplified to 6 cards** (Dec 21)
- [x] Admin photo upload system
- [x] Data scraping from old website
- [x] Product detail modal integration
- [x] **Catalog moved to /katalog page** (Dec 21)
- [x] **Removed Bestsellers section** (Dec 21)
- [x] **All 49 products have specs** (Dec 21)

## Pending / Backlog
- [ ] **P1:** SendGrid email integration (requires user API key)
- [ ] **P2:** Populate other static content (Services, About Us pages)

## 3rd Party Integrations
- **Emergent Object Storage** - Active (for product images)
- **SendGrid** - Inactive (pending API key from user)

## Credentials
- Admin Panel URL: `/admin`
- Admin Password: `admin123`

## Routes
- `/` - Homepage with hero, 6 category cards, services, contact
- `/katalog` - Full product catalog with all categories
- `/katalog?parent=X&sub=Y` - Catalog with selected category
- `/admin` - Admin panel for image uploads
