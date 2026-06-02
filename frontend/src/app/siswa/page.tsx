'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { useAuth } from '@/lib/auth';
import { getDashboard, Nilai } from '@/lib/api';
import Badge from '@/components/Badge';
import Loading from '@/components/Loading';

export default function SiswaDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <DashboardLayout title="Dashboard"><Loading /></DashboardLayout>;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold">Halo, {data?.siswa?.nama || user?.username}! 👋</h2>
          <p className="mt-1 text-blue-100">Kelas: {data?.siswa?.kelas || '-'}</p>
          <p className="mt-1 text-blue-100">NIS: {data?.siswa?.nis || user?.related_id}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard icon="📚" label="Total Mapel" value={data?.total_mapel || 0} />
          <StatsCard icon="📊" label="Rata-rata" value={data?.rata_rata?.toFixed(2) || '0.00'} />
          <StatsCard
            icon={data?.rata_rata >= 70 ? '✅' : '❌'}
            label="Status"
            value={data?.rata_rata >= 70 ? 'Lulus' : 'Tidak Lulus'}
          />
        </div>

        {/* Nilai Table */}
        {data?.nilai && data.nilai.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Nilai Per Mapel</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Pelajaran</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tugas</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">UTS</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">UAS</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai Akhir</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.nilai.map((n: Nilai, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{n.mata_pelajaran}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{n.tugas}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{n.uts}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{n.uas}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">{n.nilai_akhir?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={n.status === 'Lulus' ? 'success' : 'danger'}>{n.status}</Badge>
                      </td>
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
            <b>Rumus Nilai Akhir:</b> (30% × Tugas) + (30% × UTS) + (40% × UAS) ≥ 70 = <b>Lulus</b>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
