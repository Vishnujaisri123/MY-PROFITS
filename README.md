# ⚡ MY-PROFITS — Iron Man HUD Portfolio Tracker

> A real-time Gold & Silver portfolio tracker built with a **JARVIS / Iron Man HUD** aesthetic.  
> Live metal prices • P&L tracking • JWT authentication • WebSocket streaming • MongoDB persistence.

---

## 🖥️ Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | Deployed on [Vercel](https://vercel.com) |
| **Backend**  | Deployed on [Render](https://render.com) |

---

## ✨ Features

### 🎯 Core Functionality
- 📈 **Real-time Gold & Silver prices** — streamed every second via WebSocket (no page refresh needed)
- 💰 **Live P&L calculation** — profit/loss computed per buy lot and in total
- ✏️ **Editable holdings** — add, edit, or delete buy lots directly in the UI; changes persist to MongoDB
- 🔄 **Dual portfolio view** — toggle between Spot market rates and AP (auctions/physical) market rates
- 📊 **Buy History table** — lists every lot with qty, buy price, current value, and P&L per lot
- 🧲 **State Market Feed** — live rate bar showing dynamic gold & silver prices with up/down indicators

### 🔐 Authentication
- User registration & login with **username + password**
- Passwords hashed with **bcryptjs** (salt rounds: 10)
- Sessions secured with **JWT** (7-day expiry)
- Protected routes — unauthenticated users are redirected to `/login`
- Each user's holdings are stored independently in MongoDB

### 🎨 Iron Man / JARVIS HUD Design
- **Arc Reactor** center piece with animated rotating rings
  - Ring speed responds dynamically to profit/loss magnitude
  - Green rings = profit mode | Red rings = loss mode
  - **3D parallax tilt** on mouse hover
  - **Flip animation** to toggle between Spot and AP portfolio views
  - **Fullscreen system mode** — tap ⛶ to expand the Arc Reactor to full screen
- Glassmorphism panels with neon cyan/gold glow effects
- **Edit Panel** — dark glassmorphic background (`rgba(5,12,25,0.85)`) with cyan border glow and inner box-shadow for a premium feel
- Dark steel color palette with `Orbitron` and `Inter` fonts
- Smooth micro-animations on price ticks and value changes
- Fully responsive layout (desktop 3-column → mobile single column)

---

## 🏗️ Architecture

```
MY-PROFITS/
├── frontend/          # React 19 + Vite app (deployed on Vercel)
│   └── src/
│       ├── components/
│       │   ├── ArcReactor.jsx       # Animated 3D Arc Reactor HUD
│       │   ├── BuyHistory.jsx       # Editable buy lots table
│       │   ├── LiveRates.jsx        # Gold & Silver live price display
│       │   ├── StateMarketFeed.jsx  # Scrolling price ticker
│       │   ├── APMarketPortfolio.jsx# AP market view
│       │   └── ProfitPanel.jsx      # Detailed P&L summary panel
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state (JWT)
│       ├── hooks/
│       │   └── usePortfolioEditor.js# CRUD for holdings (synced with API)
│       ├── pages/
│       │   ├── Login.jsx            # Login page
│       │   └── Signup.jsx           # Registration page
│       ├── services/
│       │   └── socket.js            # WebSocket client with auto-reconnect
│       └── utils/
│           ├── calcPortfolio.js     # P&L computation (mirrors backend)
│           ├── apPortfolio.js       # AP market P&L computation
│           └── apConstants.js       # AP price multipliers
│
└── backend/           # Node.js + Express API (deployed on Render)
    └── src/
        ├── server.js              # Express app entry point
        ├── websocket.js           # WebSocket server (broadcasts every 1s)
        ├── priceService.js        # Live price fetching with caching & fallback
        ├── profitEngine.js        # Server-side P&L engine
        ├── portfolioService.js    # Portfolio aggregation
        ├── config.js              # App-wide constants
        ├── holdings.js            # In-memory holdings (fallback)
        ├── models/
        │   └── User.js            # Mongoose schema (User + Holdings)
        ├── routes/
        │   ├── auth.js            # POST /api/auth/register, /api/auth/login
        │   └── holdings.js        # GET/PUT /api/holdings (JWT protected)
        └── middleware/
            └── auth.js            # JWT verification middleware
```

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |

**Register / Login Body:**
```json
{
  "username": "your_name",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "<jwt_token>",
  "username": "your_name"
}
```

---

### Holdings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/holdings` | Get current user's gold & silver holdings | ✅ JWT |
| `PUT` | `/api/holdings` | Update user's holdings | ✅ JWT |

**Holdings Shape:**
```json
{
  "gold":   [{ "id": 1, "qty": 7,  "buyPrice": 10000 }],
  "silver": [{ "id": 1, "qty": 4,  "buyPrice": 116000 }]
}
```

---

### WebSocket (Real-time)

Connect to `ws://<backend-url>` — no authentication required.

**Payload broadcast every ~1 second:**
```json
{
  "type": "PORTFOLIO_UPDATE",
  "prices": {
    "gold":   { "price": 9450.50, "direction": "up" },
    "silver": { "price": 98500.00, "direction": "down" }
  },
  "portfolio": { ... }
}
```

---

## 💱 Price Data Sources

| Source | Purpose | Details |
|--------|---------|---------|
| **fawazahmed0 Currency API** (Primary) | XAU / XAG metal rates | CDN-hosted, free, no API key |
| **Cloudflare Pages Mirror** (Fallback) | XAU / XAG metal rates | Same data, different CDN |
| **open.er-api.com** | USD → INR exchange rate | Free, refreshed every 60 min |

**Price conversion:**
- `Gold (₹/g)` = `(1/XAU_rate × USD/INR) ÷ 31.1035`
- `Silver (₹/kg)` = `(1/XAG_rate × USD/INR) ÷ 31.1035 × 1000`
- Prices are cached for **15 minutes** and simulated with ±tick variation every second for live HUD feel.

---

## 🧰 Tech Stack

### Frontend
| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.x | UI framework |
| Vite (rolldown) | 7.x | Build tool |
| React Router DOM | 7.x | Client-side routing |
| Chart.js + react-chartjs-2 | 4.x | (Available for charts) |
| Axios | 1.x | HTTP client for REST calls |
| Vanilla CSS | — | Glassmorphism HUD styles |

### Backend
| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 5.x | REST API framework |
| ws | 8.x | WebSocket server |
| Mongoose | 9.x | MongoDB ODM |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT auth tokens |
| Axios | 1.x | Fetch metal prices |
| dotenv | 17.x | Environment variable management |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** (Cluster1) | Cloud database — user accounts & per-user gold/silver holdings |
| Render (free tier) | Backend hosting with WebSocket support |
| Vercel | Frontend hosting with automatic SPA routing |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

---

### 1. Clone the repository
```bash
git clone https://github.com/Vishnujaisri123/MY-PROFITS.git
cd MY-PROFITS
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<AppName>
JWT_SECRET=your_super_secret_key_here
```

Start the backend:
```bash
npm run dev        # development (auto-restarts)
# or
npm start          # production
```

Backend will run at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_WS_URL=ws://localhost:5000
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## ☁️ Deployment

### Backend → Render

The `backend/render.yaml` is pre-configured:
```yaml
services:
  - type: web
    name: my-profits-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
```

**Render Environment Variables to set:**
| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A strong random secret |
| `NODE_ENV` | `production` |

---

### Frontend → Vercel

The `frontend/vercel.json` handles SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Vercel Environment Variables to set:**
| Key | Value |
|-----|-------|
| `VITE_WS_URL` | `wss://your-render-backend.onrender.com` |
| `VITE_API_URL` | `https://your-render-backend.onrender.com` |

---

## 📁 Key Files Explained

| File | What it does |
|------|-------------|
| `backend/src/priceService.js` | Fetches live XAU/XAG prices, converts to INR, caches for 15 min, simulates tick movement |
| `backend/src/websocket.js` | Broadcasts price + portfolio update to all connected clients every 1 second |
| `backend/src/models/User.js` | Mongoose schema: username, bcrypt-hashed password, and nested gold/silver holdings array |
| `backend/src/routes/auth.js` | Register + Login endpoints; issues 7-day JWT on success |
| `backend/src/routes/holdings.js` | GET/PUT holdings protected by JWT middleware |
| `frontend/src/components/ArcReactor.jsx` | The animated Iron Man arc reactor — ring speeds driven by P&L magnitude |
| `frontend/src/components/BuyHistory.jsx` | Editable buy history table with add/edit/delete and per-lot P&L |
| `frontend/src/utils/calcPortfolio.js` | Pure function: `(holdings[], livePrice) → { totalProfit, totalValue, buyDetails[] }` |
| `frontend/src/hooks/usePortfolioEditor.js` | Manages editable holdings state, auto-syncs changes to backend API |
| `frontend/src/context/AuthContext.jsx` | Provides `user`, `token`, `login`, `logout` to entire app via React Context |
| `frontend/src/services/socket.js` | WebSocket client with exponential back-off auto-reconnect |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--neon` | `#00ffe1` | Primary neon cyan glow |
| `--gold` | `#ffd700` | Gold accent |
| `--danger` | `#ff4d4d` | Loss / error state |
| `--glass` | `rgba(255,255,255,0.04)` | Glassmorphism panels |
| Font: `Orbitron` | Google Fonts | Numbers, labels, HUD text |
| Font: `Inter` | Google Fonts | Body text, descriptions |

---

## 🔒 Security Notes

> **Warning:** Never commit real credentials to GitHub.

- `.env` files are listed in `.gitignore` — **this is intentional and correct**. The database password and JWT secret must never be pushed to GitHub.
- The `backend/.env` holds `MONGODB_URI` (MongoDB Atlas Cluster1 connection) and `JWT_SECRET` — set these as environment variables on Render for production.
- Passwords are **never stored in plain text** — always bcrypt-hashed with 10 salt rounds.
- JWT tokens expire after **7 days** and must be re-issued via login.
- If you clone this repo, create your own `backend/.env` locally with your own MongoDB Atlas URI.

---

## 📄 License

This project is private and not licensed for public distribution.

---

## 👤 Author

**Vishnu Jaisri**  
GitHub: [@Vishnujaisri123](https://github.com/Vishnujaisri123)
