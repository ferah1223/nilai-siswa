'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import Loading from '@/components/Loading';
import { getDashboard } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { showToast } from '@/components/Toast';

export default function AdminDashboard() {
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
      showToast(
        err instanceof Error ? err.message : 'Gagal memuat data',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout requiredRole="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ringkasan data sistem pengolahan nilai
        </p>
      </div>

      {loading ? (
        <Loading text="Memuat dashboard..." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              label="Total Guru"
              value={stats?.total_guru ?? 0}
              color="purple"
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
              subtitle={`Tidak lulus: ${stats?.total_tidak_lulus ?? 0}`}
            />
          </div>

          {/* Formula Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">📐 Rumus Nilai Akhir</h3>
            <div className="flex flex-wrap items-center gap-4 text-lg font-mono">
              <span>Nilai Akhir =</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">
                (30% × Tugas)
              </span>
              <span>+</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">
                (30% × UTS)
              </span>
              <span>+</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">
                (40% × UAS)
              </span>
            </div>
            <p className="mt-3 text-sm text-blue-100">
              ✅ Nilai Lulus: ≥ 70 &nbsp;|&nbsp; ❌ Tidak Lulus: &lt; 70
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
