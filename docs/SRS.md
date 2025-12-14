# Software Requirements Specification (SRS)

## Portfolio Optimization System

**Version:** 1.0.0  
**Date:** January 2024  
**Prepared by:** Development Team  
**Project:** Portfolio Optimization using Genetic Algorithm

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Models](#6-system-models)
7. [Appendix](#7-appendix)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the Portfolio Optimization System. It describes the system's functional and non-functional requirements, constraints, and interfaces for developers, testers, and stakeholders.

### 1.2 Scope

The Portfolio Optimization System is a web-based application that:

- Optimizes investment portfolio allocation using Genetic Algorithm
- Provides real-time stock market data integration
- Offers personalized investment recommendations
- Manages user portfolios and optimization history
- Visualizes portfolio metrics and analytics

**In Scope:**
- Portfolio optimization engine (Genetic Algorithm)
- User authentication and authorization
- Stock data retrieval and processing
- Interactive dashboard and visualization
- History management and watchlist features

**Out of Scope:**
- Actual trading/brokerage integration
- Real-time streaming quotes
- Cryptocurrency or forex optimization
- Tax calculation and reporting
- Financial advisory services

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| GA | Genetic Algorithm - evolutionary computation method |
| HHI | Herfindahl-Hirschman Index - measure of portfolio concentration |
| API | Application Programming Interface |
| SPA | Single Page Application |
| JWT | JSON Web Token |
| CRUD | Create, Read, Update, Delete |
| UI/UX | User Interface / User Experience |
| REST | Representational State Transfer |

### 1.4 References

1. Modern Portfolio Theory - Harry Markowitz (1952)
2. Genetic Algorithms in Search, Optimization and Machine Learning - David Goldberg (1989)
3. Yahoo Finance API Documentation
4. Supabase Documentation
5. React Documentation v18

### 1.5 Overview

The remaining sections of this document provide:
- Section 2: Overall system description and context
- Section 3: Detailed functional requirements
- Section 4: External interface specifications
- Section 5: Non-functional requirements
- Section 6: System models and diagrams

---

## 2. Overall Description

### 2.1 Product Perspective

The Portfolio Optimization System is a standalone web application that interfaces with:

1. **Yahoo Finance API** - For stock market data
2. **Supabase Backend** - For authentication and database
3. **Python Engine** - For optimization calculations
4. **Web Browsers** - As client interface

**System Context Diagram:**

```
┌─────────────────────────────────────────────────────┐
│                  External Systems                    │
│  ┌──────────────┐  ┌──────────────┐                │
│  │ Yahoo Finance│  │   Supabase   │                │
│  │     API      │  │   Backend    │                │
│  └──────┬───────┘  └──────┬───────┘                │
└─────────┼──────────────────┼──────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────┐
│         Portfolio Optimization System                │
│  ┌─────────────────────────────────────────────┐   │
│  │           Web Application Layer              │   │
│  │  ┌─────────────┐  ┌──────────────────────┐  │   │
│  │  │   React UI  │  │  Express.js Server   │  │   │
│  │  └─────────────┘  └──────────────────────┘  │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │      Optimization Engine (Python)            │   │
│  │  - Genetic Algorithm                         │   │
│  │  - Data Processing                           │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────┐
│   End Users     │
│  - Investors    │
│  - Students     │
│  - Researchers  │
└─────────────────┘
```

### 2.2 Product Functions

**Primary Functions:**

1. **Portfolio Optimization**
   - Input: Stock tickers, risk aversion, investment amount
   - Process: Run Genetic Algorithm optimization
   - Output: Optimal allocation percentages and amounts

2. **User Management**
   - Registration and authentication
   - Profile management
   - Session handling

3. **Data Visualization**
   - Interactive charts and graphs
   - Real-time metric updates
   - Comparative analysis

4. **History Management**
   - Save optimization results
   - Retrieve past optimizations
   - Delete/clear history

5. **Watchlist Management**
   - Add/remove stocks from watchlist
   - Quick access to favorite stocks
   - Sync across devices

### 2.3 User Classes and Characteristics

#### User Class 1: Retail Investors
- **Characteristics:** Basic to intermediate investment knowledge
- **Frequency:** Weekly to monthly usage
- **Priority:** High - primary user base
- **Needs:** Simple interface, clear recommendations, educational content

#### User Class 2: Students/Researchers
- **Characteristics:** Academic interest in portfolio theory
- **Frequency:** Project-based usage
- **Priority:** Medium
- **Needs:** Detailed metrics, algorithm transparency, data export

#### User Class 3: Financial Professionals
- **Characteristics:** Expert knowledge, multiple portfolio management
- **Frequency:** Daily usage
- **Priority:** Medium
- **Needs:** Advanced features, batch processing, API access

#### User Class 4: Guest Users
- **Characteristics:** First-time visitors, exploratory
- **Frequency:** One-time to occasional
- **Priority:** Low
- **Needs:** No registration barrier, quick demo

### 2.4 Operating Environment

**Client Side:**
- Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Screen resolution: 1024x768 minimum, responsive up to 4K
- Internet connection: 1 Mbps minimum

**Server Side:**
- Operating System: Linux Ubuntu 20.04 LTS or Windows Server 2019
- Node.js Runtime: v16 or higher
- Python Runtime: v3.8 or higher
- Database: PostgreSQL 13+ (via Supabase)

**Network:**
- HTTPS protocol for secure communication
- RESTful API architecture
- WebSocket support (future enhancement)

### 2.5 Design and Implementation Constraints

**Technical Constraints:**
1. Must use Yahoo Finance API (free tier limitations)
2. Python must be installed on server for optimization engine
3. Supabase free tier limits (50k auth users, 500 MB database)

**Business Constraints:**
1. No financial advice disclaimer required
2. No real-money transactions
3. Educational/informational purpose only

**Regulatory Constraints:**
1. GDPR compliance for EU users
2. Data privacy regulations
3. No financial licensing required (information-only service)

### 2.6 Assumptions and Dependencies

**Assumptions:**
1. Users have basic understanding of stock market
2. Internet connection is stable
3. Yahoo Finance API remains accessible
4. Historical data is sufficient predictor of future trends

**Dependencies:**
1. Yahoo Finance API availability
2. Supabase service uptime
3. Third-party libraries (React, Express, NumPy)
4. Browser JavaScript enabled
5. Python libraries (yfinance, pandas, numpy)

---

## 3. System Features

### 3.1 User Authentication

**Priority:** High  
**Status:** Implemented

#### 3.1.1 Description
Allow users to register, login, and manage their accounts securely.

#### 3.1.2 Functional Requirements

**REQ-AUTH-001:** System shall allow users to register with email and password  
**REQ-AUTH-002:** System shall validate email format and password strength (min 8 characters)  
**REQ-AUTH-003:** System shall send email verification after registration  
**REQ-AUTH-004:** System shall allow users to login with valid credentials  
**REQ-AUTH-005:** System shall support guest mode without registration  
**REQ-AUTH-006:** System shall implement session management using JWT tokens  
**REQ-AUTH-007:** System shall allow password reset via email  
**REQ-AUTH-008:** System shall log user activities for security audit  

#### 3.1.3 Use Case

```
Use Case: User Registration
Actor: New User
Precondition: User is on registration page
Main Flow:
  1. User enters email and password
  2. System validates input format
  3. System checks if email already exists
  4. System creates account and sends verification email
  5. User verifies email
  6. System activates account
Alternative Flow:
  3a. Email already exists → Show error message
  5a. User doesn't verify → Account remains inactive
Postcondition: User account created and active
```

---

### 3.2 Portfolio Optimization

**Priority:** Critical  
**Status:** Implemented

#### 3.2.1 Description
Core feature that optimizes portfolio allocation using Genetic Algorithm based on user-selected stocks and risk preference.

#### 3.2.2 Functional Requirements

**REQ-OPT-001:** System shall accept 2-15 stock tickers as input  
**REQ-OPT-002:** System shall validate ticker symbols against Yahoo Finance  
**REQ-OPT-003:** System shall fetch minimum 1 year of historical price data  
**REQ-OPT-004:** System shall calculate expected return and risk for each stock  
**REQ-OPT-005:** System shall accept risk aversion parameter (0.0-1.0)  
**REQ-OPT-006:** System shall run Genetic Algorithm with configurable parameters  
**REQ-OPT-007:** System shall enforce diversification constraints (min 5%, max 50% per stock)  
**REQ-OPT-008:** System shall generate optimal portfolio weights summing to 100%  
**REQ-OPT-009:** System shall calculate portfolio metrics (return, risk, fitness, HHI)  
**REQ-OPT-010:** System shall complete optimization within 30 seconds  
**REQ-OPT-011:** System shall save optimization results to database  
**REQ-OPT-012:** System shall support investment amount calculation  

#### 3.2.3 Genetic Algorithm Specifications

**Parameters:**
- Population Size: 150 individuals
- Generations: 200 iterations
- Crossover Rate: 80%
- Mutation Rate: 30%
- Tournament Size: 5
- Elite Count: 10% of population

**Fitness Function:**
```
fitness = expected_return - (risk_aversion × portfolio_risk) - (concentration_penalty × HHI)

Where:
- expected_return = weighted average of stock returns (annualized)
- portfolio_risk = portfolio standard deviation (annualized)
- HHI = Herfindahl-Hirschman Index = Σ(weight_i²)
- concentration_penalty = 0.3 (configurable)
```

**Constraints:**
- Individual weight: 0.05 ≤ w_i ≤ 0.50 (5% to 50%)
- Sum of weights: Σw_i = 1.0 (100%)
- Non-negative weights: w_i ≥ 0

#### 3.2.4 Use Case

```
Use Case: Optimize Portfolio
Actor: Registered User
Precondition: User is logged in, has selected stocks
Main Flow:
  1. User inputs investment amount
  2. User selects 4 stock tickers
  3. User adjusts risk aversion slider to 0.5
  4. User clicks "Run Optimization"
  5. System fetches historical data
  6. System runs Genetic Algorithm
  7. System calculates optimal weights
  8. System displays results dashboard
  9. System saves results to history
Alternative Flow:
  2a. Invalid ticker → Show error and suggestions
  5a. Data unavailable → Show error, suggest alternative
  6a. Optimization fails → Retry with adjusted parameters
Postcondition: Optimal portfolio displayed and saved
```

---

### 3.3 Investment Calculator

**Priority:** High  
**Status:** Implemented

#### 3.3.1 Description
Calculate monetary allocation per stock based on investment amount and optimized weights.

#### 3.3.2 Functional Requirements

**REQ-CALC-001:** System shall accept investment amount input in IDR  
**REQ-CALC-002:** System shall provide quick amount buttons (50M, 100M, 500M)  
**REQ-CALC-003:** System shall calculate allocation: amount × weight per stock  
**REQ-CALC-004:** System shall display results in formatted currency (Rp)  
**REQ-CALC-005:** System shall show total and per-stock allocation in table  
**REQ-CALC-006:** System shall recalculate on amount change  
**REQ-CALC-007:** System shall store investment amount with optimization result  

---

### 3.4 Data Visualization

**Priority:** High  
**Status:** Implemented

#### 3.4.1 Description
Present optimization results through interactive charts and graphs.

#### 3.4.2 Functional Requirements

**REQ-VIZ-001:** System shall display KPI cards (Return, Risk, Fitness)  
**REQ-VIZ-002:** System shall show pie chart of portfolio composition  
**REQ-VIZ-003:** System shall display area chart of GA evolution history  
**REQ-VIZ-004:** System shall show scatter plot of efficient frontier  
**REQ-VIZ-005:** System shall highlight optimal portfolio point  
**REQ-VIZ-006:** System shall provide interactive tooltips on hover  
**REQ-VIZ-007:** System shall use responsive charts (mobile-friendly)  
**REQ-VIZ-008:** System shall support dark mode visualization  

---

### 3.5 History Management

**Priority:** Medium  
**Status:** Implemented

#### 3.5.1 Description
Allow users to save, retrieve, and manage optimization history.

#### 3.5.2 Functional Requirements

**REQ-HIST-001:** System shall auto-save each optimization result  
**REQ-HIST-002:** System shall display history list chronologically  
**REQ-HIST-003:** System shall show preview info (date, tickers, metrics)  
**REQ-HIST-004:** System shall allow loading past optimization  
**REQ-HIST-005:** System shall support individual history deletion  
**REQ-HIST-006:** System shall support bulk delete (clear all)  
**REQ-HIST-007:** System shall confirm before deletion  
**REQ-HIST-008:** System shall separate user and guest history  
**REQ-HIST-009:** System shall limit history to 50 records per user  
**REQ-HIST-010:** System shall auto-delete history older than 1 year  

---

### 3.6 Watchlist Management

**Priority:** Low  
**Status:** Implemented

#### 3.6.1 Description
Personal stock watchlist for quick access to favorite tickers.

#### 3.6.2 Functional Requirements

**REQ-WATCH-001:** System shall allow adding stocks to watchlist  
**REQ-WATCH-002:** System shall sync watchlist across user sessions  
**REQ-WATCH-003:** System shall display watchlist in sidebar  
**REQ-WATCH-004:** System shall allow removing stocks from watchlist  
**REQ-WATCH-005:** System shall limit watchlist to 20 stocks per user  
**REQ-WATCH-006:** System shall require authentication for watchlist  

---

### 3.7 Stock Search

**Priority:** Medium  
**Status:** Implemented

#### 3.7.1 Description
Search and autocomplete functionality for finding stock tickers.

#### 3.7.2 Functional Requirements

**REQ-SEARCH-001:** System shall provide search box with autocomplete  
**REQ-SEARCH-002:** System shall trigger search after 2+ characters  
**REQ-SEARCH-003:** System shall debounce search requests (500ms)  
**REQ-SEARCH-004:** System shall display stock name, ticker, exchange  
**REQ-SEARCH-005:** System shall filter out non-equity instruments  
**REQ-SEARCH-006:** System shall highlight already-selected stocks  
**REQ-SEARCH-007:** System shall limit results to 10 suggestions  
**REQ-SEARCH-008:** System shall support Indonesian (.JK) and US tickers  

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements

**REQ-UI-001:** Interface shall follow Material Design principles  
**REQ-UI-002:** Interface shall be fully responsive (320px-3840px width)  
**REQ-UI-003:** Interface shall support dark mode  
**REQ-UI-004:** Interface shall load within 3 seconds on 3G connection  
**REQ-UI-005:** Interface shall be accessible (WCAG 2.1 Level AA)  

#### 4.1.2 Screen Specifications

**Login/Registration Screen:**
- Email input field with validation
- Password input with show/hide toggle
- "Remember me" checkbox
- Social login buttons (future)
- Link to password reset

**Optimization Page:**
- Investment amount input with currency format
- Stock search with autocomplete dropdown
- Selected stocks chips with remove button
- Risk aversion slider with labels
- "Run Optimization" primary action button
- Results dashboard with 4 sections

**History Sidebar:**
- Collapsible sidebar (320px width)
- History cards with preview info
- Individual delete icon buttons
- "Clear All" button in header
- Refresh button

**Dashboard Components:**
- Investment summary card
- 3 KPI metric cards
- Allocation table (responsive)
- Pie chart (portfolio composition)
- Area chart (GA evolution)
- Scatter plot (efficient frontier)

### 4.2 Hardware Interfaces

**Client Side:**
- No specific hardware requirements beyond standard PC/mobile device
- Minimum: 2GB RAM, dual-core processor
- Recommended: 4GB RAM, quad-core processor

**Server Side:**
- CPU: 2+ cores, 2.0 GHz+
- RAM: 4GB minimum, 8GB recommended
- Storage: 20GB SSD minimum
- Network: 100 Mbps connection

### 4.3 Software Interfaces

#### 4.3.1 Yahoo Finance API

**Interface Type:** RESTful HTTP API  
**Protocol:** HTTPS  
**Data Format:** JSON  
**Endpoints Used:**
- `/v1/finance/search` - Stock search
- `/v1/finance/quote` - Stock quotes
- `/v8/finance/chart` - Historical data

**Error Handling:**
- Retry on timeout (max 3 attempts)
- Fallback to cached data if available
- User-friendly error messages

#### 4.3.2 Supabase API

**Interface Type:** REST API with Supabase Client SDK  
**Protocol:** HTTPS  
**Authentication:** API Key + JWT  
**Data Format:** JSON  

**Services Used:**
- Authentication (Supabase Auth)
- Database (PostgreSQL)
- Storage (future enhancement)

**Tables:**
```sql
- auth.users (managed by Supabase)
- optimization_history
- user_watchlists
```

#### 4.3.3 Python Optimization Engine

**Interface Type:** Process spawn with JSON I/O  
**Protocol:** stdin/stdout  
**Data Format:** JSON  

**Input Structure:**
```json
{
  "tickers": ["BBCA.JK", "TLKM.JK"],
  "risk_aversion": 0.5
}
```

**Output Structure:**
```json
{
  "status": "success",
  "metrics": { ... },
  "composition": [ ... ],
  "history": { ... },
  "efficient_frontier": [ ... ]
}
```

### 4.4 Communication Interfaces

**HTTP/HTTPS:**
- All API communication over HTTPS (TLS 1.2+)
- RESTful API design
- JSON request/response format

**WebSocket (Future):**
- Real-time price updates
- Collaborative features

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**REQ-PERF-001:** System shall complete portfolio optimization within 30 seconds (95th percentile)  
**REQ-PERF-002:** System shall load home page within 2 seconds on 4G connection  
**REQ-PERF-003:** System shall handle 100 concurrent users without degradation  
**REQ-PERF-004:** System shall support 1000 database queries per minute  
**REQ-PERF-005:** API response time shall be < 500ms for 90% of requests  
**REQ-PERF-006:** Charts shall render within 1 second after data load  

### 5.2 Security Requirements

**REQ-SEC-001:** All passwords shall be hashed using bcrypt (cost factor 10+)  
**REQ-SEC-002:** System shall implement HTTPS for all communications  
**REQ-SEC-003:** System shall use JWT with 24-hour expiry for session management  
**REQ-SEC-004:** System shall implement CORS with whitelist  
**REQ-SEC-005:** System shall validate and sanitize all user inputs  
**REQ-SEC-006:** System shall implement rate limiting (10 req/min for optimization)  
**REQ-SEC-007:** System shall log all authentication attempts  
**REQ-SEC-008:** System shall comply with OWASP Top 10 security practices  

### 5.3 Reliability Requirements

**REQ-REL-001:** System shall have 99% uptime (excluding planned maintenance)  
**REQ-REL-002:** System shall handle API failures gracefully with retry logic  
**REQ-REL-003:** System shall backup database daily  
**REQ-REL-004:** System shall implement error logging and monitoring  
**REQ-REL-005:** System shall recover from crashes within 5 minutes  

### 5.4 Availability Requirements

**REQ-AVAIL-001:** System shall be available 24/7 except planned maintenance  
**REQ-AVAIL-002:** Planned maintenance shall be < 2 hours per month  
**REQ-AVAIL-003:** System shall notify users 24 hours before maintenance  
**REQ-AVAIL-004:** System shall implement health check endpoints  

### 5.5 Maintainability Requirements

**REQ-MAINT-001:** Code shall follow ESLint and PEP 8 style guidelines  
**REQ-MAINT-002:** System shall have comprehensive API documentation  
**REQ-MAINT-003:** System shall include unit tests (>70% coverage)  
**REQ-MAINT-004:** System shall use semantic versioning  
**REQ-MAINT-005:** System shall log errors with stack traces  

### 5.6 Portability Requirements

**REQ-PORT-001:** Frontend shall support Chrome, Firefox, Safari, Edge (latest 2 versions)  
**REQ-PORT-002:** Backend shall run on Linux and Windows servers  
**REQ-PORT-003:** System shall support deployment via Docker  
**REQ-PORT-004:** Database migrations shall be version-controlled  

### 5.7 Usability Requirements

**REQ-USE-001:** New users shall complete first optimization within 5 minutes  
**REQ-USE-002:** Interface shall provide helpful error messages  
**REQ-USE-003:** System shall include tooltips for complex features  
**REQ-USE-004:** System shall support keyboard navigation  
**REQ-USE-005:** System shall provide user guide documentation  

---

## 6. System Models

### 6.1 Data Model

**Entity-Relationship Diagram:**

```
┌─────────────────┐         ┌─────────────────────────┐
│     Users       │         │  Optimization_History   │
├─────────────────┤         ├─────────────────────────┤
│ id (PK)         │────────<│ id (PK)                 │
│ email           │    1  n │ user_id (FK)            │
│ password_hash   │         │ session_id              │
│ created_at      │         │ tickers[]               │
│ last_login      │         │ risk_aversion           │
└─────────────────┘         │ result_data (JSON)      │
        │                   │ created_at              │
        │                   └─────────────────────────┘
        │
        │ 1
        │
        │ n
        ▼
┌─────────────────────┐
│  User_Watchlists    │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ symbol              │
│ created_at          │
└─────────────────────┘
```

### 6.2 Use Case Diagram

```
                    Portfolio Optimization System

┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────┐                                             │
│  │  Guest   │                                             │
│  │  User    │─────────[Browse System]                    │
│  └──────────┘    │                                        │
│                  └─────[Run Optimization (Guest Mode)]   │
│                                                            │
│  ┌──────────┐                                             │
│  │Registered│                                             │
│  │  User    │─────────[Register/Login]                   │
│  └──────────┘    │                                        │
│                  ├─────[Optimize Portfolio]               │
│                  ├─────[View History]                     │
│                  ├─────[Manage Watchlist]                 │
│                  ├─────[Calculate Investment]             │
│                  └─────[Export Results]                   │
│                                                            │
│  ┌──────────┐                                             │
│  │  Admin   │─────────[Manage Users]                     │
│  │          │    │                                        │
│  └──────────┘    ├─────[View Analytics]                  │
│                  └─────[Configure System]                 │
│                                                            │
└────────────────────────────────────────────────────────────┘

        │              │              │
        ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │  Yahoo   │  │ Supabase │  │  Python  │
  │ Finance  │  │ Backend  │  │  Engine  │
  └──────────┘  └──────────┘  └──────────┘
```

### 6.3 Sequence Diagram - Portfolio Optimization

```
User    Frontend    API Server    Python Engine    Database    Yahoo API

 │          │            │               │            │            │
 │ Click    │            │               │            │            │
 │─"Optimize"─>          │               │            │            │
 │          │            │               │            │            │
 │          │─POST /optimize─>           │            │            │
 │          │            │               │            │            │
 │          │            │─validate────>│            │            │
 │          │            │               │            │            │
 │          │            │───fetch data──────────────────────────>│
 │          │            │<──────────stock prices────────────────│
 │          │            │               │            │            │
 │          │            │─spawn process->           │            │
 │          │            │               │            │            │
 │          │            │               │──calculate GA──>       │
 │          │            │               │<──optimal weights─     │
 │          │            │               │            │            │
 │          │            │<──JSON result─│            │            │
 │          │            │               │            │            │
 │          │            │───save result─────────────>│            │
 │          │            │<──history_id──────────────│            │
 │          │            │               │            │            │
 │          │<──response─│               │            │            │
 │          │            │               │            │            │
 │<─display─│            │               │            │            │
 │ results  │            │               │            │            │
 │          │            │               │            │            │
```

---

## 7. Appendix

### 7.1 Genetic Algorithm Pseudocode

```python
function optimize_portfolio(tickers, risk_aversion):
    # Initialize
    population = create_random_population(size=150)
    
    for generation in range(200):
        # Evaluate fitness
        fitness_scores = []
        for individual in population:
            return, risk = calculate_metrics(individual)
            concentration = calculate_HHI(individual)
            fitness = return - (risk_aversion × risk) - (0.3 × concentration)
            fitness_scores.append(fitness)
        
        # Selection (Tournament)
        selected = []
        for _ in range(population_size):
            candidates = random.sample(population, k=5)
            winner = max(candidates, key=fitness_function)
            selected.append(winner)
        
        # Crossover
        offspring = []
        for i in range(0, len(selected), 2):
            parent1, parent2 = selected[i], selected[i+1]
            if random() < 0.8:  # crossover rate
                child = crossover(parent1, parent2)
                offspring.append(child)
        
        # Mutation
        for individual in offspring:
            if random() < 0.3:  # mutation rate
                mutate(individual)
        
        # Elitism (keep best 10%)
        elite = get_top_n(population, n=15)
        population = elite + offspring
    
    # Return best individual
    best = max(population, key=fitness_function)
    return best
```

### 7.2 Sample API Requests/Responses

See [API_REFERENCE.md](./API_REFERENCE.md) for detailed examples.

### 7.3 Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- Not defined here

-- Optimization History
CREATE TABLE optimization_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    tickers TEXT[] NOT NULL,
    risk_aversion DECIMAL(3,2) DEFAULT 0.5,
    result_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_risk CHECK (risk_aversion BETWEEN 0 AND 1),
    CONSTRAINT need_identifier CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_history_user ON optimization_history(user_id);
CREATE INDEX idx_history_session ON optimization_history(session_id);
CREATE INDEX idx_history_created ON optimization_history(created_at DESC);

-- User Watchlists
CREATE TABLE user_watchlists (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    symbol TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, symbol)
);

CREATE INDEX idx_watchlist_user ON user_watchlists(user_id);
```

### 7.4 Glossary

**Efficient Frontier:** The set of optimal portfolios that offer the highest expected return for a given level of risk.

**Genetic Algorithm:** A search heuristic inspired by