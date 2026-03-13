# ✈️ Visa Planner - A Smart Travel Visa and Passport Management System

A full-stack web application that helps users manage international travel plans, passports, and visa requirements — all from a single dashboard.

> Built with Next.js, NestJS, PostgreSQL, and RapidAPI integration for real-time visa requirement checking.

---

![Image Alt](https://github.com/Jtdsiriwardena/Visa-Planner-A-Smart-Travel-Visa-and-Passport-Management-System/blob/115cc9e77a61bde29b90edf1a5366a836bf4952f/Home_page.png) 

## 📌 Project Overview

Visa Planner enables users to:

- Create and manage **international trips**
- Store and track **passports**
- **Check visa requirements** automatically for any destination
- Track **travel documents** in one centralized dashboard

---

## 🚀 Features

### 🔐 User Authentication & Management
- Sign up and log in using secure **JWT tokens**
- Authentication guard on all protected API endpoints

### 🗺️ Trip Management
- Create, edit, and view trips
- Each trip includes `name`, `start_date`, and `end_date`

### 📘 Passport Management
- Add, edit, and list passports
- Each passport is associated with a `country_code`

### 🛂 Destination & Visa Management
- Add destinations to trips using a chosen passport
- **Automatic visa requirement checks** via external API (RapidAPI)
- Visa info includes:
  - `visa_status`
  - `visa_duration`
  - `mandatory_registration`
- Handles domestic travel and special cases automatically

### 🖥️ Frontend Dashboard
- Dedicated pages for Trips, Passports, and Visa Info
- Forms for trip creation and destination addition
- Visa check with dropdowns (passport and destination country)

---

## 🛠 Tech Stack

### 🖥 Frontend
| Technology | Purpose |
|---|---|
| Next.js 13 (App Router) | React framework with SSR/SSG |
| React | Component-based UI |
| Tailwind CSS | Utility-first styling |
| JWT (client-side) | Token handling & auth state |

### ⚙️ Backend
| Technology | Purpose |
|---|---|
| NestJS | Scalable Node.js framework |
| TypeORM | ORM for database management |
| PostgreSQL | Relational database |
| JWT Authentication | Secure login & route protection |

### 🔌 Integrations
| Technology | Purpose |
|---|---|
| RapidAPI | External visa requirement data |
| Postman | API testing during development |

---

## 🏗 System Architecture

```
     Client (Next.js App Router)
              │
            Axios
              │
              ▼
       NestJS REST API
              │
     ┌────────┴──────────┐
     ▼                   ▼
JWT Auth Guard       Controllers
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           TypeORM              RapidAPI
              │               (Visa Check)
              ▼
          PostgreSQL
```

---

## ⚙️ Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/visa-planner.git
```

**2. Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

### Backend — create a `.env` file in `/backend`:

```env
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=visa_planner

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# RapidAPI
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=visa-requirement-by-country.p.rapidapi.com
```

### Frontend — create a `.env.local` file in `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## ▶️ Running the Application


**Start the backend**

```bash
cd backend
npm run start:dev
```

**Start the frontend**

```bash
cd frontend
npm run dev
```


---

---

## 🗄️ Database Schema

```
Users
 └── id, email, password (hashed), created_at

Trips
 └── id, name, start_date, end_date, user_id (FK)

Passports
 └── id, country_code, user_id (FK)

Destinations
 └── id, country_code, trip_id (FK), passport_id (FK),
     visa_status, visa_duration, mandatory_registration
```

---

## 📸 Screenshots

### Dashboard

**Passport Management**

![Image Alt](https://github.com/Jtdsiriwardena/Visa-Planner-A-Smart-Travel-Visa-and-Passport-Management-System/blob/115cc9e77a61bde29b90edf1a5366a836bf4952f/Passports.png) 

**Trip Management**

![Image Alt](https://github.com/Jtdsiriwardena/Visa-Planner-A-Smart-Travel-Visa-and-Passport-Management-System/blob/115cc9e77a61bde29b90edf1a5366a836bf4952f/trips.png) 

**Visa Management**

![Image Alt](https://github.com/Jtdsiriwardena/Visa-Planner-A-Smart-Travel-Visa-and-Passport-Management-System/blob/115cc9e77a61bde29b90edf1a5366a836bf4952f/Visa_Requirements.png) 

**Downloadable Travel Planner**

![Image Alt](https://github.com/Jtdsiriwardena/Visa-Planner-A-Smart-Travel-Visa-and-Passport-Management-System/blob/115cc9e77a61bde29b90edf1a5366a836bf4952f/pdf.png)

```

---
