# 🍽️ Alviro — Modern Restaurant Web Application

<div align="center">

![Alviro Banner](https://img.shields.io/badge/Alviro-Restaurant%20App-orange?style=for-the-badge&logo=react)

**A full-stack restaurant experience — seamless menus, table reservations, and more.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Features & Flows](#-features--user-flows)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Getting Started](#-getting-started)

---

## 🌟 Overview

**Alviro** is a modern, full-stack restaurant web application that delivers a premium dining experience — online. Customers can explore the menu, make table reservations, subscribe to newsletters, and interact with an AI chatbot. Restaurant admins can manage menu items and reservations behind authenticated routes.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| Vite | 7 | Build Tool & Dev Server |
| TailwindCSS | 3 | Utility-First Styling |
| Framer Motion | 12 | Animations & Transitions |
| React Router DOM | 7 | Client-Side Routing |
| Lucide React | 0.5 | Icons |
| Clerk React | 5 | Authentication UI |
| Axios | 1 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5 | REST API Server |
| MongoDB + Mongoose | 9 | Database & ODM |
| Clerk SDK | 4 | Authentication Middleware |
| JSON Web Token | 9 | Route Protection |
| bcryptjs | 3 | Password Hashing |
| dotenv | 17 | Environment Variables |
| CORS | 2 | Cross-Origin Requests |

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph CLIENT["🖥️ Client — React + Vite (Port 5173)"]
        direction TB
        A["🏠 Home Page"] 
        B["📋 Menu Page"]
        C["📞 Contact Page"]
        NAV["🔗 Navbar"]
        FOOT["🦶 Footer"]
        BOT["🤖 Chatbot"]
        CTX["🎨 Theme Context"]
    end

    subgraph SERVER["⚙️ Server — Express (Port 5000)"]
        direction TB
        AUTH_R["/api/auth"]
        MENU_R["/api/menu"]
        RES_R["/api/reservations"]
        NEWS_R["/api/newsletter"]
        PROT["/api/protected 🔐"]
    end

    subgraph DB["🗄️ MongoDB Atlas"]
        direction TB
        U[("👤 Users")]
        M[("🍕 MenuItems")]
        R[("📅 Reservations")]
        N[("📧 Newsletters")]
    end

    CLIENT -->|"REST API calls via Axios"| SERVER
    SERVER --> DB
    CLERK["🔑 Clerk Auth"] -->|"JWT Tokens"| SERVER
    CLIENT -->|"Authentication"| CLERK
```

---

## 📁 Project Structure

```
alviro/
├── 📦 package.json               # Root config
├── 🚫 .gitignore
│
├── client/                       # 🖥️ Frontend (React + Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx               # Root component + Router
│       ├── main.jsx              # Entry point
│       ├── config.js             # API base URL config
│       ├── context/
│       │   └── ThemeContext.jsx  # Dark/Light theme
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── Chatbot.jsx       # AI chatbot widget
│       │   ├── DesignOverlay.jsx
│       │   └── ScrollToTop.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Menu.jsx
│       │   └── Contact.jsx
│       └── assets/
│
└── server/                       # ⚙️ Backend (Express + MongoDB)
    ├── index.js                  # App entry + middleware
    ├── models/
    │   ├── User.js
    │   ├── MenuItem.js
    │   ├── Reservation.js
    │   └── NewsletterSubscriber.js
    ├── controllers/
    │   ├── authController.js
    │   ├── menuController.js
    │   ├── reservationController.js
    │   └── newsletterController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── menuRoutes.js
    │   ├── reservationRoutes.js
    │   └── newsletterRoutes.js
    └── middleware/
        └── authMiddleware.js
```

---

## ✨ Features & User Flows

### 1. 🧾 Menu Browsing

```mermaid
flowchart LR
    A([👤 User visits /menu]) --> B[Fetch GET /api/menu]
    B --> C{Items found?}
    C -- Yes --> D[Render Menu Cards\nwith Framer Motion]
    C -- No --> E[Show empty state]
    D --> F([🍽️ User browses items])
```

### 2. 📅 Table Reservation Flow

```mermaid
flowchart TD
    A([User opens Contact/Reservation form]) --> B[Fill in: Name, Email,\nPhone, Date, Time, Guests]
    B --> C[Submit Form]
    C --> D[POST /api/reservations]
    D --> E{Validation OK?}
    E -- ✅ Yes --> F[Save to MongoDB\nStatus: Pending]
    E -- ❌ No --> G[Return Error to User]
    F --> H[Confirmation response]
    H --> I([✅ User gets confirmation])

    subgraph ADMIN["🔐 Admin Actions"]
        J[GET /api/reservations] --> K[View all reservations]
        K --> L[PATCH /api/reservations/:id]
        L --> M{Update status}
        M --> N([Confirmed ✅])
        M --> O([Cancelled ❌])
    end
```

### 3. 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant C as 🖥️ Client
    participant CLK as 🔑 Clerk
    participant S as ⚙️ Server

    U->>C: Sign In / Sign Up
    C->>CLK: Redirect to Clerk Auth
    CLK-->>C: Return JWT Token
    C->>S: API Request + JWT in Header
    S->>CLK: Verify Token
    CLK-->>S: Token Valid ✅
    S-->>C: Protected Data
    C-->>U: Render Response
```

### 4. 📧 Newsletter Subscription

```mermaid
flowchart LR
    A([User enters email]) --> B[POST /api/newsletter]
    B --> C{Email exists?}
    C -- No --> D[Save subscriber\nto MongoDB]
    C -- Yes --> E[Return: Already subscribed]
    D --> F([✅ Subscribed successfully])
```

---

## 📡 API Reference

### 🔓 Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/menu` | Fetch all menu items |
| `POST` | `/api/reservations` | Create a new reservation |
| `POST` | `/api/newsletter` | Subscribe to newsletter |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |

### 🔐 Protected Routes (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/menu` | Add a new menu item |
| `PATCH` | `/api/menu/:id` | Update a menu item |
| `DELETE` | `/api/menu/:id` | Delete a menu item |
| `GET` | `/api/reservations` | Get all reservations |
| `PATCH` | `/api/reservations/:id` | Update reservation status |
| `GET` | `/api/protected` | Test Clerk auth route |

---

## 🗃️ Database Models

```mermaid
erDiagram
    USER {
        string _id PK
        string email
        string name
        string passwordHash
        date createdAt
    }

    MENU_ITEM {
        string _id PK
        string name
        string description
        number price
        string category
        string imageUrl
        date createdAt
    }

    RESERVATION {
        string _id PK
        string name
        string email
        string phone
        date date
        string time
        number guests
        string status
        string specialRequest
        date createdAt
    }

    NEWSLETTER_SUBSCRIBER {
        string _id PK
        string email
        date subscribedAt
    }

    USER ||--o{ RESERVATION : "makes"
```

### Reservation Status States

```mermaid
stateDiagram-v2
    [*] --> Pending : Reservation Created
    Pending --> Confirmed : Admin Approves ✅
    Pending --> Cancelled : Admin Rejects ❌
    Confirmed --> Cancelled : Cancellation Requested
    Cancelled --> [*]
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** account
- **Clerk** account for auth

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/alviro.git
cd alviro
```

### 2. Setup Environment Variables

#### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/alviro
CLERK_SECRET_KEY=sk_test_...
JWT_SECRET=your_jwt_secret
```

#### `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 3. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4. Run the Application

```bash
# Start backend (from /server)
npm run dev

# Start frontend (from /client)
npm run dev
```

| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:5173 |
| ⚙️ Backend API | http://localhost:5000 |

---

## 📊 Feature Overview

```
Features At a Glance
─────────────────────────────────────────
 🍕 Dynamic Menu         ████████████ 100%
 📅 Reservations         ████████████ 100%
 🔐 Auth (Clerk + JWT)   ████████████ 100%
 📧 Newsletter           ████████████ 100%
 🤖 AI Chatbot           ████████████ 100%
 🎨 Theme Toggle         ████████████ 100%
 📱 Responsive UI        ████████████ 100%
─────────────────────────────────────────
```

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

Made with ❤️ by **Divanshu Upadhayay**

⭐ Star this repo if you found it useful!

</div>
