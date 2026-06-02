"""
functions.py — Pemrograman Terstruktur (Structured Programming)
Berisi fungsi-fungsi/prosedur yang menangani logika bisnis sistem:
- Validasi nilai
- Perhitungan nilai akhir
- Penentuan status kelulusan
- Pengolahan laporan
- Format tampilan
"""

from typing import List, Dict, Optional


# ============================================================
# FUNGSI VALIDASI
# ============================================================

def validate_nilai(nilai: float) -> bool:
    """
    Validasi apakah nilai berada dalam rentang yang valid (0-100).
    
    Args:
        nilai (float): Nilai yang akan divalidasi
        
    Returns:
        bool: True jika valid (0-100), False jika tidak
        
    Contoh:
        >>> validate_nilai(85)
        True
        >>> validate_nilai(110)
        False
        >>> validate_nilai(-5)
        False
    """
    return 0 <= nilai <= 100


def validate_semua_nilai(tugas: float, uts: float, uas: float) -> dict:
    """
    Validasi semua nilai sekaligus.
    
    Args:
        tugas (float): Nilai tugas
        uts (float): Nilai UTS
        uas (float): Nilai UAS
        
    Returns:
        dict: {"valid": bool, "errors": list of error messages}
    """
    errors = []
    
    if not validate_nilai(tugas):
        errors.append(f"Nilai tugas ({tugas}) harus antara 0-100")
    if not validate_nilai(uts):
        errors.append(f"Nilai UTS ({uts}) harus antara 0-100")
    if not validate_nilai(uas):
        errors.append(f"Nilai UAS ({uas}) harus antara 0-100")
    
    return {
        "valid": len(errors) == 0,
        "errors": errors,
    }


def validate_nis(nis: str) -> bool:
    """
    Validasi format NIS (tidak kosong, minimal 3 karakter).
    
    Args:
        nis (str): NIS yang akan divalidasi
        
    Returns:
        bool: True jika valid
    """
    return nis is not None and len(nis.strip()) >= 3


# ============================================================
# FUNGSI PERHITUNGAN
# ============================================================

def hitung_nilai_akhir(tugas: float, uts: float, uas: float) -> float:
    """
    Hitung nilai akhir menggunakan rumus:
    Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)
    
    Args:
        tugas (float): Nilai tugas (0-100)
        uts (float): Nilai UTS (0-100)
        uas (float): Nilai UAS (0-100)
        
    Returns:
        float: Nilai akhir (dibulatkan 2 desimal)
        
    Contoh:
        >>> hitung_nilai_akhir(80, 75, 90)
        82.5
        >>> hitung_nilai_akhir(60, 70, 80)
        71.0
    """
    nilai_akhir = (0.30 * tugas) + (0.30 * uts) + (0.40 * uas)
    return round(nilai_akhir, 2)


def tentukan_status(nilai_akhir: float) -> str:
    """
    Tentukan status kelulusan berdasarkan nilai akhir.
    
    Args:
        nilai_akhir (float): Nilai akhir siswa
        
    Returns:
        str: "Lulus" jika >= 70, "Tidak Lulus" jika < 70
        
    Contoh:
        >>> tentukan_status(75)
        'Lulus'
        >>> tentukan_status(65)
        'Tidak Lulus'
    """
    if nilai_akhir >= 70:
        return "Lulus"
    return "Tidak Lulus"


def hitung_rata_rata(nilai_list: List[float]) -> float:
    """
    Hitung rata-rata dari list nilai.
    
    Args:
        nilai_list (List[float]): Daftar nilai
        
    Returns:
        float: Rata-rata (dibulatkan 2 desimal). 0 jika list kosong.
    """
    if not nilai_list:
        return 0.0
    return round(sum(nilai_list) / len(nilai_list), 2)


# ============================================================
# FUNGSI LAPORAN
# ============================================================

def generate_laporan(siswa_list: List[dict], nilai_list: List[dict]) -> dict:
    """
    Generate laporan statistik dari data siswa dan nilai.
    
    Args:
        siswa_list (List[dict]): Daftar data siswa
        nilai_list (List[dict]): Daftar data nilai
        
    Returns:
        dict: Laporan berisi statistik lengkap
    """
    total_siswa = len(siswa_list)
    total_nilai = len(nilai_list)
    
    if total_nilai == 0:
        return {
            "total_siswa": total_siswa,
            "total_nilai": 0,
            "rata_rata_kelas": 0,
            "nilai_tertinggi": 0,
            "nilai_terendah": 0,
            "jumlah_lulus": 0,
            "jumlah_tidak_lulus": 0,
            "persentase_lulus": 0,
        }
    
    semua_nilai_akhir = [n["nilai_akhir"] for n in nilai_list]
    lulus = [n for n in nilai_list if n["status"] == "Lulus"]
    tidak_lulus = [n for n in nilai_list if n["status"] == "Tidak Lulus"]
    
    return {
        "total_siswa": total_siswa,
        "total_nilai": total_nilai,
        "rata_rata_kelas": hitung_rata_rata(semua_nilai_akhir),
        "nilai_tertinggi": max(semua_nilai_akhir),
        "nilai_terendah": min(semua_nilai_akhir),
        "jumlah_lulus": len(lulus),
        "jumlah_tidak_lulus": len(tidak_lulus),
        "persentase_lulus": round(len(lulus) / total_nilai * 100, 1) if total_nilai > 0 else 0,
    }


def generate_rekap_per_kelas(nilai_list: List[dict]) -> List[dict]:
    """
    Generate rekap nilai per kelas.
    
    Args:
        nilai_list (List[dict]): Daftar data nilai dengan info kelas
        
    Returns:
        List[dict]: Rekap per kelas
    """
    kelas_map = {}
    for n in nilai_list:
        kelas = n.get("kelas", "Unknown")
        if kelas not in kelas_map:
            kelas_map[kelas] = []
        kelas_map[kelas].append(n["nilai_akhir"])
    
    rekap = []
    for kelas, nilai_list_kelas in kelas_map.items():
        rekap.append({
            "kelas": kelas,
            "jumlah_siswa": len(nilai_list_kelas),
            "rata_rata": hitung_rata_rata(nilai_list_kelas),
            "nilai_tertinggi": max(nilai_list_kelas),
            "nilai_terendah": min(nilai_list_kelas),
        })
    
    return sorted(rekap, key=lambda x: x["kelas"])


# ============================================================
# FUNGSI FORMAT
# ============================================================

def format_nilai(nilai: float) -> str:
    """
    Format nilai untuk tampilan (2 desimal).
    
    Args:
        nilai (float): Nilai yang akan diformat
        
    Returns:
        str: Nilai yang sudah diformat
        
    Contoh:
        >>> format_nilai(82.5)
        '82.50'
        >>> format_nilai(100)
        '100.00'
    """
    return f"{nilai:.2f}"


def format_status_badge(status: str) -> dict:
    """
    Format status dengan warna untuk tampilan UI.
    
    Args:
        status (str): Status kelulusan
        
    Returns:
        dict: {"text": str, "color": str, "bg_color": str}
    """
    if status == "Lulus":
        return {
            "text": "Lulus",
            "color": "#166534",
            "bg_color": "#dcfce7",
        }
    return {
        "text": "Tidak Lulus",
        "color": "#991b1b",
        "bg_color": "#fef2f2",
    }
