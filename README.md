<div align="center">

# 📊 Sistem Pengolahan Nilai Siswa

Manajemen nilai siswa berbasis web. Full-stack, OOP + structured programming, role-based auth.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?logo=fastapi&style=flat-square)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&style=flat-square)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&style=flat-square)

[Quick Start](#cara-jalankan) · [API Docs](#api-endpoint) · [Arsitektur](#struktur-project)

</div>

---

## Tentang

Sistem ini dibuat untuk mengelola data nilai siswa secara online. Ada 3 role yang masing-masing punya akses berbeda:

- **Admin** — kelola data siswa, guru, dan semua nilai
- **Guru** — input/edit nilai siswa, lihat rekap per kelas
- **Siswa** — lihat nilai pribadi dan status kelulusan

Nilai akhir dihitung otomatis pake rumus:

```
Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)
Lulus kalau ≥ 70
```

## Tech Stack

| Layer | Teknologi | Versi |
|-------|-----------|-------|
| Frontend | Next.js + React | 16.2.7 / 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Language | TypeScript | 5.x |
| Backend | FastAPI | 0.136.3 |
| Language | Python | 3.12 |
| Database | SQLite | 3.x |
| Auth | JWT (python-jose) | 3.5.0 |
| Hashing | bcrypt | 4.2.1 |

## Fitur

### Autentikasi
- Login dengan JWT token
- Password di-hash pake bcrypt
- Setiap endpoint dilindungi berdasarkan role

### Admin
- Tambah, edit, hapus data siswa
- Tambah, hapus data guru
- Kelola semua data nilai
- Lihat laporan statistik (rata-rata, tertinggi, terendah, jumlah lulus/tidak lulus)

### Guru
- Input nilai siswa (Tugas, UTS, UAS) — otomatis hitung nilai akhir
- Edit nilai yang sudah ada
- Lihat rekap nilai per kelas

### Siswa
- Lihat semua nilai per mata pelajaran
- Cek status kelulusan (Lulus / Tidak Lulus)

## Cara Jalankan

**Prasyarat:** Node.js ≥ 18, Python ≥ 3.10

### 1. Clone

```bash
git clone https://github.com/ferah1223/nilai-siswa.git
cd nilai-siswa
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 seed.py
python3 -m uvicorn main:app --reload --port 8000
```

Backend jalan di `http://localhost:8000`
Swagger docs di `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000`

### 4. Login

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Guru | `guru_mtk` | `guru123` |
| Guru | `guru_bindo` | `guru123` |
| Siswa | `siswa_001` - `siswa_010` | `siswa123` |

## Struktur Project

```
nilai-siswa/
├── backend/
│   ├── main.py           # FastAPI app + 15+ endpoint
│   ├── models.py         # Class OOP: Siswa, Guru, Nilai, User
│   ├── functions.py      # Fungsi terstruktur: validasi, hitung, laporan
│   ├── auth.py           # JWT + role-based access control
│   ├── database.py       # Koneksi SQLite + init tabel
│   ├── seed.py           # Data awal (13 user, 2 guru, 10 siswa, 20 nilai)
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Login
│       │   ├── admin/                # Dashboard, CRUD siswa/guru, nilai, laporan
│       │   ├── guru/                 # Dashboard, input nilai, rekap
│       │   └── siswa/                # Dashboard, nilai, status kelulusan
│       ├── components/               # 10 reusable components
│       └── lib/                      # API client, auth context, types
│
└── README.md
```

## API Endpoint

Semua endpoint butuh JWT token di header `Authorization: Bearer <token>`, kecuali `/api/login`.

### Auth

```
POST   /api/login              Login, dapat token
GET    /api/me                  Info user yang sedang login
PUT    /api/change-password     Ganti password
```

### Siswa (Admin only)

```
GET    /api/siswa               Ambil semua siswa
GET    /api/siswa/{nis}         Ambil siswa by NIS
POST   /api/siswa               Tambah siswa baru
PUT    /api/siswa/{nis}         Update data siswa
DELETE /api/siswa/{nis}         Hapus siswa + nilai terkait
```

### Guru (Admin only)

```
GET    /api/guru                Ambil semua guru
POST   /api/guru                Tambah guru baru
DELETE /api/guru/{id_guru}      Hapus guru
```

### Nilai

```
GET    /api/nilai               Semua nilai dengan info siswa (Admin + Guru)
GET    /api/nilai/{nis}         Nilai berdasarkan NIS siswa
POST   /api/nilai               Input atau update nilai (Admin + Guru)
DELETE /api/nilai/{id}          Hapus data nilai (Admin only)
```

### Laporan

```
GET    /api/laporan             Statistik lengkap + rekap per kelas (Admin + Guru)
GET    /api/laporan/siswa/{nis} Laporan detail per siswa
GET    /api/status/{nis}        Status kelulusan siswa
GET    /api/rekap               Rekap nilai per kelas (Guru)
```

## Database

SQLite, file-nya ada di `backend/nilai_siswa.db`. Dibuat otomatis waktu pertama kali jalanin backend.

4 tabel:
- `users` — data login (username, password hash, role)
- `siswa` — data siswa (NIS, nama, kelas)
- `guru` — data guru (ID, nama, mata pelajaran)
- `nilai` — data nilai (tugas, uts, uas, nilai_akhir, status)

Reset database:
```bash
rm backend/nilai_siswa.db
cd backend && python3 seed.py
```

## Konsep Pemrograman

### OOP (models.py)

4 class utama: `Siswa`, `Guru`, `Nilai`, `User`. Masing-masing punya atribut dan method sendiri.

```python
class Nilai:
    BOBOT_TUGAS = 0.30
    BOBOT_UTS = 0.30
    BOBOT_UAS = 0.40
    BATAS_LULUS = 70

    def hitung_akhir(self) -> float:
        return round((0.30 * self.tugas) + (0.30 * self.uts) + (0.40 * self.uas), 2)

    def get_status(self) -> str:
        return "Lulus" if self.hitung_akhir() >= 70 else "Tidak Lulus"
```

### Structured Programming (functions.py)

Fungsi-fungsi terpisah untuk validasi, perhitungan, dan laporan:

```python
def validate_nilai(nilai: float) -> bool
def hitung_nilai_akhir(tugas, uts, uas) -> float
def tentukan_status(nilai_akhir) -> str
def generate_laporan(siswa_list, nilai_list) -> dict
def generate_rekap_per_kelas(nilai_list) -> list
```

## License

MIT
