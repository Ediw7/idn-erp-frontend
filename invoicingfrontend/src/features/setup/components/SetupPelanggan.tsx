import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, Upload, FileSpreadsheet, Download } from 'lucide-react';
import Pagination from '../../../components/ui/Pagination';
import { setupApi, PelangganData, PembayaranData, PerkiraanData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const JENIS_TRANSAKSI = [
  { value: '01', label: 'Kepada Bukan Pemungut PPN (01)' },
  { value: '02', label: 'Kepada Pemungut Bendaharawan (02)' },
  { value: '03', label: 'Kepada Pemungut Selain Bendaharawan (03)' },
  { value: '04', label: 'DPP Nilai Lain (04)' },
  { value: '06', label: 'Penyerahan Lainnya (06)' },
  { value: '07', label: 'Penyerahan yang Tidak Dipungut PPN (07)' },
  { value: '08', label: 'Penyerahan yang Dibebaskan dari Pengenaan PPN (08)' },
  { value: '09', label: 'Penyerahan Aktiva (09)' }
];

const SetupPelanggan: React.FC = () => {
  const [pembayarans, setPembayarans] = useState<PembayaranData[]>([]);
  const [perkiraans, setPerkiraans] = useState<PerkiraanData[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPelanggans = async () => {
    const [pelanggansData, pembayaransData, perkiransData] = await Promise.all([
      setupApi.getPelanggan(),
      setupApi.getPembayaran(),
      setupApi.getPerkiraan()
    ]);
    setPembayarans(pembayaransData || []);
    setPerkiraans(perkiransData || []);
    return pelanggansData || [];
  };

  const {
    list, isLoading, setIsLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleAddNew, handleEdit, handleSave, handleDelete, fetchData
  } = useMasterDataCRUD<PelangganData>({
    fetchApi: fetchPelanggans,
    saveApi: setupApi.savePelanggan,
    deleteApi: setupApi.deletePelanggan,
    initialForm: {
      kode: '', is_ekspor: false, nama: '', alamat: '', telepon: '', fax: '', alamat_kirim: '', telepon_kirim: '',
      fax_kirim: '', nama_wp: '', npwp: '', nik: '', alamat_wp: '', jenis_transaksi: '01', ket_tambahan: '', email: '',
      contact_person: '', no_hp: '', jabatan: '', pembayaran_id: null, tingkat_harga: '1', diskon: 0, perk_piutang_id: null, keterangan: ''
    },
    validate: (form) => (!form.kode || !form.nama) ? 'Kode dan Nama Pelanggan harus diisi!' : null
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        // Map excel data to our interface
        const itemsToImport = data.map(row => ({
          kode: row['Kode Pelanggan'] || row['KODE'],
          nama: row['Nama Pelanggan'] || row['NAMA'],
          alamat: row['Alamat Pelanggan'] || row['ALAMAT'],
          telepon: row['No. Telepon'] || row['TELEPON'],
          fax: row['No. Fax'] || row['FAX'],
          nama_wp: row['Nama Wajib Pajak'] || row['NAMA_WP'],
          npwp: row['NPWP'],
          alamat_wp: row['Alamat Wajib Pajak'] || row['ALAMAT_WP']
        })).filter(i => i.kode && i.nama); // Must have at least kode and nama

        if (itemsToImport.length === 0) {
          toast.error('Format file Excel tidak valid atau data kosong.');
          return;
        }

        setIsLoading(true);
        const res = await setupApi.importBatchPelanggan(itemsToImport);
        toast.success(res.message);
        setIsImportModalOpen(false);
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error('Gagal membaca file Excel atau format salah.');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        "Kode Pelanggan": "C001",
        "Nama Pelanggan": "PT Contoh Maju",
        "Alamat Pelanggan": "Jl. Sudirman No 1",
        "No. Telepon": "021-123456",
        "No. Fax": "021-123457",
        "Nama Wajib Pajak": "PT Contoh Maju Tbk",
        "Alamat Wajib Pajak": "Jl. Sudirman No 1",
        "NPWP": "01.234.567.8-901.000"
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pelanggan");
    XLSX.writeFile(wb, "Template_Import_Pelanggan.xlsx");
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 text-xs transition-colors rounded-sm";

  return (
    <div className="bg-white shadow-sm border border-slate-300 w-full mx-auto mt-4 h-full flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Pelanggan (Customer)</h2>
          <p className="text-xs text-slate-300 mt-1">Daftar pelanggan, NPWP, dan aturan harga/diskon.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 transition-colors"
          >
            <Upload size={14} />
            <span>IMPORT DARI EXCEL</span>
          </button>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
          >
            <Plus size={14} />
            <span>TAMBAH BARU</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col min-h-0">

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
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama Pelanggan</th>
                  <th className="px-4 py-3">NPWP</th>
                  <th className="px-4 py-3">Telepon</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Cara Pembayaran</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {list.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item, index) => (
                  <tr key={item.id} onClick={() => handleEdit(item)} className="hover:bg-slate-100 transition-colors cursor-pointer">
                    <td className="px-4 py-2.5 text-center text-slate-500">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-2.5 font-medium">{item.kode}</td>
                    <td className="px-4 py-2.5 font-bold">{item.nama}</td>
                    <td className="px-4 py-2.5">{item.npwp || '-'}</td>
                    <td className="px-4 py-2.5">{item.telepon || '-'}</td>
                    <td className="px-4 py-2.5">{item.contact_person || '-'}</td>
                    <td className="px-4 py-2.5">{item.pembayaran_nama || '-'}</td>
                    <td className="px-4 py-2.5 flex justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="UBAH">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id!); }} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {list.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm bg-slate-50">
                      Belum ada data pelanggan. Klik "Tambah Baru" atau "Import Dari Excel".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination 
              currentPage={currentPage} 
              totalPages={Math.ceil(list.length / rowsPerPage)} 
              onPageChange={setCurrentPage} 
              totalItems={list.length} 
              itemsPerPage={rowsPerPage} 
            />
          </div>
        )}
      </div>

      {/* Modal Import Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded shadow-xl max-w-md w-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-emerald-600"/> Import Data Excel
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Pilih file Excel (.xlsx atau .xls) yang berisi daftar pelanggan. Pastikan format kolom sesuai dengan template standar.
              </p>
              
              <button 
                onClick={downloadTemplate}
                className="mb-6 flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Download size={14} /> Download Template Excel
              </button>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Klik untuk memilih file</p>
                <p className="text-xs text-slate-500 mt-1">.xlsx, .xls didukung</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".xlsx, .xls"
                  className="hidden" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl max-w-5xl w-full flex flex-col max-h-[95vh] border border-slate-300">
            {/* Header Modern */}
            <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-base tracking-wide">
                {editForm.id ? 'UBAH Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm bg-slate-50">
              
              <div className="flex gap-8">
                {/* Kolom Kiri */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                      <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Kode Pelanggan</label>
                      <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={`${inputClass} w-32`} autoFocus/>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input type="checkbox" checked={editForm.is_ekspor || false} onChange={e => setEditForm({...editForm, is_ekspor: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                      Ekspor
                    </label>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Nama Pelanggan</label>
                    <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex items-start">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Pelanggan</label>
                    <textarea value={editForm.alamat || ''} onChange={e => setEditForm({...editForm, alamat: e.target.value})} className={`${inputClass} h-16 resize-none`} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No. Telepon</label>
                      <input type="text" value={editForm.telepon || ''} onChange={e => setEditForm({...editForm, telepon: e.target.value})} className={inputClass} />
                    </div>
                    <div className="flex-1 flex items-center">
                      <label className="w-20 text-xs font-semibold text-slate-700 shrink-0 text-right pr-3">No. Fax</label>
                      <input type="text" value={editForm.fax || ''} onChange={e => setEditForm({...editForm, fax: e.target.value})} className={inputClass} />
                    </div>
                  </div>

                  <div className="h-4 border-b border-slate-200"></div>

                  <div className="flex items-start mt-2">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Pengiriman</label>
                    <textarea value={editForm.alamat_kirim || ''} onChange={e => setEditForm({...editForm, alamat_kirim: e.target.value})} className={`${inputClass} h-16 resize-none`} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No. Tlp Kirim</label>
                      <input type="text" value={editForm.telepon_kirim || ''} onChange={e => setEditForm({...editForm, telepon_kirim: e.target.value})} className={inputClass} />
                    </div>
                    <div className="flex-1 flex items-center">
                      <label className="w-20 text-xs font-semibold text-slate-700 shrink-0 text-right pr-3">Fax Kirim</label>
                      <input type="text" value={editForm.fax_kirim || ''} onChange={e => setEditForm({...editForm, fax_kirim: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Nama Wajib Pajak</label>
                    <input type="text" value={editForm.nama_wp || ''} onChange={e => setEditForm({...editForm, nama_wp: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">NPWP</label>
                    <input type="text" value={editForm.npwp || ''} onChange={e => setEditForm({...editForm, npwp: e.target.value})} className={inputClass} placeholder="00.000.000.0-000.000" />
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No KTP</label>
                    <input type="text" value={editForm.nik || ''} onChange={e => setEditForm({...editForm, nik: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex items-start">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Wajib Pajak</label>
                    <textarea value={editForm.alamat_wp || ''} onChange={e => setEditForm({...editForm, alamat_wp: e.target.value})} className={`${inputClass} h-16 resize-none`} />
                  </div>
                  
                  <div className="h-4 border-b border-slate-200"></div>
                  
                  <div className="flex items-center mt-2">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Jenis Transaksi</label>
                    <select value={editForm.jenis_transaksi || '01'} onChange={e => setEditForm({...editForm, jenis_transaksi: e.target.value})} className={inputClass}>
                      {JENIS_TRANSAKSI.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Ket Tambahan</label>
                    <input type="text" value={editForm.ket_tambahan || ''} onChange={e => setEditForm({...editForm, ket_tambahan: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Contact Person</label>
                      <input type="text" value={editForm.contact_person || ''} onChange={e => setEditForm({...editForm, contact_person: e.target.value})} className={inputClass} />
                    </div>
                    <div className="flex-1 flex items-center">
                      <label className="w-16 text-xs font-semibold text-slate-700 shrink-0 text-right pr-3">No HP</label>
                      <input type="text" value={editForm.no_hp || ''} onChange={e => setEditForm({...editForm, no_hp: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Email</label>
                    <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className={inputClass} />
                  </div>
                </div>
              </div>

              {/* Bottom Configs */}
              <div className="mt-2 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Cara Pembayaran</label>
                    <select value={editForm.pembayaran_id || ''} onChange={e => setEditForm({...editForm, pembayaran_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                      <option value=""></option>
                      {pembayarans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Tingkatan Harga Jual</label>
                    <select value={editForm.tingkat_harga || '1'} onChange={e => setEditForm({...editForm, tingkat_harga: e.target.value})} className={`${inputClass} w-40`}>
                      <option value="1">Harga Jual 1</option>
                      <option value="2">Harga Jual 2</option>
                      <option value="3">Harga Jual 3</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Discount Harga Jual</label>
                    <div className="flex items-center w-32">
                      <input type="number" value={editForm.diskon || 0} onChange={e => setEditForm({...editForm, diskon: Number(e.target.value)})} className={`${inputClass} text-right`} />
                      <span className="text-xs font-semibold text-slate-700 ml-2">%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No Perkiraan Piutang</label>
                    <select value={editForm.perk_piutang_id || ''} onChange={e => setEditForm({...editForm, perk_piutang_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                      <option value=""></option>
                      {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan} - {p.nama_perkiraan}</option>)}
                    </select>
                  </div>
                  <div className="flex items-start">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Keterangan</label>
                    <textarea value={editForm.keterangan || ''} onChange={e => setEditForm({...editForm, keterangan: e.target.value})} className={`${inputClass} h-16 resize-none`} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer Modern */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Save size={14} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPelanggan;
