'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { getLaporan, Laporan } from '@/lib/api';
import { showToast } from '@/components/Toast';
import Loading from '@/components/Loading';

export default function AdminLaporanPage() {
  const [laporan, setLaporan] = useState<Laporan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLaporan()
      .then(setLaporan)
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Laporan"><Loading /></DashboardLayout>;

  const r = laporan?.ringkasan;

  return (
    <DashboardLayout title="Laporan & Statistik">
      <div className="space-y-6">
        {/* Stats Cards */}
        {r && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon="👥" label="Total Siswa" value={r.total_siswa} />
            <StatsCard icon="📝" label="Total Nilai" value={r.total_nilai} />
            <StatsCard icon="📊" label="Rata-rata Kelas" value={r.rata_rata_kelas.toFixed(2)} />
            <StatsCard icon={r.persentase_lulus >= 70 ? '✅' : '⚠️'} label="Kelulusan" value={`${r.persentase_lulus}%`} />
          </div>
        )}

        {/* Detail Stats */}
        {r && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">📈 Nilai</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Nilai Tertinggi</span><span className="font-bold text-green-600">{r.nilai_tertinggi.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Nilai Terendah</span><span className="font-bold text-red-600">{r.nilai_terendah.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Rata-rata</span><span className="font-bold text-blue-600">{r.rata_rata_kelas.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">🎓 Kelulusan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Lulus</span><span className="font-bold text-green-600">{r.jumlah_lulus}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tidak Lulus</span><span className="font-bold text-red-600">{r.jumlah_tidak_lulus}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Persentase</span><span className="font-bold text-blue-600">{r.persentase_lulus}%</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Rekap Per Kelas */}
        {laporan?.rekap_kelas && laporan.rekap_kelas.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Rekap Per Kelas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jumlah Siswa</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rata-rata</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tertinggi</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Terendah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {laporan.rekap_kelas.map((k, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{k.kelas}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{k.jumlah_siswa}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${k.rata_rata >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                          {k.rata_rata.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">{k.nilai_tertinggi.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{k.nilai_terendah.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Formula */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <b>Rumus:</b> Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS) | <b>Lulus:</b> ≥ 70
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
