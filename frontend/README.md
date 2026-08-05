# 🌟 GLOWMART INDIA 🇮🇳 
**AI-Enhanced Premium Cosmetic E-Commerce Platform**

![Project](https://img.shields.io/badge/PROJECT-GLOWMART-ff69b4?style=for-the-badge) ![Stack](https://img.shields.io/badge/STACK-NEXT.JS-000000?style=for-the-badge) ![License](https://img.shields.io/badge/LICENSE-MIT-8A2BE2?style=for-the-badge) ![Frontend](https://img.shields.io/badge/FRONTEND-REACT%2019-61DAFB?style=for-the-badge) ![Database](https://img.shields.io/badge/DATABASE-MONGODB-47A248?style=for-the-badge) ![AI](https://img.shields.io/badge/AI-PYTHON-3776AB?style=for-the-badge)

Glowmart India is an advanced, full-stack web application developed to bridge the gap between AI technology and cosmetic shopping. By democratizing access to smart skincare recommendations, the platform aims to empower customers, enhance the shopping experience, and promote personalized beauty care.

---

## 📖 About The Project

### The Problem
With the beauty market expanding rapidly, customers often struggle to find products suitable for their specific skin types and preferences. There has traditionally been no centralized, trustworthy platform that not only sells cosmetics but also acts as a smart, personalized dermatologist for the user. 

### The Solution
**Glowmart India** solves this problem by combining a beautifully designed **Modern Next.js Frontend** with an intelligent **Machine Learning (AI)** engine to deliver personalized product recommendations. It provides users with a seamless, smart, and premium shopping experience—just like having a personal dermatologist at your fingertips!

---

## ✨ Core Features

### 🛍️ E-Commerce & User Experience
- **Modern Next.js App Router UI:** Fast, Server-Side Rendered (SSR) pages optimized for performance and SEO.
- **Advanced Navigation & Filtering:** Search products dynamically in the `/stores` and `/collection` pages.
- **Secure Authentication:** Multi-method login via NextAuth (Email/Password, Google).
- **Seamless Cart & Checkout:** Intuitive cart management (`/cart`), wishlist management (`/wishlist`), and checkout process.
- **Real-Time Order Tracking:** Users can track the status of their orders directly via `/track`.

### 👑 Advanced Admin Dashboard (`/app/admin`)
- **Comprehensive Control Panel:** Admins can manage the entire catalog, view sales analytics, and track users.
- **Product Management:** Complete CRUD operations (Add, Edit, View, Delete products).
- **Order Management:** Adjust order statuses and monitor business operations seamlessly.

### 🤖 AI-Powered Capabilities (`/ai-services`)
- **Smart Recommendations:** Machine learning models engineered to suggest cosmetic products based on user skin profiles and historical preferences.

---

## 🛠️ Technology Stack

**Frontend & Server-Side:**
- [Next.js (App Router)](https://nextjs.org/) - React framework for SSR and API routes.
- [React 19](https://react.dev/) - Modern component-based UI engineering.
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed language for error-free development.
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling for a completely responsive and premium UI.

**Backend & APIs:**
- **Next.js API Routes (`/app/api/...`)** - Serverless functions handling backend logic.
- **Prisma ORM & Mongoose (`/lib/models`)** - Robust database object modeling and schema management.
- **MongoDB** - Database for fast, flexible product and user data storage.

**AI & Machine Learning:**
- **Python** - For creating, training, and running cosmetic recommendation systems.

---

## 📂 Comprehensive Directory Structure

Here is a deep dive into how the Glowmart India project is structurally organized:

```text
GLOWMART-INDIA/
│
├── app/                           # 🚀 Next.js App Router (Main App Core)
│   ├── admin/                     # Admin Dashboard interface
│   ├── api/                       # ⚙️ Next.js Serverless API routes
│   ├── auth/                      # Login & Registration Pages
│   ├── cart/                      # Shopping Cart Page
│   ├── checkout/                  # Secure Checkout UI
│   ├── product/                   # Single Product Details Dynamic Page
│   ├── stores/                    # Main Product Listing & Browsing
│   ├── track/                     # Live Order Tracking UI
│   ├── wishlist/                  # User Wishlist Management
│   └── layout.tsx & page.tsx      # Global App Layouts and Root Landing Page
│
├── components/                    # 🧩 Reusable React UI Components
│   ├── Header.tsx / Footer.tsx    # Site Navigation Components
│   ├── ProductCard.tsx            # Standard UI Card for Cosmetics
│   └── ProductCarousel.tsx        # Sliders for Featured Products
│
├── lib/                           # 🔧 Utilities, Database, & Context
│   ├── models/                    # Mongoose Data Models (User, Product, Order)
│   ├── mongodb.ts                 # MongoDB Connection Wrapper
│   └── prisma.ts                  # Prisma Client Initialization
│
├── prisma/                        # 🗄️ Prisma Data Layer
│   └── schema.prisma              # Database Schemas and Relationships
│
├── ai-services/                   # 🧠 Python AI & Machine Learning Services
│
└── package.json                   # Project Metadata & NPM Dependencies
```

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local URI or MongoDB Atlas)
- Python (If running AI services locally)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/DineshYadav06/Cosmetic-Product-Selling-Platform.git

# Navigate into the project directory
cd GLOWMART

# Install NPM packages
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following keys based on your setup:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=your_mongodb_connection_string
```

### 4. Database Setup & Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Push Database schema changes (if applicable)
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in the browser.

---

## 🔮 Future Goals & Roadmap

We are constantly working to improve Glowmart India to make it the most advanced AI cosmetics platform. Here is what we plan for the future:

### 1. 🧴 AI Skin & Face Analysis (Computer Vision)
- **Live Camera Integration:** Users will be able to scan their face using their mobile or web camera. The AI (using deep learning/OpenCV) will detect skin issues like acne, dark circles, or dryness and instantly recommend perfect treatment products.
- **Virtual Try-On (AR):** Let users virtually test out cosmetics before buying.

### 2. 💬 AI Beauty Chatbot / Virtual Assistant
- Integrate a smart NLP chatbot that acts as a **24/7 Virtual Dermatologist**. 

### 3. 💳 Advanced Payment & Logistics
- Full integration with **Razorpay/Stripe** for seamless UPI, Card, and Wallet payments.
- Real-time GPS delivery tracking integration via third-party logistics APIs.

### 4. 📱 Mobile Application (React Native)
- Convert Glowmart India into a fully functional native mobile app for Android and iOS using **React Native**.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  <b>Developed by <a href="#">Dinesh Kumar Yadav</a></b><br>
  <i>Built with ❤️ for Beauty & Tech Enthusiasts</i>
</p>
