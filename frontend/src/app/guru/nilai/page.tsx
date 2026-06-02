'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { getAllNilai, createNilai, getSiswa, Nilai, Siswa } from '@/lib/api';
import { showToast } from '@/components/Toast';
import Loading from '@/components/Loading';

export default function GuruNilaiPage() {
  const [data, setData] = useState<Nilai[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siswa_nis: '', mata_pelajaran: '', tugas: '', uts: '', uas: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [nilaiRes, siswaRes] = await Promise.all([getAllNilai(), getSiswa()]);
      setData(nilaiRes);
      setSiswaList(siswaRes);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = data.filter((n) =>
    (n.nama_siswa || '').toLowerCase().includes(search.toLowerCase()) ||
    n.mata_pelajaran.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!form.siswa_nis || !form.mata_pelajaran || !form.tugas || !form.uts || !form.uas) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      await createNilai({
        siswa_nis: form.siswa_nis,
        mata_pelajaran: form.mata_pelajaran,
        tugas: parseFloat(form.tugas),
        uts: parseFloat(form.uts),
        uas: parseFloat(form.uas),
      });
      showToast('Nilai berhasil disimpan', 'success');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout title="Input Nilai"><Loading /></DashboardLayout>;

  return (
    <DashboardLayout title="Input & Kelola Nilai">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input placeholder="Cari siswa..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
          <Button onClick={() => setModalOpen(true)}>+ Input Nilai</Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
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
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Tidak ada data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Input Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Input Nilai Siswa">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
            <select value={form.siswa_nis} onChange={(e) => setForm({ ...form, siswa_nis: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
              <option value="">Pilih Siswa</option>
              {siswaList.map((s) => <option key={s.nis} value={s.nis}>{s.nis} - {s.nama}</option>)}
            </select>
          </div>
          <Input label="Mata Pelajaran" placeholder="Matematika" value={form.mata_pelajaran} onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Tugas" type="number" value={form.tugas} onChange={(e) => setForm({ ...form, tugas: e.target.value })} />
            <Input label="UTS" type="number" value={form.uts} onChange={(e) => setForm({ ...form, uts: e.target.value })} />
            <Input label="UAS" type="number" value={form.uas} onChange={(e) => setForm({ ...form, uas: e.target.value })} />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS) | Lulus ≥ 70</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
