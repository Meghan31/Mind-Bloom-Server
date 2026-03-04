<div align="center">

# [🌿 Mind Bloom Server - Backend API & Data Pipeline](https://lovemindbloom.vercel.app/)

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**Backend services powering Mind Bloom journaling, affirmations, authentication, and quote workflows**

_Built for secure API delivery, reliable background processing, and smooth frontend integration._

[🌐 Live Frontend](https://lovemindbloom.vercel.app/) • [💻 Frontend Repo](https://github.com/Meghan31/frontend-mindbloom) • [🔗 Backend API](#-api-capabilities)

---

</div>

## ✨ What This Backend Handles

- 🔐 Authentication and authorization flows
- 📝 Journal CRUD operations
- 💫 Affirmations data access
- 🎯 Daily quote collection and analysis jobs
- 🛡️ Security middleware (rate limiting, validation, helmet, CORS)

---

## 🎯 Core Features

| Feature                      | Description                                                           |
| ---------------------------- | --------------------------------------------------------------------- |
| 🧩 **REST API Architecture** | Express route-based APIs for auth, journal, affirmations, and testing |
| 🗄️ **PostgreSQL + Prisma**   | Strong data modeling and type-safe DB access                          |
| ⚙️ **Background Pipelines**  | Separate collector and analyzer jobs for quote workflows              |
| 🔒 **Security First**        | JWT auth, request validation, rate limiting, CORS, and helmet         |
| 🧪 **Tested Services**       | Vitest-based tests for core app and API support layers                |
| 📦 **Production Build Flow** | TypeScript compile pipeline with Prisma client generation             |

---

## 🏗️ Service Architecture

```
┌────────────────────────────┐
│   Frontend (Vite/React)    │
│   lovemindbloom.vercel.app │
└──────────────┬─────────────┘
               │ HTTP API
               ▼
┌────────────────────────────┐
│      Express API App       │
│   Auth / Journal / Quotes  │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│     PostgreSQL + Prisma    │
└────────────────────────────┘

┌────────────────────────────┐
│  Background Jobs (Node)    │
│  collect.ts + analyze.ts   │
└────────────────────────────┘
```

---

## 🔧 Tech Stack

| Category      | Technology                       |
| ------------- | -------------------------------- |
| **Runtime**   | Node.js 20+                      |
| **Language**  | TypeScript                       |
| **Framework** | Express 4                        |
| **Database**  | PostgreSQL                       |
| **ORM**       | Prisma                           |
| **Auth**      | JWT + bcrypt                     |
| **Security**  | helmet, cors, express-rate-limit |
| **Testing**   | Vitest                           |

---

## 📡 API Capabilities

Main route modules in this project:

- `authRoutes` for user authentication
- `journalRoutes` for journal data operations
- `affirmationRoutes` for affirmation data access
- `testRoutes` for health/testing utilities

Related support layers include middleware, DB templates, Prisma client wiring, and static/template server integration.

---

## 🚀 Deployment Notes

- Designed to serve the production frontend at [https://lovemindbloom.vercel.app/](https://lovemindbloom.vercel.app/)
- Supports build-and-run flow via TypeScript compile output (`build/`)
- Includes Dockerfile and executable job scripts for container environments
- Uses environment-driven configuration for DB/auth/security settings

---

## 📚 Project Structure

```
backend-mindbloom/
├── src/
│   ├── routes/            # API route modules
│   ├── middleware/        # Auth, rate limiter, validation
│   ├── lib/               # Prisma and shared helpers
│   ├── databaseSupport/   # DB support templates
│   ├── webSupport/        # Server/bootstrap helpers
│   ├── collect.ts         # Quote collection job
│   ├── analyze.ts         # Quote analysis job
│   └── app.ts             # Main app entry
├── prisma/                # Prisma schema + seed
├── databases/             # SQL + migration assets
├── scripts/               # Environment and DB utility scripts
├── bin/                   # Shell entry scripts
└── Dockerfile
```

---

## 🔗 Related Repositories

- Frontend: [https://github.com/Meghan31/frontend-mindbloom](https://github.com/Meghan31/frontend-mindbloom)
- Backend: [https://github.com/Meghan31/Mind-Bloom-Server](https://github.com/Meghan31/Mind-Bloom-Server)

---

## 👤 Author

**Meghasrivardhan Pulakhandam (Megha)**

- 🌐 Portfolio: [www.meghan31.me](https://www.meghan31.me/)
- 💼 LinkedIn: [linkedin.com/in/meghan31](https://www.linkedin.com/in/meghan31/)
- 🐙 GitHub: [@Meghan31](https://github.com/Meghan31)

---

<div align="center">

**Built with ❤️ by [Megha31](https://www.meghan31.me/)**

⭐ If this backend helped you, give it a star!

[🌐 Try Live App](https://lovemindbloom.vercel.app/) • [🐛 Report Bug](https://github.com/Meghan31/Mind-Bloom-Server/issues) • [✨ Request Feature](https://github.com/Meghan31/Mind-Bloom-Server/issues)

</div>
