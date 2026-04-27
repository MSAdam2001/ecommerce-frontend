# ShopZone — Full Stack E-Commerce Platform

A full-featured e-commerce web application built as a final year project.

## Live Demo
- Store: http://localhost:3000
- Admin: http://localhost:3000/admin/login

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- Zustand (state management)
- Stripe.js (payment UI)
- React Hot Toast (notifications)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Stripe API (payments)
- Cloudinary (image storage)

---

## Features

### Customer
- Browse and search products by category
- Product detail pages with image gallery
- Shopping cart with quantity management
- Stripe checkout with real payment processing
- Order history with live tracking status
- User registration and login

### Admin
- Dashboard with revenue, orders, products, users stats
- Manage orders and update status (processing → shipped → delivered)
- Add and delete products with image URL support
- Create and delete categories
- View and delete users

---

## Project Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
```

### 2. Backend Setup
```bash
cd ecommerce-backend
npm install
```

Create a `.env` file in the backend folder: