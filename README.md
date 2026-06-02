<div align="center">

<!-- Hero Banner -->
<img src="https://img.shields.io/badge/📊_Pengolahan_Nilai_Siswa-2026-blueviolet?style=for-the-badge&labelColor=0f172a&color=7c3aed" alt="Pengolahan Nilai Siswa" />

# 📊 Sistem Pengolahan Nilai Siswa

**Sistem manajemen nilai siswa berbasis web dengan arsitektur modern, OOP, dan role-based access control.**

Dibangun dengan **Next.js 16**, **FastAPI**, dan **SQLite** — responsif, cepat, dan mudah digunakan.

<br>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

<br>

[🚀 Quick Start](#-quick-start) · [📖 API Docs](#-api-documentation) · [🏗️ Arsitektur](#%EF%B8%8F-arsitektur-sistem) · [📋 Fitur](#-fitur-utama)

</div>

---

## 📋 Fitur Utama

### 🔐 Autentikasi & Otorisasi
- **3 Role**: Admin, Guru, Siswa
- **JWT Token** dengan expiry otomatis
- **Role-based Access Control** — setiap role hanya bisa akses fitur yang diizinkan
- **Password hashing** dengan bcrypt

### 👨‍💼 Admin
- ✅ CRUD Data Siswa (tambah, edit, hapus)
- ✅ CRUD Data Guru
- ✅ Kelola semua data nilai
- ✅ Lihat laporan statistik lengkap

### 👨‍🏫 Guru
- ✅ Input nilai siswa (Tugas, UTS, UAS)
- ✅ Update/edit nilai yang sudah diinput
- ✅ Lihat rekap nilai per kelas
- ✅ Statistik rata-rata, tertinggi, terendah

### 👨‍🎓 Siswa
- ✅ Lihat nilai pribadi (semua mata pelajaran)
- ✅ Status kelulusan (Lulus / Tidak Lulus)
- ✅ Detail nilai akhir per mapel

### 📊 Perhitungan Otomatis
- **Rumus**: `Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)`
- **Kelulusan**: `≥ 70 = Lulus` | `< 70 = Tidak Lulus`
- **Validasi**: Semua nilai harus 0-100

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Teknologi | Versi | Keterangan |
|:-----:|:---------:|:-----:|:----------:|
| 🎨 Frontend | Next.js + React | 16.2.7 / 19.2.4 | App Router, SSR |
| 💅 Styling | Tailwind CSS | 4.x | Utility-first CSS |
| 📝 Language | TypeScript | 5.x | Type-safe |
| ⚙️ Backend | FastAPI | 0.136.3 | Async API framework |
| 🐍 Language | Python | 3.12 | OOP + Structured |
| 🗄️ Database | SQLite | 3.x | Zero-config DB |
| 🔑 Auth | JWT (python-jose) | 3.5.0 | Stateless auth |
| 🔒 Hashing | bcrypt | 4.2.1 | Password hashing |

</div>

---

## 🏗️ Arsitektur Sistem

```
nilai-siswa/
├── 📁 backend/                    # FastAPI Backend (Python)
│   ├── main.py                    # App utama + 15+ API endpoints
│   ├── models.py                  # OOP: Siswa, Guru, Nilai, User
│   ├── functions.py               # Structured: validate, hitung, laporan
│   ├── auth.py                    # JWT + role-based access
│   ├── database.py                # SQLite connection + init
│   ├── seed.py                    # Data awal (13 user, 2 guru, 10 siswa)
│   ├── requirements.txt           # Python dependencies
│   └── venv/                      # Virtual environment
│
├── 📁 frontend/                   # Next.js Frontend (TypeScript)
│   └── src/
│       ├── app/
│       │   ├── page.tsx           # 🔐 Login page
│       │   ├── admin/
│       │   │   ├── page.tsx       # 📊 Admin dashboard
│       │   │   ├── siswa/page.tsx # 👥 CRUD siswa
│       │   │   ├── guru/page.tsx  # 👨‍🏫 CRUD guru
│       │   │   ├── nilai/page.tsx # 📝 Kelola nilai
│       │   │   └── laporan/page.tsx # 📈 Laporan
│       │   ├── guru/
│       │   │   ├── page.tsx       # 📊 Guru dashboard
│       │   │   ├── nilai/page.tsx # 📝 Input nilai
│       │   │   └── rekap/page.tsx # 📋 Rekap nilai
│       │   └── siswa/
│       │       ├── page.tsx       # 📊 Siswa dashboard
│       │       ├── nilai/page.tsx # 📝 Lihat nilai
│       │       └── status/page.tsx # ✅ Status kelulusan
│       ├── components/            # 🧩 10 reusable components
│       └── lib/                   # 🔧 API client, auth, types
│
└── README.md                      # 📖 Dokumentasi ini
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10
- **npm** atau **pnpm**

### 1. Clone Repository

```bash
git clone https://github.com/ferah1223/nilai-siswa.git
cd nilai-siswa
```

### 2. Setup Backend

```bash
cd backend

# Buat virtual environment
python3 -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Seed database dengan data awal
python3 seed.py

# Jalankan server
python3 -m uvicorn main:app --reload --port 8000
```

Backend berjalan di **http://localhost:8000**

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend berjalan di **http://localhost:3000**

### 4. Buka Aplikasi

Buka browser → **http://localhost:3000** → Login dengan akun di bawah 👇

---

## 🔑 Akun Default

<div align="center">

| Role | Username | Password | Akses |
|:----:|:--------:|:--------:|:-----:|
| 👨‍💼 Admin | `admin` | `admin123` | Full CRUD siswa, guru, nilai, laporan |
| 👨‍🏫 Guru | `guru_mtk` | `guru123` | Input & rekap nilai Matematika |
| 👨‍🏫 Guru | `guru_bindo` | `guru123` | Input & rekap nilai Bahasa Indonesia |
| 👨‍🎓 Siswa | `siswa_001` | `siswa123` | Lihat nilai & status kelulusan |
| 👨‍🎓 Siswa | `siswa_002` - `siswa_010` | `siswa123` | Lihat nilai & status kelulusan |

</div>

---

## 📖 API Documentation

Backend menyediakan **Swagger UI** otomatis di:

```
http://localhost:8000/docs
```

### Endpoint Utama

#### 🔐 Autentikasi
```http
POST   /api/login              # Login, dapat JWT token
GET    /api/me                  # Info user yang login
PUT    /api/change-password     # Ganti password
```

#### 👥 Siswa (Admin only)
```http
GET    /api/siswa               # Ambil semua siswa
GET    /api/siswa/{nis}         # Ambil siswa by NIS
POST   /api/siswa               # Tambah siswa baru
PUT    /api/siswa/{nis}         # Update data siswa
DELETE /api/siswa/{nis}         # Hapus siswa
```

#### 👨‍🏫 Guru (Admin only)
```http
GET    /api/guru                # Ambil semua guru
POST   /api/guru                # Tambah guru baru
DELETE /api/guru/{id_guru}      # Hapus guru
```

#### 📝 Nilai
```http
GET    /api/nilai               # Semua nilai (Admin + Guru)
GET    /api/nilai/{nis}         # Nilai per siswa
POST   /api/nilai               # Input/update nilai (Admin + Guru)
DELETE /api/nilai/{id}          # Hapus nilai (Admin only)
```

#### 📊 Laporan
```http
GET    /api/laporan             # Statistik lengkap (Admin + Guru)
GET    /api/laporan/siswa/{nis} # Laporan per siswa
GET    /api/status/{nis}        # Status kelulusan
GET    /api/rekap               # Rekap per kelas (Guru)
```

### Contoh Response Login

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "username": "admin",
    "role": "admin",
    "related_id": null
  }
}
```

### Contoh Response Nilai

```json
{
  "siswa": { "nis": "2024001", "nama": "Ahmad Rizki", "kelas": "X-RPL" },
  "nilai": [
    {
      "mata_pelajaran": "Matematika",
      "tugas": 85.0,
      "uts": 78.0,
      "uas": 90.0,
      "nilai_akhir": 85.2,
      "status": "Lulus"
    }
  ],
  "rata_rata": 82.5,
  "total_mapel": 2,
  "lulus": 2,
  "tidak_lulus": 0
}
```

---

## 🧩 Komponen Frontend

| Komponen | Fungsi |
|:--------:|:------:|
| `DashboardLayout` | Layout utama dengan sidebar navigasi |
| `Sidebar` | Navigasi sidebar per role |
| `DataTable` | Tabel data dengan sorting & search |
| `Modal` | Dialog konfirmasi & form |
| `Button` | Tombol dengan variant (primary, danger, outline) |
| `Input` | Form input dengan label & validation |
| `Badge` | Status badge (Lulus/Tidak Lulus) |
| `StatsCard` | Kartu statistik di dashboard |
| `Loading` | Spinner loading state |
| `Toast` | Notifikasi sukses/error |

---

## 🧪 Testing API

### Login sebagai Admin
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### Ambil Semua Siswa
```bash
curl http://localhost:8000/api/siswa \
  -H "Authorization: Bearer <TOKEN>"
```

### Input Nilai Baru
```bash
curl -X POST http://localhost:8000/api/nilai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "siswa_nis": "2024001",
    "mata_pelajaran": "Matematika",
    "tugas": 85,
    "uts": 78,
    "uas": 90
  }'
```

---

## 📐 Konsep Pemrograman

### Object Oriented Programming (OOP)

Sistem ini menggunakan **4 class utama** di `models.py`:

```python
class Siswa:
    """Merepresentasikan data siswa."""
    def __init__(self, nis, nama, kelas): ...
    def get_info(self) -> dict: ...

class Guru:
    """Merepresentasikan data guru."""
    def __init__(self, id_guru, nama_guru, mata_pelajaran): ...
    def get_info(self) -> dict: ...

class Nilai:
    """Merepresentasikan data nilai dengan perhitungan otomatis."""
    BOBOT_TUGAS = 0.30
    BOBOT_UTS = 0.30
    BOBOT_UAS = 0.40
    BATAS_LULUS = 70

    def hitung_akhir(self) -> float: ...
    def get_status(self) -> str: ...

class User:
    """Merepresentasikan data user untuk autentikasi."""
    def is_admin(self) -> bool: ...
    def is_guru(self) -> bool: ...
    def is_siswa(self) -> bool: ...
```

### Pemrograman Terstruktur

Fungsi-fungsi bisnis di `functions.py`:

```python
def validate_nilai(nilai: float) -> bool: ...
def hitung_nilai_akhir(tugas, uts, uas) -> float: ...
def tentukan_status(nilai_akhir: float) -> str: ...
def generate_laporan(siswa_list, nilai_list) -> dict: ...
def generate_rekap_per_kelas(nilai_list) -> list: ...
```

---

## 🔒 Keamanan

- **JWT Token** — Stateless authentication, expired otomatis
- **bcrypt** — Password di-hash sebelum disimpan
- **Role-based Access** — Endpoint dilindungi berdasarkan role
- **CORS** — Hanya origin yang diizinkan yang bisa akses
- **Input Validation** — Semua input divalidasi sebelum diproses
- **SQL Injection Prevention** — Menggunakan parameterized queries

---

## 📄 License

MIT License — bebas digunakan untuk keperluan akademik.

---

<div align="center">

**Dibuat dengan ❤️ untuk tugas Proyek Pembekalan Skema Programmer**

![Made with Next.js](https://img.shields.io/badge/Made_with-Next.js_16-black?style=for-the-badge&logo=next.js)
![Made with FastAPI](https://img.shields.io/badge/Made_with-FastAPI-009688?style=for-the-badge&logo=fastapi)

</div>
