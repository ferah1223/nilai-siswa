# Sistem Pengolahan Nilai Siswa

Aplikasi pengelolaan data nilai siswa berbasis web. Dibangun untuk memenuhi tugas Pembekalan Skema Programmer LSP.

## Fitur

- **Login berdasarkan Role** (Admin, Guru, Siswa)
- **CRUD Data Siswa** (Admin)
- **CRUD Data Guru** (Admin)
- **Input & Kelola Nilai** (Admin, Guru)
- **Perhitungan Nilai Akhir Otomatis**
- **Status Kelulusan** (Lulus/Tidak Lulus)
- **Laporan & Statistik** (rekap per kelas)
- **Dashboard per Role**

## Rumus Nilai Akhir

```
Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)
Lulus: ≥ 70
```

## Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, TypeScript |
| Backend | FastAPI, Python 3.12 |
| Database | SQLite |
| Auth | JWT (python-jose), bcrypt |

## Arsitektur Program

### Pemrograman Terstruktur (`functions.py`)
- `validate_nilai()` — Validasi rentang nilai 0-100
- `hitung_nilai_akhir()` — Hitung dengan rumus bobot
- `tentukan_status()` — Tentukan Lulus/Tidak Lulus
- `generate_laporan()` — Buat statistik laporan
- `format_nilai()` — Format tampilan nilai

### Pemrograman Berorientasi Objek (`models.py`)
- `class Siswa` — Data siswa (NIS, nama, kelas)
- `class Guru` — Data guru (ID, nama, mata pelajaran)
- `class Nilai` — Data nilai dengan method `hitung_akhir()` dan `get_status()`
- `class User` — Data autentikasi dengan role checking

## Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Guru | guru_mtk | guru123 |
| Guru | guru_bindo | guru123 |
| Siswa | siswa_001 | siswa123 |
| Siswa | siswa_002 | siswa123 |

## Cara Menjalankan

### Backend
```bash
cd backend
pip install -r requirements.txt
python3 main.py
# Server berjalan di http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Aplikasi berjalan di http://localhost:3000
```

## Struktur Database

### Tabel `siswa`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| nis | TEXT (PK) | Nomor Induk Siswa |
| nama | TEXT | Nama lengkap |
| kelas | TEXT | Kelas siswa |

### Tabel `guru`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id_guru | TEXT (PK) | ID unik guru |
| nama_guru | TEXT | Nama lengkap |
| mata_pelajaran | TEXT | Mata pelajaran |

### Tabel `nilai`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INTEGER (PK) | Auto increment |
| siswa_nis | TEXT (FK) | NIS siswa |
| mata_pelajaran | TEXT | Mata pelajaran |
| tugas | REAL | Nilai tugas (0-100) |
| uts | REAL | Nilai UTS (0-100) |
| uas | REAL | Nilai UAS (0-100) |
| nilai_akhir | REAL | Hasil perhitungan |
| status | TEXT | Lulus/Tidak Lulus |

### Tabel `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | INTEGER (PK) | Auto increment |
| username | TEXT (UNIQUE) | Username login |
| password_hash | TEXT | Password bcrypt |
| role | TEXT | admin/guru/siswa |
| related_id | TEXT | NIS atau ID Guru |
