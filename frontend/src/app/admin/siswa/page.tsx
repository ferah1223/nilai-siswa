'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getSiswa, createSiswa, updateSiswa, deleteSiswa, Siswa } from '@/lib/api';
import { showToast } from '@/components/Toast';
import Loading from '@/components/Loading';

export default function AdminSiswaPage() {
  const [data, setData] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Siswa | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Siswa | null>(null);
  const [form, setForm] = useState({ nis: '', nama: '', kelas: '' });

  const fetchData = useCallback(async () => {
    try {
      const res = await getSiswa();
      setData(res);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = data.filter((s) =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.includes(search) ||
    s.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ nis: '', nama: '', kelas: '' });
    setModalOpen(true);
  };

  const openEdit = (item: Siswa) => {
    setEditItem(item);
    setForm({ nis: item.nis, nama: item.nama, kelas: item.kelas });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nis || !form.nama || !form.kelas) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await updateSiswa(editItem.nis, { nama: form.nama, kelas: form.kelas });
        showToast('Data siswa berhasil diupdate', 'success');
      } else {
        await createSiswa(form);
        showToast('Siswa berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menyimpan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteSiswa(deleteConfirm.nis);
      showToast('Siswa berhasil dihapus', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus', 'error');
    }
  };

  if (loading) return <DashboardLayout title="Data Siswa"><Loading /></DashboardLayout>;

  return (
    <DashboardLayout title="Data Siswa">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input placeholder="Cari siswa..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
          <Button onClick={openAdd}>+ Tambah Siswa</Button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((s) => (
                  <tr key={s.nis} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-700">{s.nis}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{s.nama}</td>
                    <td className="px-6 py-4 text-gray-700">{s.kelas}</td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button onClick={() => openEdit(s)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                      <button onClick={() => setDeleteConfirm(s)} className="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">{loading ? 'Memuat...' : 'Tidak ada data siswa'}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800"><b>Total:</b> {data.length} siswa terdaftar</p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Siswa' : 'Tambah Siswa'}>
        <div className="space-y-4">
          <Input label="NIS" placeholder="Contoh: 2024011" value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} disabled={!!editItem} />
          <Input label="Nama Lengkap" placeholder="Nama siswa" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          <Input label="Kelas" placeholder="Contoh: X-RPL" value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Siswa">
        <div className="space-y-4">
          <p className="text-gray-700">Yakin ingin menghapus siswa <b>{deleteConfirm?.nama}</b> (NIS: {deleteConfirm?.nis})? Semua nilai terkait juga akan dihapus.</p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
