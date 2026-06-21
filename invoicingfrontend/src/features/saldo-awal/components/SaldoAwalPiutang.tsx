import React, { useState, useEffect } from 'react';
import axiosClient from '../../../lib/axiosClient';
import { Plus, Trash2, X, UserPlus, Search, Save, Edit2 } from 'lucide-react';
import { setupApi, PelangganData, ProyekData, MataUangData } from '../../setup/api';
import SetupPelangganForm from '../../setup/components/SetupPelangganForm';
import { useConfirm } from '../../../contexts/ConfirmContext';
import toast from 'react-hot-toast';

interface SaldoAwal {
  id: number;
  no_invoice: string;
  tanggal: string;
  pelanggan_id?: number;
  pelanggan_name: string;
  alamat: string;
  proyek_id?: number;
  proyek_name: string;
  tgl_jt: string;
  mata_uang_id?: number;
  mata_uang_name: string;
  saldo_invoice: number;
  is_paid: boolean;
}

const SaldoAwalPiutang: React.FC = () => {
  const confirm = useConfirm();
  const [data, setData] = useState<SaldoAwal[]>([]);
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [proyeks, setProyeks] = useState<ProyekData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  
  const [editForm, setEditForm] = useState<Omit<Partial<SaldoAwal>, 'saldo_invoice'> & { saldo_invoice?: number | '' }>({
    no_invoice: '',
    tanggal: '',
    pelanggan_id: undefined,
    proyek_id: undefined,
    tgl_jt: '',
    mata_uang_id: undefined,
    saldo_invoice: '',
    is_paid: false
  });
  
  // Migration form state
  const [migrationFolder, setMigrationFolder] = useState('C:\\krishand\\fp\\2007\\fpdat.mdb');
  const [migrationType, setMigrationType] = useState('Krishand Faktur Pajak');
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPelanggansOnly = async () => {
    try {
      const resPelanggan = await setupApi.getPelanggan();
      if (resPelanggan) setPelanggans(resPelanggan);
    } catch (error) {
      console.error('Failed to fetch pelanggan', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSaldo, resPelanggan, resProyek, resMataUang] = await Promise.all([
        axiosClient.post('/api/saldo-awal-piutang/get', {}),
        setupApi.getPelanggan(),
        setupApi.getProyek(),
        setupApi.getMataUang()
      ]);
      
      if (resSaldo.data.status === 'success') setData(resSaldo.data.data);
      if (resPelanggan) setPelanggans(resPelanggan);
      if (resProyek) setProyeks(resProyek);
      if (resMataUang) setMataUangs(resMataUang);
      
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.no_invoice || !editForm.tanggal || !editForm.pelanggan_id) {
      toast.error('No Invoice, Tanggal, dan Pelanggan harus diisi!');
      return;
    }

    if (editForm.tgl_jt && editForm.tanggal) {
      if (new Date(editForm.tgl_jt) < new Date(editForm.tanggal)) {
        toast.error('Tanggal Jatuh Tempo tidak boleh lebih awal dari Tanggal Invoice');
        return;
      }
    }

    try {
      const endpoint = editForm.id ? '/api/saldo-awal-piutang/update' : '/api/saldo-awal-piutang/create';
      const res = await axiosClient.post(endpoint, editForm);
      if (res.data.status === 'success') {
        setIsFormOpen(false);
        fetchData();
        toast.success(editForm.id ? 'Data berhasil diperbarui!' : 'Data berhasil disimpan!');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('Gagal menyimpan data');
    }
  };

  const handleEdit = (row: SaldoAwal) => {
    setEditForm({
      id: row.id,
      no_invoice: row.no_invoice,
      tanggal: row.tanggal,
      pelanggan_id: row.pelanggan_id,
      proyek_id: row.proyek_id,
      tgl_jt: row.tgl_jt,
      mata_uang_id: row.mata_uang_id,
      saldo_invoice: row.saldo_invoice,
      is_paid: row.is_paid
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!isConfirmed) return;
    try {
      await axiosClient.post('/api/saldo-awal-piutang/delete', { id });
      fetchData();
      toast.success('Data berhasil dihapus!');
    } catch (error) {
      console.error('Failed to HAPUS', error);
      toast.error('Gagal menghapus data');
    }
  };

  const handleTogglePaid = async (row: SaldoAwal) => {
    const action = row.is_paid ? 'membatalkan status lunas' : 'menandai sebagai lunas';
    const isConfirmed = await confirm(`Apakah Anda yakin ingin ${action} untuk invoice ${row.no_invoice}?`);
    if (!isConfirmed) return;
    
    try {
      const res = await axiosClient.post('/api/saldo-awal-piutang/update', {
        id: row.id,
        is_paid: !row.is_paid
      });
      if (res.data.status === 'success') {
        fetchData();
        toast.success(`Status berhasil diperbarui!`);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Failed to PERBARUI status', error);
      toast.error('Gagal mengupdate status lunas');
    }
  };

  const handleMigration = async () => {
    setIsMigrating(true);
    // Simulate migration delay
    setTimeout(() => {
      setIsMigrating(false);
      setIsMigrationModalOpen(false);
      toast.success('Simulasi migrasi selesai (Data dummy). Pada implementasi nyata, file ini akan diunggah ke server.');
      fetchData();
    }, 1500);
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.pelanggan_name.toLowerCase().includes(searchQuery.toLowerCase()) || item.no_invoice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'ALL' ? true : (filterStatus === 'PAID' ? item.is_paid : !item.is_paid);
    return matchSearch && matchStatus;
  });

  const totalSaldo = filteredData.filter(item => !item.is_paid).reduce((sum, item) => sum + Number(item.saldo_invoice || 0), 0);

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Saldo Awal Piutang</h2>
          <p className="text-xs text-slate-300 mt-1">Kelola daftar saldo awal piutang pelanggan dan migrasi data.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              setEditForm({ no_invoice: '', tanggal: '', saldo_invoice: '', is_paid: false });
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
          >
            <Plus size={14} /> TAMBAH SALDO INVOICE
          </button>
          <button 
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2"
          >
            <UserPlus size={14} /> TAMBAH PELANGGAN
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Filter Pencarian</label>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-sm text-sm w-72 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white" 
                placeholder="Cari pelanggan atau invoice..."
              />
              <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Status Lunas</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-sm text-sm w-48 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="UNPAID">Belum Lunas (Unpaid)</option>
              <option value="PAID">Sudah Lunas (Paid)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">No. Invoice</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Tanggal</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Nama Pelanggan</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Alamat</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Proyek</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Tgl JT</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold">Ccy</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right">Saldo Invoice</th>
                <th className="px-3 py-2 border-r border-slate-300 text-center font-semibold">Paid</th>
                <th className="px-3 py-2 w-10 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="p-4 text-center text-slate-500">Memuat data...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={10} className="p-4 text-center text-slate-500">Tidak ada data saldo awal piutang</td></tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-1.5 border-r border-slate-200 font-medium">{row.no_invoice}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.tanggal}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.pelanggan_name}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 truncate max-w-xs" title={row.alamat}>{row.alamat}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.proyek_name}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">
                      {row.tgl_jt && (
                        <div className="flex flex-col gap-0.5">
                          <span className={(!row.is_paid && new Date(row.tgl_jt) < new Date(new Date().setHours(0,0,0,0))) ? "text-red-600 font-semibold" : ""}>
                            {row.tgl_jt}
                          </span>
                          {(!row.is_paid && new Date(row.tgl_jt) < new Date(new Date().setHours(0,0,0,0))) && (
                            <span className="w-min px-1.5 py-[1px] rounded text-[9px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">Overdue</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.mata_uang_name}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-right">{row.saldo_invoice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                      <input 
                        type="checkbox" 
                        checked={row.is_paid} 
                        onChange={() => handleTogglePaid(row)} 
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer" 
                      />
                    </td>
                    <td className="px-3 py-1.5 text-center flex justify-center gap-1">
                      <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors hover:bg-blue-50" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Totals */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end shrink-0">
          <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm">
            <span className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide">Total</span>
            <span className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 border-r border-slate-300">IDR</span>
            <span className="px-5 py-2 text-sm font-bold text-slate-900 text-right min-w-[160px]">
              {Number(totalSaldo).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Form Modal untuk TAMBAH BARU Saldo Awal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-base tracking-wide">{editForm.id ? 'Ubah Saldo Awal Piutang' : 'Tambah Saldo Awal Piutang'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-300 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. Invoice *</label>
                  <input type="text" value={editForm.no_invoice} onChange={e => setEditForm({...editForm, no_invoice: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal *</label>
                  <input type="date" value={editForm.tanggal} onChange={e => setEditForm({...editForm, tanggal: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pelanggan *</label>
                <select value={editForm.pelanggan_id || ''} onChange={e => setEditForm({...editForm, pelanggan_id: Number(e.target.value)})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm">
                  <option value="">-- Pilih Pelanggan --</option>
                  {pelanggans.map(p => <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>)}
                </select>
                {editForm.pelanggan_id && (
                  <div className="mt-2 px-3 py-2 bg-slate-100/80 border border-slate-200 rounded-sm text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold block text-slate-700 mb-0.5">Alamat Pelanggan:</span>
                    {pelanggans.find(p => p.id === editForm.pelanggan_id)?.alamat || <em className="text-slate-400">Tidak ada data alamat</em>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proyek</label>
                  <select value={editForm.proyek_id || ''} onChange={e => setEditForm({...editForm, proyek_id: Number(e.target.value)})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm">
                    <option value="">-- Pilih Proyek --</option>
                    {proyeks.map(p => <option key={p.id} value={p.id}>{p.kode} - {p.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tgl Jatuh Tempo</label>
                  <input type="date" value={editForm.tgl_jt} onChange={e => setEditForm({...editForm, tgl_jt: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Uang (Ccy)</label>
                  <select value={editForm.mata_uang_id || ''} onChange={e => setEditForm({...editForm, mata_uang_id: Number(e.target.value)})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm">
                    <option value="">-- Pilih Mata Uang --</option>
                    {mataUangs.map(m => <option key={m.id} value={m.id}>{m.kode} - {m.nama}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Saldo Invoice</label>
                  <input type="number" value={editForm.saldo_invoice === '' ? '' : editForm.saldo_invoice} onChange={e => setEditForm({...editForm, saldo_invoice: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm text-right" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_paid" checked={editForm.is_paid} onChange={e => setEditForm({...editForm, is_paid: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                <label htmlFor="is_paid" className="text-sm font-semibold text-slate-700">Sudah Lunas (Paid)</label>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsFormOpen(false)} className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">Batal</button>
              <button onClick={handleSave} className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Save size={14} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal rendering actual SetupPelanggan */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-3 bg-slate-800 text-white shrink-0">
              <h3 className="font-semibold text-base">Tambah Pelanggan Baru</h3>
              <button 
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  fetchPelanggansOnly(); // Refresh pelanggan list after closing modal
                }} 
                className="hover:text-slate-300 transition-colors"
              ><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col bg-slate-50 min-h-0">
              <SetupPelangganForm 
                onClose={() => setIsCustomerModalOpen(false)}
                onSuccess={() => {
                  toast.success('Pelanggan baru berhasil ditambahkan!');
                  setIsCustomerModalOpen(false);
                  fetchPelanggansOnly();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Migration Modal */}
      {isMigrationModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20">
          <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-[500px] overflow-hidden">
            <div className="px-4 py-3 bg-slate-800 text-white flex justify-between items-center border-b border-slate-700">
              <h3 className="font-semibold">Migrasi Data</h3>
              <button onClick={() => setIsMigrationModalOpen(false)}><X size={18} /></button>
            </div>
            
            <div className="p-2 border-b border-slate-200 bg-slate-50 flex gap-2">
              <button onClick={() => setIsMigrationModalOpen(false)} className="px-4 py-1.5 bg-white border border-slate-300 shadow-sm text-sm font-medium rounded-sm hover:bg-slate-100"> BATAL </button>
              <button 
                onClick={handleMigration} 
                disabled={isMigrating}
                className="px-4 py-1.5 bg-blue-600 text-white border border-blue-700 shadow-sm text-sm font-medium rounded-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isMigrating ? 'Processing...' : 'Done'}
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-700 mb-6 font-medium leading-relaxed">
                Proses Migrasi Data akan mengimpor data Wajib Pajak dari program Krishand Faktur Pajak.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Input dengan lengkap Nama Folder & Nama File Data Krishand Faktur Pajak
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={migrationFolder}
                      onChange={(e) => setMigrationFolder(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="px-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm font-bold text-slate-600">...</button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">*Pada web app, tombol ini akan membuka dialog unggah file komputer Anda (.mdb/.csv)</p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold text-slate-700">Jenis Data:</label>
                  <select 
                    value={migrationType}
                    onChange={(e) => setMigrationType(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-sm text-sm focus:border-blue-500"
                  >
                    <option>Krishand Faktur Pajak</option>
                    <option>Krishand ERP</option>
                    <option>Excel (.xlsx)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaldoAwalPiutang;
