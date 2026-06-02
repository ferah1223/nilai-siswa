"""
main.py — FastAPI Application
Aplikasi utama sistem pengolahan nilai siswa.
Menggunakan pemrograman terstruktur (functions.py) dan OOP (models.py).
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from database import get_connection, init_database
from models import Siswa, Guru, Nilai
from functions import (
    validate_semua_nilai, hitung_nilai_akhir, tentukan_status,
    generate_laporan, generate_rekap_per_kelas, format_nilai,
)
from auth import (
    authenticate_user, create_access_token, get_current_user,
    require_role, hash_password,
)
from seed import seed_data

# ============================================================
# INISIALISASI APP
# ============================================================

app = FastAPI(
    title="Sistem Pengolahan Nilai Siswa",
    description="Aplikasi pengelolaan data nilai siswa berbasis web",
    version="1.0.0",
)

# CORS: Izinkan frontend mengakses API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Event: Jalankan saat aplikasi dimulai
@app.on_event("startup")
def startup():
    """Inisialisasi database dan isi data awal saat aplikasi dimulai."""
    init_database()
    seed_data()


# ============================================================
# PYDANTIC MODELS (untuk validasi request body)
# ============================================================

class LoginRequest(BaseModel):
    username: str
    password: str


class SiswaCreate(BaseModel):
    nis: str
    nama: str
    kelas: str


class SiswaUpdate(BaseModel):
    nama: Optional[str] = None
    kelas: Optional[str] = None


class GuruCreate(BaseModel):
    id_guru: str
    nama_guru: str
    mata_pelajaran: str


class NilaiCreate(BaseModel):
    siswa_nis: str
    mata_pelajaran: str
    tugas: float
    uts: float
    uas: float


class NilaiUpdate(BaseModel):
    tugas: Optional[float] = None
    uts: Optional[float] = None
    uas: Optional[float] = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


# ============================================================
# ROUTE: AUTENTIKASI
# ============================================================

@app.post("/api/login")
def login(req: LoginRequest):
    """
    Login dan dapatkan JWT token.
    
    - **username**: Username pengguna
    - **password**: Password pengguna
    
    Mengembalikan token dan informasi user.
    """
    user = authenticate_user(req.username, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Username atau password salah")
    
    token = create_access_token({"sub": user["username"], "role": user["role"]})
    
    return {
        "token": token,
        "user": {
            "username": user["username"],
            "role": user["role"],
            "related_id": user["related_id"],
        },
    }


@app.get("/api/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Ambil informasi user yang sedang login."""
    return {
        "username": current_user["username"],
        "role": current_user["role"],
        "related_id": current_user["related_id"],
    }


