'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getGuru, createGuru, deleteGuru, Guru } from '@/lib/api';
import { showToast } from '@/components/Toast';

export default function AdminGuruPage() {
  const [data, setData] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Guru | null>(null);
  const [form, setForm] = useState({ id_guru: '', nama_guru: '', mata_pelajaran: '' });

  const fetchData = useCallback(async () => {
    try {
      const res = await getGuru();
      setData(res);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = data.filter(
    (g) =>
      g.nama_guru.toLowerCase().includes(search.toLowerCase()) ||
      g.id_guru.toLowerCase().includes(search.toLowerCase()) ||
      g.mata_pelajaran.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ id_guru: '', nama_guru: '', mata_pelajaran: '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.id_guru || !form.nama_guru || !form.mata_pelajaran) {
      showToast('Semua field wajib diisi', 'error');
      return;
    }
    setSaving(true);
    try {
      await createGuru(form);
      showToast('Guru berhasil ditambahkan', 'success');
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
      await deleteGuru(deleteConfirm.id_guru);
      showToast('Guru berhasil dihapus', 'success');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal menghapus', 'error');
    }
  };

  return (
    <DashboardLayout title="Data Guru">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input
            placeholder="Cari guru..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={openAdd}>+ Tambah Guru</Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Guru</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Pelajaran</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((g) => (
                  <tr key={g.id_guru} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm text-gray-700">{g.id_guru}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{g.nama_guru}</td>
                    <td className="px-6 py-4 text-gray-700">{g.mata_pelajaran}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setDeleteConfirm(g)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                      {loading ? 'Memuat data...' : 'Tidak ada data guru'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <b>Total:</b> {data.length} guru terdaftar
          </p>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Guru">
        <div className="space-y-4">
          <Input
            label="ID Guru"
            placeholder="Contoh: G003"
            value={form.id_guru}
            onChange={(e) => setForm({ ...form, id_guru: e.target.value })}
          />
          <Input
            label="Nama Guru"
            placeholder="Nama lengkap guru"
            value={form.nama_guru}
            onChange={(e) => setForm({ ...form, nama_guru: e.target.value })}
          />
          <Input
            label="Mata Pelajaran"
            placeholder="Contoh: Matematika"
            value={form.mata_pelajaran}
            onChange={(e) => setForm({ ...form, mata_pelajaran: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Hapus Guru">
        <div className="space-y-4">
          <p className="text-gray-700">
            Yakin ingin menghapus guru <b>{deleteConfirm?.nama_guru}</b>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
