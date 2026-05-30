import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Settings2 } from 'lucide-react';
import { setupApi, FormatBuktiData } from '../api';

const TRANSACTIONS = [
  { id: 'inv_vat', label: 'Invoice VAT' },
  { id: 'inv_non_vat', label: 'Invoice Non-VAT' },
  { id: 'kwi_vat', label: 'Kwitansi VAT' },
  { id: 'kwi_non_vat', label: 'Kwitansi Non-VAT' },
  { id: 'pem_inv', label: 'Pembayaran Invoice' },
  { id: 'nota_kredit', label: 'Nota Kredit' },
  { id: 'so', label: 'Sales Order' },
  { id: 'sj', label: 'Surat Jalan' },
  { id: 'retur_jual', label: 'Retur Penjualan' },
  { id: 'retur_beli', label: 'Retur Pembelian Barang' },
  { id: 'terima_brg', label: 'Penerimaan Barang' },
  { id: 'adj_inv', label: 'Adjustment Inventory' },
  { id: 'tf_brg', label: 'Transfer Barang' }
];

const emptyForm: FormatBuktiData = {
  periode: '',
  inv_vat_prefiks: 'FT/', inv_vat_digit: '3', inv_vat_sufiks: '',
  inv_non_vat_prefiks: 'FN/', inv_non_vat_digit: '3', inv_non_vat_sufiks: '',
  kwi_vat_prefiks: 'KT/', kwi_vat_digit: '3', kwi_vat_sufiks: '',
  kwi_non_vat_prefiks: 'KN/', kwi_non_vat_digit: '3', kwi_non_vat_sufiks: '',
  pem_inv_prefiks: 'BM/', pem_inv_digit: '3', pem_inv_sufiks: '',
  nota_kredit_prefiks: 'NK/', nota_kredit_digit: '3', nota_kredit_sufiks: '',
  so_prefiks: 'SO/', so_digit: '3', so_sufiks: '',
  sj_prefiks: 'SJ/', sj_digit: '3', sj_sufiks: '',
  retur_jual_prefiks: 'RJ/', retur_jual_digit: '3', retur_jual_sufiks: '',
  retur_beli_prefiks: 'RB/', retur_beli_digit: '3', retur_beli_sufiks: '',
  terima_brg_prefiks: 'BTB/', terima_brg_digit: '3', terima_brg_sufiks: '',
  adj_inv_prefiks: 'ADJ/', adj_inv_digit: '3', adj_inv_sufiks: '',
  tf_brg_prefiks: 'TF/', tf_brg_digit: '3', tf_brg_sufiks: ''
};

