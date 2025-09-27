# 🛒 Project Nexus — Dynamic E-Commerce Platform

## 📖 Overview

**Project Nexus** is a full-stack, modern e-commerce web application designed as a capstone to demonstrate advanced software engineering skills. It features a dynamic product catalog, secure authentication, responsive UI/UX, and robust backend API, following industry best practices.

---

## 🏗️ Monorepo Structure

```
nexus-3/
│
├── Back-end/      # Django REST API (products, auth, orders)
│   ├── config/    # Django project settings
│   └── shop/      # App: models, views, serializers, management commands
│
└── Front-end/     # React + Vite + TypeScript client
    ├── src/       # Main frontend source code
    └── before-revamp/ # Previous version (archived)
```

---

## ⚙️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Redux Toolkit, TailwindCSS
- **Backend:** Django, Django REST Framework, SQLite
- **Auth:** JWT (access & refresh tokens)
- **State:** Redux Toolkit
- **Styling:** TailwindCSS
- **API:** RESTful endpoints

---

## ✨ Features

### Frontend

- Authentication (Login/Register/Logout with JWT)
- Dynamic product catalog: categories, search, sort, filter
- Cart management with live updates & animated drawer
- Responsive, modern UI/UX (desktop & mobile)
- Pagination & infinite scroll
- Loading spinners, smooth transitions, and hover effects

### Backend

- RESTful API for products, users, and cart
- Secure JWT authentication
- Seed script for demo products (`python manage.py seed_products`)
- Modular Django app structure

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/YOUR-USERNAME/nexus-3.git
cd nexus-3
```

### 2️⃣ Backend Setup

```bash
cd Back-end
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products  # (Optional) Seed demo products
python manage.py runserver
```

### 3️⃣ Frontend Setup

```bash
cd ../Front-end
npm install
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)

---

## 🗂️ Key Directories

- `Back-end/shop/models.py` — Product & user models
- `Back-end/shop/serializers.py` — DRF serializers
- `Back-end/shop/views.py` — API endpoints
- `Front-end/src/components/` — UI components
- `Front-end/src/store/` — Redux slices (auth, cart, products, UI)
- `Front-end/src/screens/` — Main app screens (Login, Register, Checkout, etc.)

---

## 🧪 Testing

- **Backend:** Use Django’s built-in test runner (`python manage.py test`)
- **Frontend:** Add tests with your preferred React testing library

---

## 🖼️ UI/UX Highlights

- Clean, professional design with TailwindCSS
- Animated cart drawer, product card hover effects
- Mobile-first responsive layouts
- Accessible forms and navigation

---

## 📦 Deployment

- **Frontend:** Ready for Vercel/Netlify
- **Backend:** Deployable to Heroku, Render, or any WSGI-compatible host

---



