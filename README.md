<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-0C2451?style=for-the-badge&logo=razorpay&logoColor=white" />
</p>

<h1 align="center">🛒 SmartCart — Self-Checkout System</h1>

<p align="center">
  <strong>A full-stack IoT-enabled self-checkout platform that eliminates billing queues with barcode scanning, real-time fraud detection, and integrated payments.</strong>
</p>

<p align="center">
  <a href="https://self-checkout-production-d764.up.railway.app/api/health">
    <img src="https://img.shields.io/badge/API-Live-brightgreen?style=flat-square" />
  </a>
  <a href="https://self-checkout-xi.vercel.app">
    <img src="https://img.shields.io/badge/Admin_Dashboard-Live-blue?style=flat-square" />
  </a>
  <img src="https://img.shields.io/badge/License-ISC-yellow?style=flat-square" />
</p>

---

## 📋 Problem Statement

Retail stores face a persistent bottleneck: **long billing queues**. During peak hours, customers wait 10–20 minutes at checkout counters, leading to:

- 🕐 **Poor customer experience** — frustration and cart abandonment
- 💸 **Lost revenue** — customers leave without purchasing
- 👥 **High staffing costs** — dedicated billing staff at every counter
- 📉 **Operational inefficiency** — idle counters during off-peak, overwhelmed during peak

Traditional self-checkout kiosks are expensive (~₹5–10 lakh per unit) and still require customers to queue at a fixed station.

## 💡 Solution

**SmartCart** turns the customer's own smartphone into a self-checkout terminal:

1. **Scan as you shop** — Customers scan product barcodes with the mobile app as they pick items off the shelf
2. **Smart cart validation** — IoT weight sensors on the cart verify each scanned item matches expected weight, preventing theft
3. **In-app payment** — Checkout and pay via Razorpay (UPI, cards, wallets) without visiting any counter
4. **Exit QR verification** — A unique QR code is generated post-payment; the exit gate scanner verifies the purchase
5. **Real-time admin monitoring** — Store managers track orders, revenue, and fraud alerts through a live dashboard

**Result**: Zero queues. Zero billing staff. Real-time theft prevention.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SMARTCART ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   📱 Mobile App                              🖥️ Admin Dashboard      │
│   (React Native / Expo)                      (React + Vite)         │
│   ┌─────────────────────┐                    ┌──────────────────┐   │
│   │ • Login / Register  │                    │ • Live Stats     │   │
│   │ • Barcode Scanner   │───── HTTPS ───────▶│ • Order Tracking │   │
│   │ • Smart Cart        │                    │ • Fraud Alerts   │   │
│   │ • Razorpay Payment  │◀── Socket.io ────▶│ • Product CRUD   │   │
│   │ • Exit QR Code      │                    │ • Alert Resolve  │   │
│   └─────────────────────┘                    └──────────────────┘   │
│            │                                          │              │
│            │              ┌──────────────┐            │              │
│            └─────────────▶│   Backend    │◀───────────┘              │
│                           │  (Express)   │                           │
│                           ├──────────────┤                           │
│                           │ • REST API   │                           │
│                           │ • Socket.io  │                           │
│                           │ • JWT Auth   │                           │
│                           │ • Rate Limit │                           │
│                           └──────┬───────┘                           │
│                                  │                                   │
│                    ┌─────────────┼─────────────┐                     │
│                    │             │             │                      │
│              ┌─────▼─────┐ ┌────▼────┐ ┌──────▼──────┐              │
│              │  MongoDB  │ │Razorpay │ │ IoT Sensor  │              │
│              │  (Atlas)  │ │   API   │ │  (Weight)   │              │
│              └───────────┘ └─────────┘ └─────────────┘              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Node.js, Express 5, MongoDB, Mongoose | REST API, business logic, data persistence |
| **Auth** | JWT (access + refresh tokens), bcrypt, Zod | Secure authentication, input validation |
| **Real-time** | Socket.io | Live order updates, instant fraud alerts |
| **Payments** | Razorpay (UPI, Cards, Wallets) | Payment processing with webhook verification |
| **Security** | Helmet, CORS, express-rate-limit | HTTP hardening, rate limiting, origin control |
| **Mobile App** | React Native (Expo), AsyncStorage | Cross-platform customer app (iOS + Android) |
| **Admin Dashboard** | React, Vite, Tailwind CSS, shadcn/ui | Store management interface |
| **State Management** | Zustand (Admin), Context API (Mobile) | Client-side state |
| **Charts** | Recharts | Revenue and order analytics |
| **DevOps** | Railway (API), Vercel (Admin), MongoDB Atlas | Production deployment |

