// Types untuk Sistem Pengolahan Nilai Siswa
// Sesuai dengan backend FastAPI

export interface User {
  username: string;
  role: 'admin' | 'guru' | 'siswa';
  related_id: string | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Siswa {
  nis: string;
  nama: string;
  kelas: string;
  created_at?: string;
}

export interface Guru {
  id_guru: string;
  nama_guru: string;
  mata_pelajaran: string;
  created_at?: string;
}

export interface Nilai {
  id?: number;
  siswa_nis: string;
  mata_pelajaran: string;
  tugas: number;
  uts: number;
  uas: number;
  nilai_akhir?: number;
  status?: string;
  nama_siswa?: string;
  kelas?: string;
}

export interface DashboardStats {
  role: string;
  total_siswa?: number;
  total_guru?: number;
  total_nilai?: number;
  total_lulus?: number;
  total_tidak_lulus?: number;
  siswa?: Siswa;
  total_mapel?: number;
  rata_rata?: number;
  nilai?: Nilai[];
}

export interface Laporan {
  ringkasan: {
    total_siswa: number;
    total_nilai: number;
    rata_rata_kelas: number;
    nilai_tertinggi: number;
    nilai_terendah: number;
    jumlah_lulus: number;
    jumlah_tidak_lulus: number;
    persentase_lulus: number;
  };
  rekap_kelas: Array<{
    kelas: string;
    jumlah_siswa: number;
    rata_rata: number;
    nilai_tertinggi: number;
    nilai_terendah: number;
  }>;
}

export interface StatusSiswa {
  siswa: Siswa;
  status: string;
  nilai_akhir: number | null;
  detail?: Nilai[];
}
