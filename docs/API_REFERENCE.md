# 📡 API Reference Documentation

> Complete API documentation for Portfolio Optimization System

**Base URL**: `http://localhost:5000/api`

**Version**: 1.0.0

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Optimization Endpoints](#optimization-endpoints)
- [History Endpoints](#history-endpoints)
- [Watchlist Endpoints](#watchlist-endpoints)
- [Proxy Endpoints](#proxy-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

### Authentication Methods

1. **Supabase Auth** (Recommended for logged-in users)
   - Uses JWT tokens
   - Managed by frontend AuthContext

2. **Session-based** (Guest users)
   - Uses `guest_session_id` stored in localStorage
   - Automatically generated on first visit

### Headers

```http
Content-Type: application/json
```

---

## 🎯 Optimization Endpoints

### 1. Run Portfolio Optimization

Optimizes portfolio allocation using Genetic Algorithm.

**Endpoint**: `POST /api/optimize`

**Request Body**:
```json
{
  "tickers": ["BBCA.JK", "TLKM.JK", "ADRO.JK", "ANTM.JK"],
  "riskAversion": 0.5,
  "sessionId": "guest_abc123",
  "userId": "uuid-user-id"
}
```

**Parameters**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| tickers | array | Yes | Array of stock ticker symbols |
| riskAversion | number | Yes | Risk aversion parameter (0-1). 0=aggressive, 1=conservative |
| sessionId | string | Yes* | Guest session ID (*required if userId is null) |
| userId | string | No | Authenticated user ID (from Supabase) |

**Success Response** (200 OK):
```json
{
  "status": "success",
  "history_id": 123,
  "metrics": {
    "expected_return": 0.1245,
    "risk": 0.0876,
    "fitness": 0.0807,
    "concentration": 0.2834
  },
  "composition": [
    {
      "ticker": "BBCA.JK",
      "weight": 0.35,
      "percentage": "35.00%"
    },
    {
      "ticker": "TLKM.JK",
      "weight": 0.28,
      "percentage": "28.00%"
    },
    {
      "ticker": "ADRO.JK",
      "weight": 0.22,
      "percentage": "22.00%"
    },
    {
      "ticker": "ANTM.JK",
      "weight": 0.15,
      "percentage": "15.00%"
    }
  ],
  "history": {
    "generation": [1, 2, 3, ..., 200],
    "best_fitness": [0.045, 0.067, 0.081, ..., 0.0807],
    "avg_fitness": [0.032, 0.048, 0.059, ..., 0.0723]
  },
  "efficient_frontier": [
    {
      "return": 0.105,
      "risk": 0.092,
      "is_optimal": false
    },
    {
      "return": 0.1245,
      "risk": 0.0876,
      "is_optimal": true
    }
  ]
}
```

**Error Responses**:

**400 Bad Request** - Invalid input
```json
{
  "error": "Ticker saham wajib diisi."
}
```

**500 Internal Server Error** - Engine error
```json
{
  "error": "Engine Error",
  "details": "Python process stderr output"
}
```

**Example Usage**:
```javascript
const response = await axios.post('http://localhost:5000/api/optimize', {
  tickers: ['BBCA.JK', 'TLKM.JK'],
  riskAversion: 0.5,
  sessionId: getGuestId(),
  userId: user?.id
});

console.log(response.data);
```

---

## 📜 History Endpoints

### 2. Get Optimization History

Retrieves user's optimization history.

**Endpoint**: `GET /api/history`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | No* | User ID (for logged-in users) |
| sessionId | string | No* | Session ID (for guest users) |

*At least one parameter is required

**Success Response** (200 OK):
```json
[
  {
    "id": 123,
    "created_at": "2024-01-15T10:30:00Z",
    "tickers": ["BBCA.JK", "TLKM.JK", "ADRO.JK"],
    "risk_aversion": 0.5,
    "result_data": {
      "status": "success",
      "metrics": { ... },
      "composition": [ ... ],
      "investmentBalance": 100000000
    }
  },
  ...
]
```

**Example Usage**:
```javascript
// For logged-in user
const history = await axios.get('http://localhost:5000/api/history', {
  params: { userId: user.id }
});

// For guest user
const history = await axios.get('http://localhost:5000/api/history', {
  params: { sessionId: getGuestId() }
});
```

---

### 3. Delete Single History

Deletes a specific optimization history record.

**Endpoint**: `DELETE /api/history/:id`

**URL Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | History record ID |

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | No* | User ID |
| sessionId | string | No* | Session ID |

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "History deleted successfully"
}
```

**Error Responses**:

**400 Bad Request**:
```json
{
  "error": "User ID or Session ID required"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to delete history"
}
```

**Example Usage**:
```javascript
await axios.delete(`http://localhost:5000/api/history/${historyId}`, {
  params: { userId: user?.id || sessionId: getGuestId() }
});
```

---

### 4. Clear All History

Deletes all optimization history for a user/session.

**Endpoint**: `DELETE /api/history/clear-all`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | No* | User ID |
| sessionId | string | No* | Session ID |

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "All history cleared successfully",
  "deletedCount": 15
}
```

**Example Usage**:
```javascript
await axios.delete('http://localhost:5000/api/history/clear-all', {
  params: { userId: user.id }
});
```

---

## 📌 Watchlist Endpoints

### 5. Get User Watchlist

Retrieves user's watchlist.

**Endpoint**: `GET /api/watchlist`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ID |

**Success Response** (200 OK):
```json
["BBCA.JK", "TLKM.JK", "ADRO.JK", "ANTM.JK"]
```

**Example Usage**:
```javascript
const watchlist = await axios.get('http://localhost:5000/api/watchlist', {
  params: { userId: user.id }
});
```

---

### 6. Sync Watchlist

Syncs user's watchlist (replaces all existing).

**Endpoint**: `POST /api/watchlist/sync`

**Request Body**:
```json
{
  "userId": "uuid-user-id",
  "symbols": ["BBCA.JK", "TLKM.JK", "ADRO.JK"]
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "count": 3
}
```

**Example Usage**:
```javascript
await axios.post('http://localhost:5000/api/watchlist/sync', {
  userId: user.id,
  symbols: ['BBCA.JK', 'TLKM.JK']
});
```

---

## 🔍 Proxy Endpoints

### 7. Search Stocks

Search for stock tickers (proxied to Yahoo Finance).

**Endpoint**: `GET /api/proxy-search`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |

**Success Response** (200 OK):
```json
{
  "quotes": [
    {
      "symbol": "BBCA.JK",
      "shortname": "Bank Central Asia",
      "quoteType": "EQUITY",
      "exchDisp": "Jakarta"
    }
  ]
}
```

---

### 8. Get Stock Quotes

Get detailed quote information for stocks.

**Endpoint**: `GET /api/proxy-quote`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| symbols | string | Yes | Comma-separated ticker symbols |

**Success Response** (200 OK):
```json
{
  "quoteResponse": {
    "result": [
      {
        "symbol": "BBCA.JK",
        "regularMarketPrice": 9200,
        "regularMarketChange": 75,
        "regularMarketChangePercent": 0.82,
        "marketCap": 1234567890000
      }
    ]
  }
}
```

---

### 9. Get Stock Chart Data

Get historical price data for charting.

**Endpoint**: `GET /api/proxy-chart`

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| symbol | string | Yes | - | Stock ticker symbol |
| range | string | No | 1mo | Time range (1d, 5d, 1mo, 3mo, 6mo, 1y, 5y) |
| interval | string | No | 1d | Data interval (1m, 5m, 15m, 1h, 1d, 1wk, 1mo) |

**Success Response** (200 OK):
```json
{
  "chart": {
    "result": [
      {
        "meta": {
          "symbol": "BBCA.JK",
          "regularMarketPrice": 9200
        },
        "timestamp": [1640995200, 1641081600, ...],
        "indicators": {
          "quote": [
            {
              "open": [9150, 9175, ...],
              "high": [9250, 9300, ...],
              "low": [9100, 9150, ...],
              "close": [9200, 9275, ...],
              "volume": [12000000, 15000000, ...]
            }
          ]
        }
      }
    ]
  }
}
```

---

## 🚨 Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

### Common Error Codes

| Code | Description |
|------|-------------|
| INVALID_TICKERS | Ticker array is empty or invalid |
| ENGINE_ERROR | Python optimization engine failed |
| DB_ERROR | Database operation failed |
| AUTH_ERROR | Authentication/authorization failed |

---

## ⏱ Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting in production:

**Recommended Limits**:
- Optimization: 10 requests per minute per user
- History: 30 requests per minute per user
- Search: 60 requests per minute per user

**Implementation** (Future):
```javascript
const rateLimit = require('express-rate-limit');

const optimizeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many optimization requests'
});

app.use('/api/optimize', optimizeLimiter);
```

---

## 🔄 Versioning

API versioning strategy: URL-based versioning

**Current**: `/api/...` (v1 implicit)

**Future**: `/api/v2/...`

---

## 📊 Response Times

Expected response times (95th percentile):

| Endpoint | Response Time |
|----------|---------------|
| POST /optimize | 5-15 seconds |
| GET /history | < 500ms |
| DELETE /history/:id | < 200ms |
| GET /watchlist | < 300ms |
| GET /proxy-search | < 1 second |

---

## 🧪 Testing Examples

### cURL Examples

**Optimize Portfolio**:
```bash
curl -X POST http://localhost:5000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "tickers": ["BBCA.JK", "TLKM.JK"],
    "riskAversion": 0.5,
    "sessionId": "guest_test123"
  }'
```

**Get History**:
```bash
curl "http://localhost:5000/api/history?sessionId=guest_test123"
```

**Delete History**:
```bash
curl -X DELETE "http://localhost:5000/api/history/123?sessionId=guest_test123"
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Numeric values use decimal notation (not scientific)
3. Portfolio weights always sum to 1.0 (100%)
4. Risk aversion parameter affects fitness calculation: `fitness = return - (risk_aversion × risk) - (concentration_penalty × HHI)`

---

## 🔗 Related Documentation

- [User Guide](./USER_GUIDE.md)
- [SRS Document](./SRS.md)
- [README](../README.md)

---

**Last Updated**: January 2024  
**Maintained By**: Development Team