---

## ✨ Features

### Customer Mobile App
- [x] Phone + password authentication with JWT
- [x] Real-time barcode scanning (camera + manual entry)
- [x] Smart cart with live running total
- [x] Quantity adjustment and item removal
- [x] Weight sensor validation (IoT integration)
- [x] Razorpay checkout (UPI / Cards / Wallets)
- [x] Post-payment exit QR code generation
- [x] Order history

### Admin Dashboard
- [x] Secure admin/staff login with role-based access
- [x] Live dashboard with revenue, orders, active carts stats
- [x] Real-time order tracking via Socket.io
- [x] Fraud alert system with severity levels (LOW / MEDIUM / HIGH)
- [x] One-click alert resolution with notes
- [x] Product management (CRUD, stock toggle)
- [x] Order management with search and filters
- [x] Revenue analytics with charts (Recharts)

### Backend & Security
- [x] RESTful API with Express 5
- [x] JWT authentication (access + refresh token rotation)
- [x] Role-based authorization (customer / staff / admin)
- [x] Zod schema validation for all inputs
- [x] Rate limiting on auth endpoints
- [x] Helmet security headers
- [x] CORS with dynamic origin whitelisting
- [x] Razorpay webhook with HMAC signature verification
- [x] Real-time event broadcasting via Socket.io
- [x] Environment validation at startup (fail-fast)

---

## 🔗 Live Links

