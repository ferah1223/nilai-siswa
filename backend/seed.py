"""
seed.py — Data Awal (Seed Data)
Membuat data awal untuk testing: admin, guru, siswa, dan nilai.
"""

from database import get_connection, init_database
from auth import hash_password
from functions import hitung_nilai_akhir, tentukan_status


def seed_data():
    """Isi database dengan data awal untuk testing."""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Cek apakah sudah ada data
    existing = cursor.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    if existing > 0:
        print("Data sudah ada, skip seeding")
        conn.close()
        return
    
    print("Mengisi data awal...")
    
    # ============================================================
    # DATA USER
    # ============================================================
    users = [
        ("admin", hash_password("admin123"), "admin", None),
        ("guru_mtk", hash_password("guru123"), "guru", "G001"),
        ("guru_bindo", hash_password("guru123"), "guru", "G002"),
        ("siswa_001", hash_password("siswa123"), "siswa", "2024001"),
        ("siswa_002", hash_password("siswa123"), "siswa", "2024002"),
        ("siswa_003", hash_password("siswa123"), "siswa", "2024003"),
        ("siswa_004", hash_password("siswa123"), "siswa", "2024004"),
        ("siswa_005", hash_password("siswa123"), "siswa", "2024005"),
        ("siswa_006", hash_password("siswa123"), "siswa", "2024006"),
        ("siswa_007", hash_password("siswa123"), "siswa", "2024007"),
        ("siswa_008", hash_password("siswa123"), "siswa", "2024008"),
        ("siswa_009", hash_password("siswa123"), "siswa", "2024009"),
        ("siswa_010", hash_password("siswa123"), "siswa", "2024010"),
    ]
    cursor.executemany(
        "INSERT INTO users (username, password_hash, role, related_id) VALUES (?, ?, ?, ?)",
        users
    )
    
    # ============================================================
    # DATA GURU
    # ============================================================
    guru_data = [
        ("G001", "Pak Budi Santoso", "Matematika"),
        ("G002", "Bu Siti Aminah", "Bahasa Indonesia"),
    ]
    cursor.executemany(
        "INSERT INTO guru (id_guru, nama_guru, mata_pelajaran) VALUES (?, ?, ?)",
        guru_data
    )
    
    # ============================================================
    # DATA SISWA
    # ============================================================
    siswa_data = [
        ("2024001", "Andi Prasetyo", "X-RPL"),
        ("2024002", "Budi Cahyono", "X-RPL"),
        ("2024003", "Citra Dewi", "X-RPL"),
        ("2024004", "Dewi Lestari", "X-TKJ"),
        ("2024005", "Eka Putra", "X-TKJ"),
        ("2024006", "Fajar Nugroho", "X-TKJ"),
        ("2024007", "Gita Puspita", "XI-RPL"),
        ("2024008", "Hadi Wijaya", "XI-RPL"),
        ("2024009", "Indah Sari", "XI-TKJ"),
        ("2024010", "Joko Susilo", "XI-TKJ"),
    ]
    cursor.executemany(
        "INSERT INTO siswa (nis, nama, kelas) VALUES (?, ?, ?)",
        siswa_data
    )
    
    # ============================================================
    # DATA NILAI
    # ============================================================
    # Format: (siswa_nis, mata_pelajaran, tugas, uts, uas)
    nilai_raw = [
        ("2024001", "Matematika", 85, 78, 90),
        ("2024001", "Bahasa Indonesia", 90, 82, 88),
        ("2024002", "Matematika", 70, 65, 72),
        ("2024002", "Bahasa Indonesia", 75, 70, 68),
        ("2024003", "Matematika", 92, 88, 95),
        ("2024003", "Bahasa Indonesia", 88, 90, 92),
        ("2024004", "Matematika", 60, 55, 65),
        ("2024004", "Bahasa Indonesia", 68, 62, 70),
        ("2024005", "Matematika", 78, 72, 80),
        ("2024005", "Bahasa Indonesia", 82, 78, 85),
        ("2024006", "Matematika", 50, 45, 55),
        ("2024006", "Bahasa Indonesia", 58, 52, 60),
        ("2024007", "Matematika", 95, 92, 98),
        ("2024007", "Bahasa Indonesia", 90, 88, 95),
        ("2024008", "Matematika", 65, 60, 68),
        ("2024008", "Bahasa Indonesia", 72, 68, 75),
        ("2024009", "Matematika", 88, 85, 82),
        ("2024009", "Bahasa Indonesia", 80, 75, 78),
        ("2024010", "Matematika", 42, 38, 48),
        ("2024010", "Bahasa Indonesia", 55, 50, 58),
    ]
    
    for siswa_nis, mapel, tugas, uts, uas in nilai_raw:
        nilai_akhir = hitung_nilai_akhir(tugas, uts, uas)
        status = tentukan_status(nilai_akhir)
        cursor.execute(
            """INSERT INTO nilai (siswa_nis, mata_pelajaran, tugas, uts, uas, nilai_akhir, status)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (siswa_nis, mapel, tugas, uts, uas, nilai_akhir, status)
        )
    
    conn.commit()
    conn.close()
    print(f"Data awal berhasil diisi:")
    print(f"  - {len(users)} user")
    print(f"  - {len(guru_data)} guru")
    print(f"  - {len(siswa_data)} siswa")
    print(f"  - {len(nilai_raw)} data nilai")


if __name__ == "__main__":
    init_database()
    seed_data()
