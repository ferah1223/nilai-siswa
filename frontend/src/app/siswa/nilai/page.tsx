'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { getNilaiSiswa, Nilai } from '@/lib/api';
import Badge from '@/components/Badge';
import Loading from '@/components/Loading';

export default function SiswaNilaiPage() {
  const { user } = useAuth();
  const [nilai, setNilai] = useState<Nilai[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.related_id) {
      getNilaiSiswa(user.related_id)
        .then(setNilai)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <DashboardLayout title="Nilai Saya"><Loading /></DashboardLayout>;

  const avg = nilai.length > 0
    ? (nilai.reduce((s, n) => s + (n.nilai_akhir || 0), 0) / nilai.length).toFixed(2)
    : '0.00';

  return (
    <DashboardLayout title="Nilai Saya">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{nilai.length}</p>
            <p className="text-sm text-gray-500">Total Mapel</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">{avg}</p>
            <p className="text-sm text-gray-500">Rata-rata</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{nilai.filter(n => n.status === 'Lulus').length}</p>
            <p className="text-sm text-gray-500">Lulus</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{nilai.filter(n => n.status === 'Tidak Lulus').length}</p>
            <p className="text-sm text-gray-500">Tidak Lulus</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Detail Nilai</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Pelajaran</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tugas (30%)</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">UTS (30%)</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">UAS (40%)</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai Akhir</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nilai.map((n, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{n.mata_pelajaran}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{n.tugas}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{n.uts}</td>
                    <td className="px-6 py-4 text-center text-gray-700">{n.uas}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-gray-900">{n.nilai_akhir?.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={n.status === 'Lulus' ? 'success' : 'danger'}>{n.status}</Badge>
                    </td>
                  </tr>
                ))}
                {nilai.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Belum ada data nilai</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formula */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-semibold text-gray-900 mb-2">📝 Rumus Perhitungan Nilai Akhir</h4>
          <p className="text-gray-700 font-mono text-lg">
            Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)
          </p>
          <p className="text-sm text-gray-500 mt-2">Nilai akhir ≥ 70 dinyatakan <b className="text-green-600">Lulus</b></p>
        </div>
      </div>
    </DashboardLayout>
  );
}
