'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/lib/auth';
import { getStatusSiswa } from '@/lib/api';
import Loading from '@/components/Loading';

export default function SiswaStatusPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.related_id) {
      getStatusSiswa(user.related_id)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <DashboardLayout title="Status Kelulusan"><Loading /></DashboardLayout>;

  const isLulus = data?.status === 'Lulus';

  return (
    <DashboardLayout title="Status Kelulusan">
      <div className="space-y-6">
        {/* Big Status Card */}
        <div className={`rounded-3xl p-8 text-center ${
          isLulus
            ? 'bg-gradient-to-br from-green-400 to-emerald-600'
            : 'bg-gradient-to-br from-red-400 to-rose-600'
        } text-white shadow-xl`}>
          <div className="text-6xl mb-4">{isLulus ? '🎉' : '📚'}</div>
          <h2 className="text-3xl font-bold mb-2">
            {isLulus ? 'SELAMAT! KAMU LULUS!' : 'BELUM LULUS'}
          </h2>
          <p className="text-lg opacity-90">
            {isLulus
              ? 'Kamu telah memenuhi batas nilai kelulusan. Pertahankan!'
              : 'Jangan menyerah! Terus belajar dan tingkatkan nilaimu.'}
          </p>
          {data?.nilai_akhir !== null && data?.nilai_akhir !== undefined && (
            <div className="mt-6 inline-block bg-white/20 rounded-2xl px-8 py-4">
              <p className="text-sm opacity-80">Nilai Akhir Rata-rata</p>
              <p className="text-5xl font-bold">{data.nilai_akhir.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Info Siswa */}
        {data?.siswa && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">📋 Informasi Siswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">NIS</p>
                <p className="font-medium text-gray-900">{data.siswa.nis}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium text-gray-900">{data.siswa.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kelas</p>
                <p className="font-medium text-gray-900">{data.siswa.kelas}</p>
              </div>
            </div>
          </div>
        )}

        {/* Detail Nilai */}
        {data?.detail && data.detail.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">📊 Detail Nilai Per Mapel</h3>
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
                  {data.detail.map((n: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{n.mata_pelajaran}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{n.tugas}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{n.uts}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{n.uas}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-900">{n.nilai_akhir?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          n.status === 'Lulus'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {n.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ketentuan */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h4 className="font-semibold text-amber-900 mb-2">📌 Ketentuan Kelulusan</h4>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)</li>
            <li>• Rentang nilai valid: 0 – 100</li>
            <li>• Siswa dinyatakan <b>Lulus</b> jika nilai akhir ≥ 70</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
