/**
 * api.ts — Service untuk komunikasi dengan backend FastAPI
 * Semua fungsi API ada di sini. JWT token otomatis dikirim di header.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================
// HELPER: Token Management
// ============================================================

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function setToken(token: string) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

// ============================================================
// HELPER: Generic Request
// ============================================================

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') window.location.href = '/';
    throw new Error('Sesi telah berakhir. Silakan login kembali.');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Terjadi kesalahan' }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ============================================================
// AUTH
// ============================================================

export interface LoginResponse {
  token: string;
  user: { username: string; role: string; related_id: string | null };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Login gagal' }));
    throw new Error(error.detail || 'Username atau password salah');
  }

  const data: LoginResponse = await res.json();
  setToken(data.token);
  return data;
}

export function logout() {
  removeToken();
}

export async function getMe(): Promise<{ username: string; role: string; related_id: string | null }> {
  return request('/api/me');
}

// ============================================================
// DASHBOARD
// ============================================================

export async function getDashboard(): Promise<any> {
  return request('/api/dashboard');
}

// ============================================================
// SISWA
// ============================================================

export interface Siswa {
  nis: string;
  nama: string;
  kelas: string;
  created_at?: string;
}

export async function getSiswa(): Promise<Siswa[]> {
  return request('/api/siswa');
}

export async function getSiswaByNis(nis: string): Promise<Siswa> {
  return request(`/api/siswa/${nis}`);
}

export async function createSiswa(data: { nis: string; nama: string; kelas: string }): Promise<any> {
  return request('/api/siswa', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateSiswa(nis: string, data: { nama?: string; kelas?: string }): Promise<any> {
  return request(`/api/siswa/${nis}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteSiswa(nis: string): Promise<any> {
  return request(`/api/siswa/${nis}`, { method: 'DELETE' });
}

// ============================================================
// GURU
// ============================================================

export interface Guru {
  id_guru: string;
  nama_guru: string;
  mata_pelajaran: string;
  created_at?: string;
}

export async function getGuru(): Promise<Guru[]> {
  return request('/api/guru');
}

export async function createGuru(data: { id_guru: string; nama_guru: string; mata_pelajaran: string }): Promise<any> {
  return request('/api/guru', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateGuru(id_guru: string, data: { nama_guru?: string; mata_pelajaran?: string }): Promise<any> {
  return request(`/api/guru/${id_guru}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteGuru(id_guru: string): Promise<any> {
  return request(`/api/guru/${id_guru}`, { method: 'DELETE' });
}

// ============================================================
// NILAI
// ============================================================

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

export async function getAllNilai(): Promise<Nilai[]> {
  return request('/api/nilai');
}

export async function getNilaiSiswa(nis: string): Promise<Nilai[]> {
  return request(`/api/nilai/${nis}`);
}

export async function createNilai(data: {
  siswa_nis: string;
  mata_pelajaran: string;
  tugas: number;
  uts: number;
  uas: number;
}): Promise<any> {
  return request('/api/nilai', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteNilai(id: number): Promise<any> {
  return request(`/api/nilai/${id}`, { method: 'DELETE' });
}

// ============================================================
// LAPORAN & STATUS
// ============================================================

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

export async function getLaporan(): Promise<Laporan> {
  return request('/api/laporan');
}

export async function getLaporanSiswa(nis: string): Promise<any> {
  return request(`/api/laporan/siswa/${nis}`);
}

export async function getStatusSiswa(nis: string): Promise<any> {
  return request(`/api/status/${nis}`);
}
