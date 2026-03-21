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

### 1. Landing Page
- Hero section with company branding
- Product Categories grid (interactive)
- Bestsellers showcase
- Services section
- Contact form (saves to database)

### 2. Product Catalog (`/app/frontend/src/components/ProductCatalog.jsx`)
- Sidebar navigation with 12 categories
- Product grid with cards
- Search functionality
- Mobile responsive chip navigation
- 49 products with images, prices, badges

### 3. Product Detail Modal (`/app/frontend/src/components/ProductDetailModal.jsx`)
- Opens on product card click
- Displays product image, name, specs, price
- Fetches technical parameters from API
- CTA button scrolls to contact section
- Close button functionality

### 4. Admin Panel (`/admin`)
- Password protected (admin123)
- Product image upload functionality
- Uses Emergent Object Storage

### 5. Data Integration
- Scraped product images and descriptions from old website
- Stored in MongoDB database
- Served via REST API

## Tech Stack
- **Frontend:** React, Tailwind CSS, Shadcn/UI
- **Backend:** FastAPI, Motor (MongoDB async)
- **Database:** MongoDB
- **Storage:** Emergent Object Storage

## API Endpoints
- `GET /api/products/{product_id}/details` - Product details
- `GET /api/products/{product_id}/image` - Product image
- `GET /api/products/images/all` - List of product IDs with images
- `POST /api/admin/login` - Admin authentication
- `POST /api/images/upload` - Image upload
- `POST /api/contact` - Contact form submission

## Completed (December 2025)
- [x] Landing page redesign
- [x] Dynamic product catalog
- [x] Interactive category grid
- [x] Admin photo upload system
- [x] Data scraping from old website
- [x] Product detail modal integration (Dec 21, 2025)

## Pending / Backlog
- [ ] **P1:** SendGrid email integration (requires user API key)
- [ ] **P2:** Populate other static content (Services, About Us pages)
- [ ] **P3:** Product catalog refactoring (extract CATALOG array to separate file)

## 3rd Party Integrations
- **Emergent Object Storage** - Active (for product images)
- **SendGrid** - Inactive (pending API key from user)

## Credentials
- Admin Panel URL: `/admin`
- Admin Password: `admin123`
