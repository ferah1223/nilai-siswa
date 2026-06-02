# Pengolahan Nilai Siswa

Sistem manajemen nilai siswa berbasis web. Dibuat untuk tugas Proyek Pembekalan Skema Programmer.

## Stack

- Frontend: Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- Backend: FastAPI + Python 3.12
- Database: SQLite
- Auth: JWT + bcrypt

## Fitur

**Admin**
- CRUD data siswa dan guru
- Kelola semua nilai
- Lihat laporan statistik

**Guru**
- Input dan edit nilai siswa (Tugas, UTS, UAS)
- Lihat rekap nilai per kelas

**Siswa**
- Lihat nilai pribadi
- Cek status kelulusan

## Rumus Nilai

```
Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)
Lulus jika ≥ 70
```

## Cara Jalankan

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 seed.py
python3 -m uvicorn main:app --reload --port 8000
```

Backend jalan di `http://localhost:8000`
Dokumentasi API otomatis di `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend jalan di `http://localhost:3000`

## Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Guru | guru_mtk | guru123 |
| Guru | guru_bindo | guru123 |
| Siswa | siswa_001 - siswa_010 | siswa123 |

## Struktur Project

```
nilai-siswa/
├── backend/
│   ├── main.py           # FastAPI app + semua endpoint
│   ├── models.py         # Class OOP (Siswa, Guru, Nilai, User)
│   ├── functions.py      # Fungsi terstruktur (validasi, hitung, laporan)
│   ├── auth.py           # Autentikasi JWT + role check
│   ├── database.py       # Koneksi SQLite
│   ├── seed.py           # Data awal
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx              # Login
│       │   ├── admin/                # Halaman admin
│       │   ├── guru/                 # Halaman guru
│       │   └── siswa/                # Halaman siswa
│       ├── components/               # Komponen reusable
│       └── lib/                      # API client, auth, types
│
└── README.md
```

## API Endpoint

**Auth**
- `POST /api/login` - Login
- `GET /api/me` - Info user login
- `PUT /api/change-password` - Ganti password

**Siswa** (Admin)
- `GET /api/siswa` - Semua siswa
- `POST /api/siswa` - Tambah siswa
- `PUT /api/siswa/{nis}` - Edit siswa
- `DELETE /api/siswa/{nis}` - Hapus siswa

**Guru** (Admin)
- `GET /api/guru` - Semua guru
- `POST /api/guru` - Tambah guru
- `DELETE /api/guru/{id}` - Hapus guru

**Nilai**
- `GET /api/nilai` - Semua nilai (Admin + Guru)
- `GET /api/nilai/{nis}` - Nilai per siswa
- `POST /api/nilai` - Input/update nilai
- `DELETE /api/nilai/{id}` - Hapus nilai (Admin)

**Laporan**
- `GET /api/laporan` - Statistik lengkap
- `GET /api/laporan/siswa/{nis}` - Laporan per siswa
- `GET /api/status/{nis}` - Status kelulusan

## Database

Pake SQLite, file-nya di `backend/nilai_siswa.db`. Otomatis dibuat waktu pertama kali jalanankan backend.

4 tabel: `users`, `siswa`, `guru`, `nilai`

Mau reset database? Hapus file-nya terus jalankan seed lagi:
```bash
rm backend/nilai_siswa.db
cd backend && python3 seed.py
```

## License

MIT
