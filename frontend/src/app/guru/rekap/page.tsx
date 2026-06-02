'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Input from '@/components/Input';
import Badge from '@/components/Badge';
import { getAllNilai, Nilai } from '@/lib/api';
import { showToast } from '@/components/Toast';
import Loading from '@/components/Loading';

export default function GuruRekapPage() {
  const [data, setData] = useState<Nilai[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllNilai()
      .then(setData)
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter((n) =>
    (n.nama_siswa || '').toLowerCase().includes(search.toLowerCase()) ||
    n.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
    (n.kelas || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <DashboardLayout title="Rekap Nilai"><Loading /></DashboardLayout>;

  const avg = data.length > 0
    ? (data.reduce((s, n) => s + (n.nilai_akhir || 0), 0) / data.length).toFixed(2)
    : '0.00';

  return (
    <DashboardLayout title="Rekap Nilai">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{data.length}</p>
            <p className="text-sm text-gray-500">Total Nilai</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">{avg}</p>
            <p className="text-sm text-gray-500">Rata-rata</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">{data.filter(n => n.status === 'Lulus').length}</p>
            <p className="text-sm text-gray-500">Lulus</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{data.filter(n => n.status === 'Tidak Lulus').length}</p>
            <p className="text-sm text-gray-500">Tidak Lulus</p>
          </div>
        </div>

        <Input placeholder="Cari siswa, mapel, atau kelas..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mapel</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tugas</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">UTS</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">UAS</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai Akhir</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((n, i) => (
                  <tr key={n.id || i} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{n.nama_siswa || '-'}</p>
                      <p className="text-xs text-gray-400">{n.siswa_nis}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{n.kelas || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{n.mata_pelajaran}</td>
                    <td className="px-6 py-4 text-center font-mono">{n.tugas}</td>
                    <td className="px-6 py-4 text-center font-mono">{n.uts}</td>
                    <td className="px-6 py-4 text-center font-mono">{n.uas}</td>
                    <td className="px-6 py-4 text-center font-bold">{n.nilai_akhir?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={n.status === 'Lulus' ? 'success' : 'danger'}>{n.status}</Badge>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
