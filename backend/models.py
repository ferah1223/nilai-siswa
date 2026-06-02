"""
models.py — Object Oriented Programming (OOP)
Berisi class-class yang merepresentasikan objek dalam sistem:
- Siswa: data siswa
- Guru: data guru  
- Nilai: data nilai siswa
- User: data user untuk autentikasi
"""


class Siswa:
    """
    Class Siswa — merepresentasikan data siswa.
    
    Atribut:
        nis (str): Nomor Induk Siswa (unik)
        nama (str): Nama lengkap siswa
        kelas (str): Kelas siswa (misal: "X-RPL", "XI-TKJ")
    """

    def __init__(self, nis: str, nama: str, kelas: str):
        self.nis = nis
        self.nama = nama
        self.kelas = kelas

    def get_info(self) -> dict:
        """Mengembalikan informasi siswa dalam bentuk dictionary."""
        return {
            "nis": self.nis,
            "nama": self.nama,
            "kelas": self.kelas,
        }

    def __str__(self) -> str:
        """Representasi string dari objek Siswa."""
        return f"Siswa({self.nis} - {self.nama}, Kelas {self.kelas})"


class Guru:
    """
    Class Guru — merepresentasikan data guru.
    
    Atribut:
        id_guru (str): ID unik guru
        nama_guru (str): Nama lengkap guru
        mata_pelajaran (str): Mata pelajaran yang diampu
    """

    def __init__(self, id_guru: str, nama_guru: str, mata_pelajaran: str):
        self.id_guru = id_guru
        self.nama_guru = nama_guru
        self.mata_pelajaran = mata_pelajaran

    def get_info(self) -> dict:
        """Mengembalikan informasi guru dalam bentuk dictionary."""
        return {
            "id_guru": self.id_guru,
            "nama_guru": self.nama_guru,
            "mata_pelajaran": self.mata_pelajaran,
        }

    def __str__(self) -> str:
        """Representasi string dari objek Guru."""
        return f"Guru({self.id_guru} - {self.nama_guru}, {self.mata_pelajaran})"


class Nilai:
    """
    Class Nilai — merepresentasikan data nilai siswa.
    
    Atribut:
        siswa_nis (str): NIS siswa yang memiliki nilai ini
        mata_pelajaran (str): Mata pelajaran
        tugas (float): Nilai tugas (0-100)
        uts (float): Nilai UTS (0-100)
        uas (float): Nilai UAS (0-100)
    
    Method:
        hitung_akhir(): Hitung nilai akhir dengan rumus 30% Tugas + 30% UTS + 40% UAS
        get_status(): Tentukan status kelulusan (Lulus/Tidak Lulus)
    """

    # Konstanta bobot penilaian
    BOBOT_TUGAS = 0.30  # 30%
    BOBOT_UTS = 0.30    # 30%
    BOBOT_UAS = 0.40    # 40%
    BATAS_LULUS = 70    # Nilai minimum untuk lulus

    def __init__(self, siswa_nis: str, mata_pelajaran: str,
                 tugas: float, uts: float, uas: float):
        self.siswa_nis = siswa_nis
        self.mata_pelajaran = mata_pelajaran
        self.tugas = tugas
        self.uts = uts
        self.uas = uas

    def hitung_akhir(self) -> float:
        """
        Hitung nilai akhir menggunakan rumus:
        Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)
        
        Returns:
            float: Nilai akhir (dibulatkan 2 desimal)
        """
        nilai_akhir = (
            (self.BOBOT_TUGAS * self.tugas) +
            (self.BOBOT_UTS * self.uts) +
            (self.BOBOT_UAS * self.uas)
        )
        return round(nilai_akhir, 2)

    def get_status(self) -> str:
        """
        Tentukan status kelulusan berdasarkan nilai akhir.
        
        Returns:
            str: "Lulus" jika >= 70, "Tidak Lulus" jika < 70
        """
        if self.hitung_akhir() >= self.BATAS_LULUS:
            return "Lulus"
        return "Tidak Lulus"

    def get_info(self) -> dict:
        """Mengembalikan informasi lengkap nilai dalam bentuk dictionary."""
        return {
            "siswa_nis": self.siswa_nis,
            "mata_pelajaran": self.mata_pelajaran,
            "tugas": self.tugas,
            "uts": self.uts,
            "uas": self.uas,
            "nilai_akhir": self.hitung_akhir(),
            "status": self.get_status(),
        }

    def __str__(self) -> str:
        """Representasi string dari objek Nilai."""
        return (f"Nilai({self.siswa_nis} - {self.mata_pelajaran}: "
                f"{self.hitung_akhir()} ({self.get_status()})")


class User:
    """
    Class User — merepresentasikan data user untuk autentikasi.
    
    Atribut:
        username (str): Username untuk login
        password_hash (str): Password yang sudah di-hash
        role (str): Peran user ('admin', 'guru', 'siswa')
        related_id (str): ID terkait (NIS untuk siswa, ID Guru untuk guru)
    """

    def __init__(self, username: str, password_hash: str,
                 role: str, related_id: str = None):
        self.username = username
        self.password_hash = password_hash
        self.role = role
        self.related_id = related_id

    def is_admin(self) -> bool:
        """Cek apakah user adalah admin."""
        return self.role == "admin"

    def is_guru(self) -> bool:
        """Cek apakah user adalah guru."""
        return self.role == "guru"

    def is_siswa(self) -> bool:
        """Cek apakah user adalah siswa."""
        return self.role == "siswa"

    def get_info(self) -> dict:
        """Mengembalikan informasi user (tanpa password)."""
        return {
            "username": self.username,
            "role": self.role,
            "related_id": self.related_id,
        }

    def __str__(self) -> str:
        """Representasi string dari objek User."""
        return f"User({self.username}, role={self.role})"
