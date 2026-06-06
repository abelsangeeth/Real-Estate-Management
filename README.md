# AURA Estates — Luxury Real Estate Platform

**AURA Estates** is a premium, enterprise-grade web application and REST API built with **Node.js**, **TypeScript**, and **Fastify**. It combines high-performance backend patterns with a visually stunning, glassmorphic client interface designed in a champagne gold and slate dark color theme.

---

## 🏛️ Architecture & Technical Stack

The application implements a clean **Layered Architecture** dividing concerns across:
1. **Controllers** (API payload validation & route-level logic via Zod)
2. **Services** (Domain operations, authentication, and caching)
3. **Repositories** (Database query abstraction via Prisma ORM)

### Key Technologies:
- **Core Engine**: Node.js & TypeScript
- **Web Framework**: [Fastify](https://fastify.dev/) for maximum performance and throughput
- **Database Layer**: [Prisma ORM](https://www.prisma.io/) with a seed of ultra-high-end properties
- **Caching Layer**: Redis client (`ioredis`) with transparent fallback to in-memory caching
- **Validation**: [Zod](https://zod.dev/) for strict incoming request payload schemas
- **Authentication**: Stateless JWT token exchange using HTTP-Only secure cookies
- **Security**: Helmet headers, CORS policies, and rate-limiting
- **Observability**: Structured JSON logging via Pino and a dedicated `/health` check route
- **Client Frontend**: Stunning, responsive Single Page Application (SPA) designed using modern CSS layouts (glassmorphism, subtle gold text glows, and micro-animations)

---

## 📂 Project Directory Structure

```
├── .tmp/                   # Temporary files
├── directives/             # Markdown operations SOPs
├── prisma/
│   ├── schema.prisma       # Database design models
│   └── seed.ts             # Preloads mock users and premium listings
├── public/                 # Client assets
│   ├── css/
│   │   └── style.css       # Gold/slate dark CSS design system
│   ├── js/
│   │   └── app.js          # Client-side router, fetches, and auth state
│   └── assets/             # Real estate visual renderings
├── src/
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Error & JWT authorization hooks
│   ├── repositories/       # Prisma database wrappers
│   ├── routes/             # Fastify route plugins
│   ├── services/           # Caching & business logic handlers
│   ├── utils/              # Pino logger & DB connection singleton
│   ├── app.ts              # Core Fastify module configuration
│   └── index.ts            # Entrypoint listener
├── tsconfig.json           # Compiler rules
├── eslint.config.js        # ESLint 9 Flat Config
└── .prettierrc             # Prettier styling standards
```

---

## ⚙️ Quickstart Guide

### 1. Installation
Clone this repository and install the required dependencies:
```bash
npm install
```

### 2. Database Synchronization & Seeding
Configure your SQLite database, generate the Prisma Client, and seed the default accounts and luxury property listings:
```bash
npm run db:setup
```

### 3. Launch Development Server
Boot up the Fastify server:
```bash
npm run dev
```
The application will run locally at **`http://127.0.0.1:3000`**.

---

## 🔑 Default Credentials

Use the following default accounts to access various roles in the Private Portal Dashboard:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@aura.com` | `admin123` | Read/Write all listings & view all client inquiries |
| **Agent** | `agent@aura.com` | `agent123` | Read/Write all listings & view all client inquiries |
| **Buyer** | `buyer@aura.com` | `buyer123` | View listings, submit viewings, and check own inquiries |

---

## 🛡️ API Documentation & Testing

Automatically generated OpenAPI/Swagger interactive UI documentation is available out of the box. Boot the server and navigate to:
👉 **`http://localhost:3000/docs`**
