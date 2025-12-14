# 🚀 Portfolio Optimization System

> Platform optimasi portofolio investasi berbasis Genetic Algorithm dengan antarmuka modern dan real-time data integration.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/node-16+-green.svg)

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi Stack](#-teknologi-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Penggunaan](#-penggunaan)
- [Dokumentasi](#-dokumentasi)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🎯 Core Features
- **Genetic Algorithm Optimization** - Optimasi portofolio menggunakan algoritma evolusi
- **Real-time Stock Data** - Integrasi dengan Yahoo Finance API
- **Multi-user Support** - Sistem autentikasi dengan Supabase
- **Portfolio History** - Riwayat optimasi tersimpan per user
- **Interactive Dashboard** - Visualisasi hasil dengan charts interaktif
- **Investment Calculator** - Kalkulasi alokasi dana berdasarkan saldo

### 📊 Analytics & Visualization
- Expected Return & Risk Metrics
- Efficient Frontier Plot
- Evolution History Chart
- Portfolio Composition Pie Chart
- Allocation Table with Amount Breakdown

### 🔐 User Management
- Email/Password Authentication
- Guest Mode (Session-based)
- Personal Watchlist
- History Management (Delete/Clear All)

---

## 🛠 Teknologi Stack

### Frontend
```
React 18.x          - UI Framework
Vite 4.x            - Build Tool
TailwindCSS 3.x     - Styling
Recharts 2.x        - Data Visualization
Lucide React        - Icon Library
Axios               - HTTP Client
```

### Backend
```
Node.js 16+         - Runtime
Express 4.x         - Web Framework
Supabase Client     - Database & Auth
Python 3.8+         - ML Engine
yfinance            - Stock Data API
NumPy & Pandas      - Data Processing
```

### Database
```
Supabase (PostgreSQL)
├── users
├── optimization_history
└── user_watchlists
```

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React UI   │  │  Auth Context│  │  API Service │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Express.js Server (Port 5000)              │   │
│  │  ┌────────────┐ ┌────────────┐ ┌─────────────────┐  │   │
│  │  │  Optimize  │ │  History   │ │    Watchlist    │  │   │
│  │  │  Routes    │ │  Routes    │ │    Routes       │  │   │
│  │  └────┬───────┘ └────┬───────┘ └────┬────────────┘  │   │
│  └───────┼──────────────┼──────────────┼───────────────┘   │
└──────────┼──────────────┼──────────────┼───────────────────┘
           │              │              │
           ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                     │
│  ┌──────────────────┐  ┌────────────────────────────────┐   │
│  │  Python Engine   │  │   Supabase Client (Node.js)   │   │
│  │  ┌────────────┐  │  │  ┌──────────┐  ┌───────────┐  │   │
│  │  │ optimizer. │  │  │  │ User Ctrl│  │ Auth Ctrl │  │   │
│  │  │    py      │  │  │  └──────────┘  └───────────┘  │   │
│  │  │            │  │  │                                │   │
│  │  │ - GA Core  │  │  │  Controllers:                 │   │
│  │  │ - Fitness  │  │  │  - getUserHistory()           │   │
│  │  │ - Mutation │  │  │  - deleteHistory()            │   │
│  │  │ - Crossover│  │  │  - clearAllHistory()          │   │
│  │  └────────────┘  │  │  - syncWatchlist()            │   │
│  └──────────────────┘  └────────────────────────────────┘   │
└──────────┬─────────────────────────┬────────────────────────┘
           │                         │
           ▼                         ▼
┌──────────────────────┐  ┌──────────────────────────────────┐
│   External APIs      │  │     Database Layer               │
│  ┌────────────────┐  │  │  ┌────────────────────────────┐  │
│  │ Yahoo Finance  │  │  │  │   Supabase PostgreSQL      │  │
│  │ (yfinance)     │  │  │  │                            │  │
│  │                │  │  │  │  Tables:                   │  │
│  │ - Stock Prices │  │  │  │  ├── users                 │  │
│  │ - Historical   │  │  │  │  ├── optimization_history  │  │
│  │   Data         │  │  │  │  └── user_watchlists       │  │
│  └────────────────┘  │  │  └────────────────────────────┘  │
└──────────────────────┘  └──────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → API Service → Express Route 
→ Controller → Python Engine / Supabase → Response → UI Update
```

---

## 📦 Instalasi

### Prerequisites
```bash
# Node.js & npm
node --version  # v16+
npm --version   # v8+

# Python & pip
python3 --version  # v3.8+
pip3 --version

# Git
git --version
```

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/portfolio-optimizer.git
cd portfolio-optimizer
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install

# Install Python dependencies
pip3 install -r requirements.txt
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Setup Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ⚙️ Konfigurasi

### Database Setup (Supabase)

1. Create a new Supabase project
2. Run SQL migrations:

```sql
-- Users table (handled by Supabase Auth)

-- Optimization History
CREATE TABLE optimization_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  tickers TEXT[] NOT NULL,
  risk_aversion DECIMAL(3,2),
  result_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_user ON optimization_history(user_id);
CREATE INDEX idx_history_session ON optimization_history(session_id);

-- Watchlist
CREATE TABLE user_watchlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

CREATE INDEX idx_watchlist_user ON user_watchlists(user_id);
```

### Python Requirements (`requirements.txt`)
```
numpy==1.24.3
pandas==2.0.3
yfinance==0.2.28
```

---

## 🚀 Penggunaan

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Docker (Optional)

```bash
docker-compose up -d
```

---

## 📚 Dokumentasi

Dokumentasi lengkap tersedia di folder `/docs`:

- **[API Reference](./docs/API_REFERENCE.md)** - Endpoint API dan contoh request/response
- **[User Guide](./docs/USER_GUIDE.md)** - Panduan penggunaan untuk end-user
- **[SRS Document](./docs/SRS.md)** - Software Requirements Specification
- **[Architecture](./docs/ARCHITECTURE.md)** - Detail arsitektur sistem

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Python engine tests
cd engine
python -m pytest tests/
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan ikuti langkah berikut:

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Coding Standards
- Follow ESLint rules for JavaScript
- Use PEP 8 for Python code
- Write meaningful commit messages
- Add tests for new features

---

## 📝 Changelog

### Version 1.0.0 (2024-01-15)
- ✨ Initial release
- 🎯 Genetic Algorithm optimization engine
- 📊 Interactive dashboard
- 🔐 User authentication
- 💾 History management
- 💰 Investment calculator

---

## 🐛 Known Issues

- [ ] Large portfolios (>10 stocks) may take longer to optimize
- [ ] Some international tickers may have limited historical data
- [ ] Mobile responsive design needs improvement

---

## 🗺 Roadmap

- [ ] Machine Learning price prediction
- [ ] Backtesting feature
- [ ] Export portfolio to PDF/Excel
- [ ] Mobile app (React Native)
- [ ] Advanced risk metrics (VaR, Sharpe Ratio)
- [ ] Real-time price updates (WebSocket)

---

## 📄 Lisensi

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Tim

- **Developer** - Your Name
- **Advisor** - Advisor Name
- **Institution** - University Name

---

## 📞 Kontak & Support

- **Email**: support@portfoliooptimizer.com
- **Documentation**: https://docs.portfoliooptimizer.com
- **Issues**: https://github.com/yourusername/portfolio-optimizer/issues

---

## 🙏 Acknowledgments

- [Yahoo Finance](https://finance.yahoo.com/) untuk data saham
- [Supabase](https://supabase.com/) untuk backend infrastructure
- [Recharts](https://recharts.org/) untuk visualization library
- Komunitas open-source yang telah berkontribusi

---

**Built with ❤️ using React, Node.js, Python, and Genetic Algorithms**