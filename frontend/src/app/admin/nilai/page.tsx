'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Badge from '@/components/Badge';
import { getAllNilai, createNilai, deleteNilai, getSiswa, Nilai, Siswa } from '@/lib/api';
import { showToast } from '@/components/Toast';
import Loading from '@/components/Loading';

export default function AdminNilaiPage() {
  const [data, setData] = useState<Nilai[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Nilai | null>(null);
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
    n.mata_pelajaran.toLowerCase().includes(search.toLowerCase()) ||
    n.siswa_nis.includes(search)
  );

  const openAdd = () => {
    setForm({ siswa_nis: '', mata_pelajaran: '', tugas: '', uts: '', uas: '' });
    setModalOpen(true);
  };

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

  const handleDelete = async () => {
    if (!deleteConfirm?.id) return;
    try {
      await deleteNilai(deleteConfirm.id);
      showToast('Nilai berhasil dihapus', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus', 'error');
    }
  };

  if (loading) return <DashboardLayout title="Data Nilai"><Loading /></DashboardLayout>;

  return (
    <DashboardLayout title="Data Nilai">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input placeholder="Cari siswa atau mata pelajaran..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
          <Button onClick={openAdd}>+ Input Nilai</Button>
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{n.nama_siswa || '-'}</p>
                      <p className="text-xs text-gray-400">{n.siswa_nis}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{n.mata_pelajaran}</td>
                    <td className="px-6 py-4 text-center font-mono text-gray-700">{n.tugas}</td>
                    <td className="px-6 py-4 text-center font-mono text-gray-700">{n.uts}</td>
                    <td className="px-6 py-4 text-center font-mono text-gray-700">{n.uas}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">{n.nilai_akhir?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={n.status === 'Lulus' ? 'success' : 'danger'}>{n.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => setDeleteConfirm(n)} className="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">Tidak ada data nilai</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Input Nilai">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Siswa</label>
            <select
              value={form.siswa_nis}
              onChange={(e) => setForm({ ...form, siswa_nis: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Siswa</option>
              {siswaList.map((s) => (
                <option key={s.nis} value={s.nis}>{s.nis} - {s.nama} ({s.kelas})</option>
              ))}
            </select>
          </div>
          <Input label="Mata Pelajaran" placeholder="Contoh: Matematika" value={form.mata_pelajaran} onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Tugas (0-100)" type="number" value={form.tugas} onChange={(e) => setForm({ ...form, tugas: e.target.value })} />
            <Input label="UTS (0-100)" type="number" value={form.uts} onChange={(e) => setForm({ ...form, uts: e.target.value })} />
            <Input label="UAS (0-100)" type="number" value={form.uas} onChange={(e) => setForm({ ...form, uas: e.target.value })} />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">Nilai Akhir = (30% × Tugas) + (30% × UTS) + (40% × UAS)</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Nilai">
        <div className="space-y-4">
          <p className="text-gray-700">Yakin ingin menghapus nilai <b>{deleteConfirm?.mata_pelajaran}</b> untuk siswa <b>{deleteConfirm?.nama_siswa}</b>?</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