const SetupFormatBukti: React.FC = () => {
  const [list, setList] = useState<FormatBuktiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<FormatBuktiData>(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await setupApi.getFormatBukti();
      setList(data || []);
    } catch (error) {
      showMessage('Gagal memuat data format bukti.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddNew = () => {
    const today = new Date();
    const currentPeriode = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`;
    const sufiks = `/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    
    // Auto populate sufiks based on current period
    const newForm = { ...emptyForm, periode: currentPeriode };
    TRANSACTIONS.forEach(t => {
      (newForm as any)[`${t.id}_sufiks`] = sufiks;
    });

    setEditForm(newForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: FormatBuktiData) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.periode) {
      showMessage('Periode (yyyymm) harus diisi!', 'error');
      return;
    }

    try {
      await setupApi.saveFormatBukti(editForm);
      showMessage('Data format bukti berhasil disimpan!', 'success');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menyimpan data (Pastikan Periode unik).', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus format ini?')) return;
    
    try {
      await setupApi.deleteFormatBukti(id);
      showMessage('Data berhasil dihapus!', 'success');
      fetchData();
    } catch (error) {
      showMessage('Terjadi kesalahan saat menghapus data.', 'error');
    }
  };

  const handleApplySufiksToAll = () => {
    const sufiksRef = editForm.inv_vat_sufiks;
    if (!sufiksRef) {
      alert("Isi Sufiks pada Invoice VAT terlebih dahulu untuk di-copy ke semua baris.");
      return;
    }
    const newForm = { ...editForm };
    TRANSACTIONS.forEach(t => {
      (newForm as any)[`${t.id}_sufiks`] = sufiksRef;
    });
    setEditForm(newForm);
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 text-sm transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-7xl mx-auto mt-4 h-full flex flex-col">
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Format No Bukti</h2>
          <p className="text-xs text-slate-300 mt-1">Konfigurasi penomoran dokumen per bulan/periode (Invoice, Kwitansi, SO, dll).</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} />
          <span>TAMBAH PERIODE BARU</span>
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">
        {message && (
          <div className={`mb-4 p-3 rounded-sm flex items-start gap-3 shadow-sm border shrink-0 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
              <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-32 flex-1">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
          </div>
        ) : (
          <div className="overflow-auto border border-slate-200 flex-1">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3 w-32">Periode</th>
                  <th className="px-4 py-3">Contoh No. Invoice VAT</th>
                  <th className="px-4 py-3">Contoh No. SO</th>
                  <th className="px-4 py-3">Contoh No. SJ</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {list.map((item, index) => {
                  const inv_sample = `${item.inv_vat_prefiks}001${item.inv_vat_sufiks}`;
                  const so_sample = `${item.so_prefiks}001${item.so_sufiks}`;
                  const sj_sample = `${item.sj_prefiks}001${item.sj_sufiks}`;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{item.periode}</td>
                      <td className="px-4 py-3 font-mono text-xs">{inv_sample}</td>
                      <td className="px-4 py-3 font-mono text-xs">{so_sample}</td>
                      <td className="px-4 py-3 font-mono text-xs">{sj_sample}</td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit Detail">
                          <Settings2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                
                {list.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500 text-sm bg-slate-50">
                      Belum ada konfigurasi format nomor bukti. Klik "Tambah Periode Baru".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full max-w-6xl flex flex-col h-[90vh] border border-slate-300">
            <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-base tracking-wide">
                {editForm.id ? `Edit Format Bukti - Periode ${editForm.periode}` : 'Tambah Format Bukti Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col text-sm bg-slate-50">
              <div className="mb-6 flex items-center gap-4 bg-blue-50 p-4 border border-blue-100 rounded-sm">
                <label className="font-semibold text-slate-800">Periode Aktif (yyyymm):</label>
                <input 
                  type="text" 
                  value={editForm.periode} 
                  onChange={e => setEditForm({...editForm, periode: e.target.value})}
                  className="px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-center w-32"
                  placeholder="Contoh: 202605"
                />
                <button 
                  onClick={handleApplySufiksToAll}
                  className="ml-auto px-4 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors rounded-sm"
                  title="Salin isi sufiks baris pertama ke seluruh baris di bawahnya"
                >
                  Copy Sufiks Baris 1 ke Semua Baris
                </button>
              </div>

              <div className="border border-slate-300 overflow-hidden rounded-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-800 text-white text-xs font-semibold">
                    <tr>
                      <th className="px-4 py-3 border-r border-slate-600 w-1/4">Jenis Dokumen</th>
                      <th className="px-4 py-3 border-r border-slate-600 w-1/4">Prefiks (Awalan)</th>
                      <th className="px-4 py-3 border-r border-slate-600 w-1/4">Jumlah Digit (Auto-Number)</th>
                      <th className="px-4 py-3 w-1/4">Sufiks (Akhiran)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {TRANSACTIONS.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-2 font-medium text-slate-700 border-r border-slate-200 bg-slate-50">
                          {tx.label}
                        </td>
                        <td className="px-4 py-2 border-r border-slate-200">
                          <input 
                            type="text" 
                            value={(editForm as any)[`${tx.id}_prefiks`] || ''} 
                            onChange={e => setEditForm({...editForm, [`${tx.id}_prefiks`]: e.target.value.toUpperCase()})}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-2 border-r border-slate-200">
                          <select
                            value={(editForm as any)[`${tx.id}_digit`] || '3'} 
                            onChange={e => setEditForm({...editForm, [`${tx.id}_digit`]: e.target.value})}
                            className={inputClass}
                          >
                            <option value="3">3 Digit (001)</option>
                            <option value="4">4 Digit (0001)</option>
                            <option value="5">5 Digit (00001)</option>
                            <option value="6">6 Digit (000001)</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            type="text" 
                            value={(editForm as any)[`${tx.id}_sufiks`] || ''} 
                            onChange={e => setEditForm({...editForm, [`${tx.id}_sufiks`]: e.target.value.toUpperCase()})}
                            className={inputClass}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2 rounded-sm"
              >
                <Save size={14} /> Simpan Konfigurasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupFormatBukti;