@app.put("/api/change-password")
def change_password(req: PasswordChange, current_user: dict = Depends(get_current_user)):
    """Ganti password user yang sedang login."""
    from auth import verify_password
    if not verify_password(req.old_password, current_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Password lama salah")
    
    conn = get_connection()
    conn.execute(
        "UPDATE users SET password_hash = ? WHERE username = ?",
        (hash_password(req.new_password), current_user["username"])
    )
    conn.commit()
    conn.close()
    return {"message": "Password berhasil diubah"}


# ============================================================
# ROUTE: DATA SISWA (CRUD)
# ============================================================

@app.get("/api/siswa")
def get_all_siswa(current_user: dict = Depends(require_role("admin", "guru"))):
    """
    Ambil semua data siswa.
    Hanya bisa diakses oleh Admin dan Guru.
    """
    conn = get_connection()
    rows = conn.execute("SELECT * FROM siswa ORDER BY kelas, nama").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.get("/api/siswa/{nis}")
def get_siswa(nis: str, current_user: dict = Depends(get_current_user)):
    """
    Ambil data siswa berdasarkan NIS.
    Siswa hanya bisa melihat data diri sendiri.
    """
    # Jika siswa, pastikan hanya bisa liat data sendiri
    if current_user["role"] == "siswa" and current_user["related_id"] != nis:
        raise HTTPException(status_code=403, detail="Anda hanya bisa melihat data sendiri")
    
    conn = get_connection()
    row = conn.execute("SELECT * FROM siswa WHERE nis = ?", (nis,)).fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    return dict(row)


@app.post("/api/siswa")
def create_siswa(data: SiswaCreate, current_user: dict = Depends(require_role("admin"))):
    """
    Tambah data siswa baru.
    Hanya bisa dilakukan oleh Admin.
    """
    # Buat objek Siswa (OOP)
    siswa = Siswa(data.nis, data.nama, data.kelas)
    
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO siswa (nis, nama, kelas) VALUES (?, ?, ?)",
            (siswa.nis, siswa.nama, siswa.kelas)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        if "UNIQUE" in str(e):
            raise HTTPException(status_code=400, detail="NIS sudah terdaftar")
        raise HTTPException(status_code=500, detail=str(e))
    conn.close()
    
    return {"message": "Siswa berhasil ditambahkan", "data": siswa.get_info()}


@app.put("/api/siswa/{nis}")
def update_siswa(nis: str, data: SiswaUpdate, current_user: dict = Depends(require_role("admin"))):
    """
    Update data siswa.
    Hanya bisa dilakukan oleh Admin.
    """
    conn = get_connection()
    existing = conn.execute("SELECT * FROM siswa WHERE nis = ?", (nis,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    nama = data.nama or existing["nama"]
    kelas = data.kelas or existing["kelas"]
    
    conn.execute(
        "UPDATE siswa SET nama = ?, kelas = ? WHERE nis = ?",
        (nama, kelas, nis)
    )
    conn.commit()
    conn.close()
    
    return {"message": "Data siswa berhasil diupdate"}


@app.delete("/api/siswa/{nis}")
def delete_siswa(nis: str, current_user: dict = Depends(require_role("admin"))):
    """
    Hapus data siswa.
    Hanya bisa dilakukan oleh Admin. Nilai terkait juga akan dihapus (CASCADE).
    """
    conn = get_connection()
    existing = conn.execute("SELECT * FROM siswa WHERE nis = ?", (nis,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    conn.execute("DELETE FROM siswa WHERE nis = ?", (nis,))
    conn.commit()
    conn.close()
    
    return {"message": "Siswa berhasil dihapus"}


# ============================================================
# ROUTE: DATA GURU
# ============================================================

@app.get("/api/guru")
def get_all_guru(current_user: dict = Depends(require_role("admin"))):
    """Ambil semua data guru. Hanya Admin."""
    conn = get_connection()
    rows = conn.execute("SELECT * FROM guru ORDER BY nama_guru").fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.post("/api/guru")
def create_guru(data: GuruCreate, current_user: dict = Depends(require_role("admin"))):
    """Tambah data guru baru. Hanya Admin."""
    guru = Guru(data.id_guru, data.nama_guru, data.mata_pelajaran)
    
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO guru (id_guru, nama_guru, mata_pelajaran) VALUES (?, ?, ?)",
            (guru.id_guru, guru.nama_guru, guru.mata_pelajaran)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        if "UNIQUE" in str(e):
            raise HTTPException(status_code=400, detail="ID Guru sudah terdaftar")
        raise HTTPException(status_code=500, detail=str(e))
    conn.close()
    
    return {"message": "Guru berhasil ditambahkan", "data": guru.get_info()}


@app.delete("/api/guru/{id_guru}")
def delete_guru(id_guru: str, current_user: dict = Depends(require_role("admin"))):
    """Hapus data guru. Hanya Admin."""
    conn = get_connection()
    existing = conn.execute("SELECT * FROM guru WHERE id_guru = ?", (id_guru,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Guru tidak ditemukan")
    
    conn.execute("DELETE FROM guru WHERE id_guru = ?", (id_guru,))
    conn.commit()
    conn.close()
    
    return {"message": "Guru berhasil dihapus"}


# ============================================================
# ROUTE: DATA NILAI
# ============================================================

@app.get("/api/nilai")
def get_all_nilai(current_user: dict = Depends(require_role("admin", "guru"))):
    """
    Ambil semua data nilai dengan info siswa.
    Hanya Admin dan Guru.
    """
    conn = get_connection()
    rows = conn.execute("""
        SELECT n.*, s.nama as nama_siswa, s.kelas
        FROM nilai n
        JOIN siswa s ON n.siswa_nis = s.nis
        ORDER BY s.kelas, s.nama, n.mata_pelajaran
    """).fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.get("/api/nilai/{nis}")
def get_nilai_siswa(nis: str, current_user: dict = Depends(get_current_user)):
    """
    Ambil nilai berdasarkan NIS siswa.
    Siswa hanya bisa melihat nilai sendiri.
    """
    if current_user["role"] == "siswa" and current_user["related_id"] != nis:
        raise HTTPException(status_code=403, detail="Anda hanya bisa melihat nilai sendiri")
    
    conn = get_connection()
    rows = conn.execute("""
        SELECT n.*, s.nama as nama_siswa, s.kelas
        FROM nilai n
        JOIN siswa s ON n.siswa_nis = s.nis
        WHERE n.siswa_nis = ?
        ORDER BY n.mata_pelajaran
    """, (nis,)).fetchall()
    conn.close()
    
    return [dict(row) for row in rows]


@app.post("/api/nilai")
def create_nilai(data: NilaiCreate, current_user: dict = Depends(require_role("admin", "guru"))):
    """
    Tambah atau update nilai siswa.
    Admin dan Guru bisa menginput nilai.
    
    Nilai otomatis dihitung: Nilai Akhir = 30% Tugas + 30% UTS + 40% UAS
    """
    # Validasi nilai (structured programming)
    validation = validate_semua_nilai(data.tugas, data.uts, data.uas)
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["errors"])
    
    # Cek siswa ada
    conn = get_connection()
    siswa = conn.execute("SELECT * FROM siswa WHERE nis = ?", (data.siswa_nis,)).fetchone()
    if not siswa:
        conn.close()
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    # Hitung nilai akhir dan status (structured programming)
    nilai_akhir = hitung_nilai_akhir(data.tugas, data.uts, data.uas)
    status_val = tentukan_status(nilai_akhir)
    
    try:
        # Cek apakah sudah ada nilai untuk siswa + mapel ini
        existing = conn.execute(
            "SELECT * FROM nilai WHERE siswa_nis = ? AND mata_pelajaran = ?",
            (data.siswa_nis, data.mata_pelajaran)
        ).fetchone()
        
        if existing:
            # Update nilai yang sudah ada
            conn.execute("""
                UPDATE nilai SET tugas = ?, uts = ?, uas = ?, 
                nilai_akhir = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE siswa_nis = ? AND mata_pelajaran = ?
            """, (data.tugas, data.uts, data.uas, nilai_akhir, status_val,
                  data.siswa_nis, data.mata_pelajaran))
        else:
            # Insert nilai baru
            conn.execute("""
                INSERT INTO nilai (siswa_nis, mata_pelajaran, tugas, uts, uas, nilai_akhir, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (data.siswa_nis, data.mata_pelajaran, data.tugas, data.uts, data.uas,
                  nilai_akhir, status_val))
        
        conn.commit()
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
    conn.close()
    
    # Buat objek Nilai untuk response (OOP)
    nilai_obj = Nilai(data.siswa_nis, data.mata_pelajaran, data.tugas, data.uts, data.uas)
    
    return {
        "message": "Nilai berhasil disimpan",
        "data": nilai_obj.get_info(),
    }


@app.delete("/api/nilai/{nilai_id}")
def delete_nilai(nilai_id: int, current_user: dict = Depends(require_role("admin"))):
    """Hapus data nilai. Hanya Admin."""
    conn = get_connection()
    existing = conn.execute("SELECT * FROM nilai WHERE id = ?", (nilai_id,)).fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Data nilai tidak ditemukan")
    
    conn.execute("DELETE FROM nilai WHERE id = ?", (nilai_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Data nilai berhasil dihapus"}


# ============================================================
# ROUTE: LAPORAN DAN STATISTIK
# ============================================================

@app.get("/api/laporan")
def get_laporan(current_user: dict = Depends(require_role("admin", "guru"))):
    """
    Ambil laporan statistik nilai siswa.
    Menampilkan ringkasan: rata-rata, nilai tertinggi/terendah, jumlah lulus/tidak lulus.
    """
    conn = get_connection()
    siswa_rows = conn.execute("SELECT * FROM siswa").fetchall()
    nilai_rows = conn.execute("""
        SELECT n.*, s.nama as nama_siswa, s.kelas
        FROM nilai n
        JOIN siswa s ON n.siswa_nis = s.nis
    """).fetchall()
    conn.close()
    
    siswa_list = [dict(r) for r in siswa_rows]
    nilai_list = [dict(r) for r in nilai_rows]
    
    # Generate laporan (structured programming)
    laporan = generate_laporan(siswa_list, nilai_list)
    rekap_kelas = generate_rekap_per_kelas(nilai_list)
    
    return {
        "ringkasan": laporan,
        "rekap_kelas": rekap_kelas,
    }


@app.get("/api/laporan/siswa/{nis}")
def get_laporan_siswa(nis: str, current_user: dict = Depends(get_current_user)):
    """
    Ambil laporan nilai lengkap untuk satu siswa.
    Siswa hanya bisa melihat laporan sendiri.
    """
    if current_user["role"] == "siswa" and current_user["related_id"] != nis:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    
    conn = get_connection()
    siswa = conn.execute("SELECT * FROM siswa WHERE nis = ?", (nis,)).fetchone()
    if not siswa:
        conn.close()
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    nilai_rows = conn.execute("""
        SELECT * FROM nilai WHERE siswa_nis = ? ORDER BY mata_pelajaran
    """, (nis,)).fetchall()
    conn.close()
    
    nilai_list = [dict(r) for r in nilai_rows]
    semua_nilai = [n["nilai_akhir"] for n in nilai_list]
    
    return {
        "siswa": dict(siswa),
        "nilai": nilai_list,
        "rata_rata": round(sum(semua_nilai) / len(semua_nilai), 2) if semua_nilai else 0,
        "total_mapel": len(nilai_list),
        "lulus": sum(1 for n in nilai_list if n["status"] == "Lulus"),
        "tidak_lulus": sum(1 for n in nilai_list if n["status"] == "Tidak Lulus"),
    }


@app.get("/api/status/{nis}")
def get_status_siswa(nis: str, current_user: dict = Depends(get_current_user)):
    """
    Ambil status kelulusan siswa.
    Siswa bisa melihat status sendiri.
    """
    if current_user["role"] == "siswa" and current_user["related_id"] != nis:
        raise HTTPException(status_code=403, detail="Akses ditolak")
    
    conn = get_connection()
    siswa = conn.execute("SELECT * FROM siswa WHERE nis = ?", (nis,)).fetchone()
    if not siswa:
        conn.close()
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    nilai_rows = conn.execute(
        "SELECT * FROM nilai WHERE siswa_nis = ?", (nis,)
    ).fetchall()
    conn.close()
    
    nilai_list = [dict(r) for r in nilai_rows]
    
    if not nilai_list:
        return {
            "siswa": dict(siswa),
            "status": "Belum ada nilai",
            "nilai_akhir": None,
        }
    
    semua_nilai = [n["nilai_akhir"] for n in nilai_list]
    rata_rata = round(sum(semua_nilai) / len(semua_nilai), 2)
    status_keseluruhan = tentukan_status(rata_rata)
    
    return {
        "siswa": dict(siswa),
        "status": status_keseluruhan,
        "nilai_akhir": rata_rata,
        "detail": nilai_list,
    }


# ============================================================
# ROUTE: DASHBOARD STATS
# ============================================================

@app.get("/api/dashboard")
def get_dashboard(current_user: dict = Depends(get_current_user)):
    """
    Ambil data untuk dashboard berdasarkan role user.
    """
    conn = get_connection()
    
    if current_user["role"] == "admin":
        total_siswa = conn.execute("SELECT COUNT(*) FROM siswa").fetchone()[0]
        total_guru = conn.execute("SELECT COUNT(*) FROM guru").fetchone()[0]
        total_nilai = conn.execute("SELECT COUNT(*) FROM nilai").fetchone()[0]
        lulus = conn.execute("SELECT COUNT(*) FROM nilai WHERE status = 'Lulus'").fetchone()[0]
        conn.close()
        return {
            "role": "admin",
            "total_siswa": total_siswa,
            "total_guru": total_guru,
            "total_nilai": total_nilai,
            "total_lulus": lulus,
            "total_tidak_lulus": total_nilai - lulus,
        }
    
    elif current_user["role"] == "guru":
        total_siswa = conn.execute("SELECT COUNT(*) FROM siswa").fetchone()[0]
        total_nilai = conn.execute("SELECT COUNT(*) FROM nilai").fetchone()[0]
        conn.close()
        return {
            "role": "guru",
            "total_siswa": total_siswa,
            "total_nilai": total_nilai,
        }
    
    else:  # siswa
        nis = current_user["related_id"]
        siswa = conn.execute("SELECT * FROM siswa WHERE nis = ?", (nis,)).fetchone()
        nilai_rows = conn.execute("SELECT * FROM nilai WHERE siswa_nis = ?", (nis,)).fetchall()
        conn.close()
        
        nilai_list = [dict(r) for r in nilai_rows]
        semua_nilai = [n["nilai_akhir"] for n in nilai_list]
        
        return {
            "role": "siswa",
            "siswa": dict(siswa) if siswa else None,
            "total_mapel": len(nilai_list),
            "rata_rata": round(sum(semua_nilai) / len(semua_nilai), 2) if semua_nilai else 0,
            "nilai": nilai_list,
        }


# ============================================================
# JALANKAN SERVER
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