| Resource | URL | Status |
|----------|-----|--------|
| **Backend API** | [self-checkout-production-d764.up.railway.app](https://self-checkout-production-d764.up.railway.app) | ✅ Live |
| **Health Check** | [/api/health](https://self-checkout-production-d764.up.railway.app/api/health) | ✅ Live |
| **Admin Dashboard** | [self-checkout-xi.vercel.app](https://self-checkout-xi.vercel.app) | ✅ Live |
| **Mobile App** | Expo Go (development) | 📱 Local |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Razorpay test account
- Expo Go app (for mobile testing)

### 1. Clone the repository

```bash
git clone https://github.com/Bhuvan-Mahajan/Self-Checkout-.git
cd Self-Checkout-
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smartcart
JWT_SECRET=your-jwt-secret-min-32-chars-long
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev    # Starts on http://localhost:5000
```

### 3. Admin Dashboard Setup

```bash
cd admin
npm install
```

Create `admin/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev    # Starts on http://localhost:5173
```

### 4. Mobile App Setup

```bash
cd mobile
npm install
```

Create `mobile/.env`:

```env
API_URL=http://<your-local-ip>:5000
```

```bash
npx expo start    # Scan QR with Expo Go
```

> **Tip**: Use your machine's local IP (e.g., `192.168.x.x`) instead of `localhost` for the mobile app to connect to the backend.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login (returns JWT) | ❌ |
| `POST` | `/api/auth/logout` | Logout + clear refresh token | ✅ |
| `POST` | `/api/auth/refresh` | Rotate access token | ❌ |
| `GET` | `/api/auth/me` | Get current user profile | ✅ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/products/search?q=` | Search products | ❌ |
| `GET` | `/api/products/:barcode` | Get product by barcode | ❌ |
| `POST` | `/api/products` | Create product | 🔒 Admin |
| `PATCH` | `/api/products/:id` | Update product | 🔒 Admin |
| `PATCH` | `/api/products/:id/stock` | Toggle stock status | 🔒 Staff+ |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/cart/current` | Get active cart | ✅ |
| `POST` | `/api/cart/start` | Start new cart session | ✅ |
| `POST` | `/api/cart/scan` | Scan item into cart | ✅ |
| `DELETE` | `/api/cart/item/:productId` | Remove item from cart | ✅ |
| `POST` | `/api/cart/sensor-update` | IoT weight sensor update | ✅ |
| `POST` | `/api/cart/checkout` | Checkout cart → create order | ✅ |

### Payments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/payments/create` | Create Razorpay order | ✅ |
| `POST` | `/api/payments/webhook` | Razorpay webhook (HMAC) | ❌* |
| `GET` | `/api/payments/:orderId` | Get payment status | ✅ |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/admin/stats` | Dashboard statistics | 🔒 Staff+ |
| `GET` | `/api/admin/orders` | All orders | 🔒 Staff+ |
| `GET` | `/api/admin/products` | All products | 🔒 Staff+ |
| `GET` | `/api/admin/alerts` | Fraud alerts | 🔒 Staff+ |
| `PATCH` | `/api/admin/alerts/:id/resolve` | Resolve alert | 🔒 Staff+ |

> **Auth Legend**: ❌ Public · ✅ Logged in · 🔒 Role-restricted · ❌* Razorpay server-to-server

### Real-time Events (Socket.io)
| Event | Direction | Description |
|-------|-----------|-------------|
| `fraud-alert` | Server → Admin | New weight mismatch detected |
| `new-order` | Server → Admin | Customer completed checkout |
| `cart-update` | Server → Mobile | Cart state synchronization |

---

## 📸 Screenshots

<!-- Add screenshots here -->
<!--
| Mobile App | Admin Dashboard |
|:---:|:---:|
| ![Login](screenshots/mobile-login.png) | ![Dashboard](screenshots/admin-dashboard.png) |
| ![Scan](screenshots/mobile-scan.png) | ![Alerts](screenshots/admin-alerts.png) |
| ![Cart](screenshots/mobile-cart.png) | ![Orders](screenshots/admin-orders.png) |
| ![Payment](screenshots/mobile-payment.png) | ![Products](screenshots/admin-products.png) |
-->

> 📌 **Screenshots coming soon** — Run the app locally or visit the [live admin dashboard](https://self-checkout-xi.vercel.app) to see it in action.

---

## 📂 Project Structure

```
Self-Checkout-/
├── backend/               # Express API + Socket.io server
│   ├── config/            # DB connection, env validation (Zod)
│   ├── controllers/       # Route handlers
│   ├── middleware/         # Auth (JWT), RBAC, validation, errors
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API route definitions
│   ├── utils/             # Helpers, AppError, validators
│   └── app.js             # Server entry point
│
├── mobile/                # React Native (Expo) customer app
│   └── src/
│       ├── screens/       # Login, Home, Scan, Cart, Payment, Success
│       ├── services/      # API client, socket client
│       ├── context/       # Auth + Cart context providers
│       └── constants/     # Colors, config
│
├── admin/                 # React + Vite admin dashboard
│   └── src/
│       ├── pages/         # Login, Dashboard, Alerts, Orders, Products
│       ├── components/    # Sidebar, UI primitives (shadcn)
│       ├── services/      # API client, socket client
│       └── store/         # Zustand auth store
│
└── docker-compose.yml     # Local development setup
```

---

## 🧑‍💻 Author

**Bhuvan Mahajan**

- GitHub: [@Bhuvan-Mahajan](https://github.com/Bhuvan-Mahajan)

---

## 📄 License

This project is licensed under the ISC License.
