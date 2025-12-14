# 📖 User Guide - Portfolio Optimization System

> Panduan lengkap penggunaan platform optimasi portofolio investasi

---

## 📋 Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Memulai](#memulai)
3. [Fitur Utama](#fitur-utama)
4. [Panduan Step-by-Step](#panduan-step-by-step)
5. [Tips & Best Practices](#tips--best-practices)
6. [FAQ](#faq)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Pendahuluan

### Apa itu Portfolio Optimization System?

Platform ini membantu Anda mengoptimalkan alokasi investasi saham menggunakan **Genetic Algorithm**, sebuah metode kecerdasan buatan yang meniru proses evolusi alami untuk menemukan kombinasi portofolio terbaik.

### Keunggulan

✅ **Otomatis** - Algoritma mencari alokasi optimal untuk Anda  
✅ **Data Real-time** - Menggunakan data pasar terkini dari Yahoo Finance  
✅ **Diversifikasi** - Mencegah konsentrasi berlebih di satu saham  
✅ **Fleksibel** - Sesuaikan profil risiko sesuai preferensi Anda  
✅ **Visual** - Dashboard interaktif dengan grafik yang mudah dipahami  

### Siapa yang Bisa Menggunakan?

- 📈 **Investor Pemula** - Yang ingin memulai investasi dengan strategi yang terukur
- 💼 **Investor Aktif** - Yang ingin mengoptimalkan portofolio existing
- 🎓 **Pelajar/Mahasiswa** - Yang belajar tentang manajemen portofolio
- 🔬 **Peneliti** - Yang tertarik dengan aplikasi Genetic Algorithm

---

## 🚀 Memulai

### 1. Akses Platform

Buka browser dan akses: `http://localhost:5173` (development) atau URL production

### 2. Pilih Mode Penggunaan

#### Mode Guest (Tanpa Login)
- ✅ Langsung bisa digunakan
- ✅ Riwayat tersimpan di sesi browser
- ⚠️ Data hilang jika browser ditutup

#### Mode Login (Direkomendasikan)
- ✅ Riwayat tersimpan permanen
- ✅ Akses dari device manapun
- ✅ Fitur watchlist personal

### 3. Registrasi Akun (Opsional)

**Langkah Registrasi:**

1. Klik tombol **"Sign Up"** di pojok kanan atas
2. Isi form registrasi:
   - Email: Masukkan email valid
   - Password: Minimal 8 karakter
   - Confirm Password: Ketik ulang password
3. Klik **"Create Account"**
4. Cek email untuk verifikasi (jika diperlukan)
5. Login dengan kredensial yang sudah dibuat

**Screenshot:**
```
┌─────────────────────────────────┐
│      Create Account             │
├─────────────────────────────────┤
│ Email    [________________]     │
│ Password [________________]     │
│ Confirm  [________________]     │
│                                 │
│ [Create Account]  [Cancel]      │
└─────────────────────────────────┘
```

---

## 🎯 Fitur Utama

### 1. Portfolio Optimization

Fitur utama untuk mengoptimalkan alokasi investasi Anda.

**Manfaat:**
- Menentukan persentase alokasi optimal per saham
- Memaksimalkan return dengan risiko terkontrol
- Diversifikasi otomatis

### 2. Investment Calculator

Hitung berapa rupiah yang harus dialokasikan per saham.

**Manfaat:**
- Konversi persentase ke nominal uang
- Visualisasi alokasi dana konkret
- Memudahkan eksekusi investasi

### 3. History Management

Simpan dan kelola hasil optimasi sebelumnya.

**Manfaat:**
- Bandingkan berbagai skenario
- Track perubahan strategi
- Export untuk dokumentasi

### 4. Watchlist

Simpan daftar saham favorit untuk akses cepat.

**Manfaat:**
- Tidak perlu search berulang
- Sync antar device (jika login)
- Monitoring saham pilihan

---

## 📝 Panduan Step-by-Step

### Skenario 1: Optimasi Portofolio Pertama Kali

#### Step 1: Input Saldo Investasi

1. Pada halaman **Optimization**, lihat section **"Saldo Investasi"**
2. Masukkan jumlah dana yang ingin diinvestasikan
   - Ketik manual, atau
   - Gunakan quick button: 50 Juta, 100 Juta, 500 Juta

**Contoh:**
```
Saldo Investasi: Rp 100.000.000
```

**Tips:** Mulai dengan modal yang Anda nyaman untuk invest, bukan seluruh tabungan.

---

#### Step 2: Pilih Saham

1. Klik search box **"Cari kode saham"**
2. Ketik nama atau kode saham (minimal 2 karakter)
   - Contoh: "BBCA", "Bank Central Asia", "TLKM"
3. Pilih dari dropdown suggestions
4. Klik **"Tambah"** atau tekan Enter
5. Ulangi untuk menambah saham lain (minimal 2 saham)

**Rekomendasi Awal:**
- 4-6 saham untuk diversifikasi optimal
- Pilih dari sektor berbeda (banking, telco, mining, consumer)

**Contoh Pilihan:**
```
✓ BBCA.JK - Bank Central Asia (Banking)
✓ TLKM.JK - Telkom Indonesia (Telco)
✓ ADRO.JK - Adaro Energy (Mining)
✓ ANTM.JK - Aneka Tambang (Mining)
```

**Menghapus Saham:**
- Hover ke chip saham yang sudah dipilih
- Klik icon ❌ yang muncul

---

#### Step 3: Atur Profil Risiko

1. Geser slider **"Profil Risiko"**
   - **Kiri (0.0)** = Agresif (Return tinggi, risiko tinggi)
   - **Tengah (0.5)** = Moderat (Balance)
   - **Kanan (1.0)** = Konservatif (Return stabil, risiko rendah)

**Panduan Memilih:**

| Profil | Risk Aversion | Cocok untuk |
|--------|---------------|-------------|
| Agresif | 0.0 - 0.3 | Investor muda, horizon panjang |
| Moderat | 0.4 - 0.6 | Investor umum, balance goal |
| Konservatif | 0.7 - 1.0 | Mendekati pensiun, butuh stabil |

**Visualisasi:**
```
Agresif ●━━━━━━━━━━━━━━━━━━━━━━○ Konservatif
        0.0      0.5           1.0
```

---

#### Step 4: Jalankan Optimasi

1. Pastikan minimal 2 saham sudah dipilih
2. Klik tombol **"Jalankan Optimasi"**
3. Tunggu proses (5-15 detik)
   - Loading indicator akan muncul
   - Backend sedang menjalankan Genetic Algorithm

**Proses di Balik Layar:**
```
1. Fetch data historis saham (1-2 tahun terakhir)
2. Hitung expected return & risk per saham
3. Generate 150 portofolio random
4. Evolusi 200 generasi menggunakan GA
5. Pilih portofolio terbaik
6. Simpan ke database
```

---

#### Step 5: Analisis Hasil

Setelah selesai, Anda akan melihat dashboard dengan 4 section:

##### A. Investment Summary Card

Ringkasan investasi Anda:

```
┌────────────────────────────────────────┐
│ 💰 Total Dana Investasi                │
│    Rp 100.000.000                      │
│                                        │
│ Estimasi Return Tahunan: Rp 12.450.000│
│ Return Rate: 12.45%                    │
└────────────────────────────────────────┘
```

**Cara Baca:**
- **Total Dana**: Modal awal investasi
- **Estimasi Return**: Prediksi profit dalam 1 tahun
- **Return Rate**: Persentase keuntungan tahunan

---

##### B. KPI Cards

Tiga metrik utama portofolio:

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📈 Expected  │  │ ⚠️  Risiko   │  │ ⚡ Fitness   │
│    Return    │  │   (Std Dev)  │  │    Score     │
│              │  │              │  │              │
│   12.45%     │  │    8.76%     │  │   0.0807     │
│   /tahun     │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

**Interpretasi:**

1. **Expected Return (12.45%)**
   - Return tahunan yang diharapkan
   - Semakin tinggi = semakin baik
   - Baseline: Deposito ~3-5%, Obligasi ~6-8%

2. **Risiko (8.76%)**
   - Volatilitas/standar deviasi return
   - Semakin rendah = semakin stabil
   - Normal range: 5-15% untuk saham Indonesia

3. **Fitness Score (0.0807)**
   - Skor keseluruhan portofolio
   - Formula: Return - (Risk Aversion × Risk) - Concentration Penalty
   - Semakin tinggi = semakin optimal

---

##### C. Tabel Alokasi Dana

Detail alokasi per saham dalam Rupiah:

```
┌────────────┬────────┬────────────────────┐
│ Saham      │ Bobot  │ Nominal            │
├────────────┼────────┼────────────────────┤
│ ● BBCA.JK  │ 35.00% │ Rp 35.000.000     │
│ ● TLKM.JK  │ 28.00% │ Rp 28.000.000     │
│ ● ADRO.JK  │ 22.00% │ Rp 22.000.000     │
│ ● ANTM.JK  │ 15.00% │ Rp 15.000.000     │
├────────────┼────────┼────────────────────┤
│ TOTAL      │ 100%   │ Rp 100.000.000    │
└────────────┴────────┴────────────────────┘
```

**Cara Eksekusi:**
1. Buka aplikasi sekuritas (Stockbit, Ajaib, dll)
2. Beli sesuai nominal yang tertera
3. Gunakan order type "limit" untuk kontrol harga

**Tips:**
- Round up/down ke lot terdekat (1 lot = 100 lembar)
- Sisakan sedikit cash untuk buffer
- Eksekusi saat market open (09:00-15:50 WIB)

---

##### D. Grafik Visualisasi

**1. Pie Chart - Alokasi Portofolio**

Visual distribusi persentase:

```
        BBCA.JK (35%)
           ╱─────╲
          ╱   ●   ╲
ANTM.JK  │    ●    │  TLKM.JK
(15%)    │  ● ● ● │  (28%)
          ╲   ●   ╱
           ╲─────╱
        ADRO.JK (22%)
```

**Indikator Diversifikasi:**
- ✅ Baik: Tidak ada saham >50%
- ⚠️ Cukup: Ada saham 50-70%
- ❌ Buruk: Ada saham >70%

---

**2. Area Chart - Evolusi Genetic Algorithm**

Menunjukkan bagaimana algoritma belajar:

```
Fitness
  ^
  │     ╱─────────────
  │    ╱
  │   ╱
  │  ╱
  │ ╱
  └─────────────────────> Generation
    1   50   100   150  200
```

**Cara Baca:**
- **Best Fitness** (hijau): Solusi terbaik per generasi
- **Avg Fitness** (abu): Rata-rata populasi

**Tanda Konvergensi Baik:**
- ✅ Kurva naik konsisten
- ✅ Mendatar di akhir (converged)
- ✅ Gap kecil antara best dan average

---

**3. Scatter Plot - Efficient Frontier**

Visualisasi risk-return semua kemungkinan portofolio:

```
Return
  ^
  │        ★ (Optimal)
  │      ● ● ●
  │    ● ● ● ●
  │  ● ● ● ●
  │ ● ● ●
  └──────────────────> Risk
```

**Legenda:**
- ● Titik biru: Random portfolios
- ★ Titik merah: Portofolio optimal Anda

**Cara Baca:**
- Titik optimal harus berada di "garis efisien" (bagian atas kiri)
- Tidak boleh ada banyak titik di atas/kiri titik optimal

---

### Skenario 2: Menyimpan dan Mengelola Riwayat

#### Melihat Riwayat

1. Klik tombol **"Riwayat Optimasi"** (icon jam) di pojok kanan atas
2. Sidebar akan terbuka menampilkan daftar riwayat
3. Klik pada card riwayat untuk memuat ulang

**Info yang Ditampilkan:**
- Tanggal & waktu optimasi
- List saham yang dioptimasi
- Metrics (Return, Risk, Score)

---

#### Menghapus Riwayat

**Hapus Single:**
1. Hover ke card riwayat
2. Klik icon 🗑️ di pojok kanan atas card
3. Data langsung terhapus (no confirmation)

**Hapus Semua:**
1. Klik tombol **"Hapus Semua Riwayat"** di header sidebar
2. Konfirmasi di modal popup
3. Klik **"Ya, Lanjutkan"**

⚠️ **Peringatan:** Tindakan hapus tidak bisa di-undo!

---

### Skenario 3: Menggunakan Watchlist

*Fitur ini hanya tersedia untuk user yang login.*

#### Menambah ke Watchlist

1. Di halaman **Market Overview** atau **Stock Detail**
2. Klik icon ⭐ (star) di samping nama saham
3. Saham otomatis masuk watchlist

#### Melihat Watchlist

1. Klik menu **"Watchlist"** di sidebar
2. Daftar saham favorit akan muncul
3. Klik saham untuk melihat detail

#### Menghapus dari Watchlist

1. Buka halaman Watchlist
2. Klik icon ❌ di samping saham
3. Saham dihapus dari watchlist

---

## 💡 Tips & Best Practices

### Memilih Saham

✅ **DO:**
- Pilih 4-6 saham untuk diversifikasi optimal
- Mix sektor berbeda (finance, tech, commodity)
- Prioritas saham blue chip (kapitalisasi besar)
- Pastikan likuiditas tinggi (volume trading besar)

❌ **DON'T:**
- Jangan pilih <2 saham (tidak terdiversifikasi)
- Jangan pilih >10 saham (over-diversification)
- Hindari saham delisting/suspend
- Jangan semua saham dari 1 sektor

---

### Mengatur Risk Aversion

**Pertimbangkan:**

1. **Usia & Horizon Investasi**
   - <30 tahun: Bisa lebih agresif (0.2-0.4)
   - 30-50 tahun: Moderat (0.4-0.6)
   - >50 tahun: Konservatif (0.6-0.8)

2. **Tujuan Investasi**
   - Pensiun: Konservatif
   - Dana pendidikan: Moderat
   - Growth: Agresif

3. **Pengalaman**
   - Pemula: Mulai dari konservatif
   - Expert: Bisa sesuaikan sendiri

---

### Interpretasi Hasil

**Return 10-15% per tahun:**
- ✅ Excellent untuk pasar Indonesia
- Baseline: IHSG return ~7-10%

**Risk 8-12%:**
- ✅ Normal untuk portfolio saham
- < 8%: Sangat stabil
- > 15%: Terlalu volatile

**Concentration (HHI):**
- ✅ 0.20-0.35: Well diversified
- ⚠️ 0.35-0.50: Cukup terkonsentrasi
- ❌ >0.50: Over concentrated

---

### Re-balancing

**Kapan perlu re-optimize?**

1. **Perubahan Harga Signifikan** (>20%)
2. **Setiap 3-6 bulan** (maintenance rutin)
3. **Ada saham baru yang menarik**
4. **Tujuan investasi berubah**

**Cara Re-balance:**
1. Load riwayat lama dari sidebar
2. Tambah/kurangi saham jika perlu
3. Sesuaikan risk aversion
4. Jalankan optimasi ulang
5. Bandingkan hasil dengan portfolio lama

---

## ❓ FAQ

### Umum

**Q: Apakah hasil optimasi guaranteed profit?**  
A: Tidak. Hasil adalah prediksi berdasarkan data historis. Actual return bisa berbeda karena kondisi pasar berubah.

**Q: Berapa lama data historis yang digunakan?**  
A: Default 2 tahun terakhir (dapat dikonfigurasi di backend).

**Q: Apakah bisa untuk crypto atau forex?**  
A: Saat ini hanya mendukung saham yang tersedia di Yahoo Finance. Crypto/forex belum didukung.

---

### Teknis

**Q: Kenapa optimasi lama (>30 detik)?**  
A: Kemungkinan:
- Server overload
- Banyak saham dipilih (>8)
- Data saham sulit diakses
- Koneksi internet lambat

**Q: Error "No data fetched"?**  
A: Ticker salah atau data tidak tersedia. Coba:
- Periksa ejaan ticker
- Gunakan format Indonesia (.JK) atau US tanpa suffix
- Coba saham lain

**Q: Hasil optimasi 100% di satu saham?**  
A: Ini bug yang sudah diperbaiki. Pastikan menggunakan `optimizer.py` versi terbaru dengan constraint diversifikasi.

---

### Akun & Data

**Q: Apakah data saya aman?**  
A: Ya. Data tersimpan di Supabase dengan enkripsi. Password di-hash, tidak disimpan plain text.

**Q: Bisa akses dari HP?**  
A: Ya, interface responsive. Tapi untuk pengalaman terbaik gunakan desktop/tablet.

**Q: Bagaimana cara export hasil?**  
A: Saat ini belum ada fitur export. Bisa screenshot atau copy manual. Export PDF/Excel akan ditambahkan di versi berikutnya.

---

## 🔧 Troubleshooting

### Problem: Tidak Bisa Login

**Solusi:**
1. Cek email & password yang benar
2. Cek koneksi internet
3. Clear browser cache & cookies
4. Coba browser lain
5. Reset password via "Forgot Password"

---

### Problem: Hasil Optimasi Aneh

**Cek:**
1. Apakah ticker saham benar?
2. Apakah semua saham punya data?
3. Apakah risk aversion terlalu ekstrem?

**Solusi:**
1. Hapus saham yang data-nya tidak lengkap
2. Gunakan risk aversion moderat (0.4-0.6)
3. Pilih saham blue chip yang likuid

---

### Problem: History Tidak Tersimpan

**Penyebab:**
- Mode guest + browser closed
- Error database
- Not logged in (untuk permanent save)

**Solusi:**
1. Login untuk simpan permanen
2. Cek koneksi database di console
3. Contact admin jika error persist

---

### Problem: Chart Tidak Muncul

**Solusi:**
1. Refresh halaman (F5)
2. Disable ad-blocker
3. Cek browser console untuk error
4. Update browser ke versi terbaru

---

## 📞 Bantuan Lebih Lanjut

**Email Support:** support@portfoliooptimizer.com  
**Documentation:** https://docs.portfoliooptimizer.com  
**GitHub Issues:** https://github.com/username/portfolio-optimizer/issues

---

**Terima kasih telah menggunakan Portfolio Optimization System! 🚀**  
Happy Investing! 📈