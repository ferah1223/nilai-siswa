'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { getDashboard } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { showToast } from '@/components/Toast';

export default function GuruDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="guru">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola nilai siswa Anda</p>
      </div>

      {loading ? (
        <Loading text="Memuat dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              label="Total Siswa"
              value={stats?.total_siswa ?? 0}
              color="blue"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              label="Total Nilai"
              value={stats?.total_nilai ?? 0}
              color="yellow"
            />
            <StatsCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="Siswa Lulus"
              value={stats?.total_lulus ?? 0}
              color="green"
            />
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link
              href="/guru/nilai"
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Input Nilai</h3>
                <p className="text-sm text-gray-500">Tambah atau update nilai siswa</p>
              </div>
            </Link>
            <Link
              href="/guru/rekap"
              className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 group"
            >
              <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rekap Nilai</h3>
                <p className="text-sm text-gray-500">Lihat rekap semua nilai siswa</p>
              </div>
            </Link>
          </div>

          {/* Formula Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">📐 Rumus Nilai Akhir</h3>
            <div className="flex flex-wrap items-center gap-4 text-lg font-mono">
              <span>Nilai Akhir =</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">(30% × Tugas)</span>
              <span>+</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">(30% × UTS)</span>
              <span>+</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">(40% × UAS)</span>
            </div>
            <p className="mt-3 text-sm text-blue-100">✅ Nilai Lulus: ≥ 70 &nbsp;|&nbsp; ❌ Tidak Lulus: &lt; 70</p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
