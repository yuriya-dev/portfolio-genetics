# Panduan Deployment Aplikasi Portfolio Optimization

Dokumen ini menjelaskan langkah-langkah untuk melakukan deployment aplikasi ke lingkungan produksi.

## Arsitektur

* **Frontend**: React (Vite) → Deployed di **Vercel**
* **Backend**: Python (Flask / FastAPI) → Deployed di **Render**
* **Database & Auth**: **Supabase**

---

## 1. Persiapan (Prerequisites)

Sebelum memulai, pastikan:

* Kode sudah di-*push* ke repository **GitHub**
* Struktur folder proyek sudah jelas, misalnya:

  * `/frontend` dan `/backend`, **atau**
  * digabung dalam satu repo dengan *path* yang benar

---

## 2. Deployment Backend (Render)

Backend dideploy terlebih dahulu untuk mendapatkan URL API yang akan digunakan oleh Frontend.

### Langkah-langkah

1. Buka **[https://dashboard.render.com](https://dashboard.render.com)**
2. Klik **New + → Web Service**
3. Hubungkan repository GitHub Anda

### Konfigurasi Service

* **Name**: `portfolio-api` (atau nama lain)
* **Runtime**: Python 3 (sesuaikan jika menggunakan Node.js)
* **Build Command**:

  ```bash
  pip install -r requirements.txt
  ```
* **Start Command**:

  ```bash
  gunicorn app:app
  ```

  atau

  ```bash
  uvicorn optimizer:app --host 0.0.0.0 --port 10000
  ```

### Environment Variables (Penting)

Masuk ke tab **Environment** dan tambahkan:

* `SUPABASE_URL` = URL dari dashboard Supabase
* `SUPABASE_KEY` = Service Role Key / Anon Key (sesuai kebutuhan backend)
* `PORT` = `10000` (default Render)

Klik **Create Web Service** dan tunggu hingga status **Live**.

Salin URL Backend Anda, contoh:

```
https://portfolio-api.onrender.com
```

---

## 3. Deployment Frontend (Vercel)

### Langkah-langkah

1. Buka **[https://vercel.com](https://vercel.com)**
2. Klik **Add New… → Project**
3. Import repository GitHub yang sama

### Konfigurasi Project

* **Framework Preset**: Vite
* **Root Directory**:

  * `./` jika React ada di root
  * `frontend` jika ada di subfolder

### Environment Variables

Masukkan variabel dari file `.env` lokal Anda:

* `VITE_SUPABASE_URL` = URL Supabase
* `VITE_SUPABASE_ANON_KEY` = Anon Key Supabase
* `VITE_API_URL` = URL Backend Render

Contoh:

```
VITE_API_URL=https://portfolio-api.onrender.com
```

Klik **Deploy** dan tunggu hingga selesai.

Vercel akan memberikan domain, contoh:

```
https://portfolio-app.vercel.app
```

---

## 4. Konfigurasi Akhir (Menghubungkan Semuanya)

### A. Update CORS di Backend (Render)

Agar Frontend dapat mengakses Backend, tambahkan domain Vercel ke konfigurasi CORS.

**Contoh (FastAPI / Flask):**

```python
origins = [
    "http://localhost:5173",
    "https://portfolio-app.vercel.app"
]
```

Lakukan **commit & push** ke GitHub. Render akan melakukan *auto-deploy* ulang.

---

### B. Update Supabase Auth Settings

Agar autentikasi berjalan di produksi:

1. Buka **Supabase Dashboard**
2. Masuk ke **Authentication → URL Configuration**

Isi:

* **Site URL**:

  ```
  https://portfolio-app.vercel.app
  ```
* **Redirect URLs**:

  ```
  https://portfolio-app.vercel.app/**
  ```

---

## 5. Troubleshooting Umum

### ❌ Error: "SupabaseUrl is required" di Vercel

**Penyebab**:

* Environment variable belum terbaca saat build

**Solusi**:

* Cek **Settings → Environment Variables** di Vercel
* Pastikan semua variabel diawali `VITE_`
* Lakukan **Redeploy** setelah update variabel

---

### ❌ API Error / Network Error

**Penyebab**:

* Konfigurasi CORS salah
* URL API tidak valid

**Solusi**:

* Cek **Console Browser (F12)**
* Jika error CORS → periksa langkah **4A**
* Jika `404` → pastikan `VITE_API_URL` tidak memiliki `/` berlebih di akhir

---

✅ Deployment Frontend, Backend, dan Supabase kini sudah terhubung dengan benar.
