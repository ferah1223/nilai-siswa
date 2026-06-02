"""
database.py — Setup database SQLite
Membuat tabel dan koneksi database untuk sistem pengolahan nilai siswa.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "nilai_siswa.db")


def get_connection():
    """Buat koneksi baru ke database SQLite."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Supaya bisa akses kolom pakai nama
    conn.execute("PRAGMA foreign_keys = ON")  # Aktifkan foreign key
    return conn


def init_database():
    """Inisialisasi semua tabel yang dibutuhkan sistem."""
    conn = get_connection()
    cursor = conn.cursor()

    # Tabel User (untuk login dan autentikasi)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'guru', 'siswa')),
            related_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel Siswa
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS siswa (
            nis TEXT PRIMARY KEY,
            nama TEXT NOT NULL,
            kelas TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel Guru
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS guru (
            id_guru TEXT PRIMARY KEY,
            nama_guru TEXT NOT NULL,
            mata_pelajaran TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Tabel Nilai
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS nilai (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            siswa_nis TEXT NOT NULL,
            mata_pelajaran TEXT NOT NULL,
            tugas REAL NOT NULL,
            uts REAL NOT NULL,
            uas REAL NOT NULL,
            nilai_akhir REAL,
            status TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (siswa_nis) REFERENCES siswa(nis) ON DELETE CASCADE,
            UNIQUE(siswa_nis, mata_pelajaran)
        )
    """)

    conn.commit()
    conn.close()
    print("Database berhasil diinisialisasi")


if __name__ == "__main__":
    init_database()
