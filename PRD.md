# Product Requirements Document (PRD)
## Project: Crave Perfume Brand Website

**Version:** 1.0
**Status:** Ready for implementation (some design details still open)

---

## 1. Overview

### 1.1 Product Description
A website for the perfume brand "Crave" that functions as a professional brand showcase, paired with an internal dashboard for managing products and orders. Design reference: nspiredbeauty.com

### 1.2 Problem Statement
The brand already has finished, ready-to-sell products (perfumes) but lacks a professional digital storefront to showcase them and collect customer orders in an organized way, instead of relying entirely on social media.

### 1.3 Out of Scope
- No in-site checkout / online payment gateway
- No international shipping for now (Egypt only)
- No mobile app

---

## 2. User Personas

| User | Description | Permissions |
|---|---|---|
| **Visitor/Customer** | Browses the site from Egypt, in Arabic or English | Views products, submits an order via the form |
| **Admin (Ismail)** | Brand owner | Full access to the dashboard |
| **Shipping/Support Staff** | Manages order status | Can view orders and update their status only |

---

## 3. Frontend Requirements

### 3.1 Language & Localization
- Bilingual: Arabic / English
- Default language + language switcher
- Full RTL support for Arabic

### 3.2 Visual Identity
- **Logo:** Fixed, unchanged — bold geometric wordmark, Burgundy-on-white/cream version
- **Colors:**
  - Primary: white/cream (backgrounds)
  - Accent: Burgundy (main text, buttons, details) — matching the logo color
- **Vibe:** calm, classic luxury

### 3.3 Site Pages
1. **Home** — logo, brief brand intro, featured products
2. **Products** — listing of all products (under 10)
3. **Individual Product Page** (each perfume has its own page)
4. **About**
5. **Brand Story / Philosophy**
6. **Contact**

### 3.4 Individual Product Page Content
| Element | Details |
|---|---|
| Product name | Text |
| Description | Short text |
| Story/Inspiration | Custom text per perfume |
| Price | Displayed directly on the page |
| Availability status | General label (In Stock / Out of Stock) — no exact stock count shown; controlled by admin |
| Product images | Actual product photos (provided by the client) |
| Order form | Embedded in the page (details in 3.5) |

### 3.5 Order Inquiry Form
**Fields:**
- Name
- Phone number
- Address
- Preferred payment method: Cash on delivery / Vodafone Cash / InstaPay
**Required notice shown on the form:** clarifies that shipping fees will be confirmed with the customer before the order ships.
**Behavior on submit:** order is saved to the database and appears in the dashboard, plus an instant WhatsApp notification is sent to the admin.

---

## 4. Dashboard Requirements

### 4.1 Auth & Roles
| Role | Permissions |
|---|---|
| Admin | Add/edit/delete products, view all orders, manage internal inventory, view customer data, manage users |
| Shipping/Support | View orders only + update order status (Shipped / Cancelled) |

### 4.2 Product Management
- Add/edit/delete a product with no code required
- Each product includes: name, description, story, price, images, availability status (visible/hidden to customer), internal stock count (actual number, not shown to customer)

### 4.3 Order Management
- View all incoming orders from the form
- Order details: customer info, requested product, payment method, status
- Update order status: Processing / Shipped / Cancelled

### 4.4 Customer Data
- Store customer data (from orders) in the database for later analysis (e.g. repeat orders, most common regions)

### 4.5 Notifications
- Instant in-dashboard notification when a new order arrives
- Instant WhatsApp message to the admin when a new order arrives

---

## 5. Technical Requirements

| Component | Proposed Technology |
|---|---|
| Frontend Hosting | Vercel |
| Backend + Database Hosting | Railway |
| Database | PostgreSQL |
| Auth | Role-based (Admin / Shipping-Support) |
| WhatsApp Notifications | Integration with WhatsApp Business API or a middleware service (e.g. Twilio/UltraMsg) |
| Infrastructure | No Kubernetes/OpenShift — unnecessary complexity for the current project size; can be upgraded later if needed |

---

## 6. Acceptance Criteria

- [ ] The site works fully in both Arabic and English with correct RTL support
- [ ] Every product has its own dedicated page displaying all required elements (see 3.4)
- [ ] The order form successfully saves data and triggers both a WhatsApp notification and a dashboard notification
- [ ] The admin can add/edit a product from the dashboard without technical intervention
- [ ] Shipping staff can view orders and update their status only, with no access to product management
- [ ] Product availability status is admin-controlled and separate from the actual internal stock count
- [ ] The visual identity (logo + colors) is consistent across all site pages

---

## 7. Open Items

1. Final domain name for Crave
2. Typography selection for the rest of the site content
3. Additional design details (button styles, icons, precise visual layout of the product page)
4. Upload of actual product photos for the final design
5. Selection of the specific WhatsApp integration service for notifications
