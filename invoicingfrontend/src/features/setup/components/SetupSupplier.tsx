import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, FileSpreadsheet, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import Pagination from '../../../components/ui/Pagination';
import { setupApi, SupplierData, PembayaranData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import toast from 'react-hot-toast';

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

const SetupSupplier: React.FC = () => {
  const [pembayarans, setPembayarans] = useState<PembayaranData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSupplier = async () => {
    const [suppliersData, pembayaransData] = await Promise.all([
      setupApi.getSupplier(),
      setupApi.getPembayaran()
    ]);
    setPembayarans(pembayaransData || []);
    return suppliersData || [];
  };

  const {
    list, isLoading, setIsLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleAddNew, handleEdit, handleSave, handleDelete, fetchData
  } = useMasterDataCRUD<SupplierData>({
    fetchApi: fetchSupplier,
    saveApi: setupApi.saveSupplier,
    deleteApi: setupApi.deleteSupplier,
    initialForm: {
      kode: '', nama: '', alamat: '', telepon: '', fax: '', email: '',
      contact_person: '', no_hp: '', nama_wp: '', alamat_wp: '', npwp: '',
      tgl_pengukuhan: '', no_seri_fp_masukan: '', is_pkp: false,
      jenis_transaksi: '01', pembayaran_id: null, keterangan: ''
    },
    validate: (form) => (!form.kode || !form.nama) ? 'Kode dan Nama Supplier harus diisi!' : null
  });

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 text-xs transition-colors rounded-sm disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed";

  const handleExportExcel = () => {
    const exportData = list.map(item => ({
      "Kode Supplier": item.kode || "",
      "Nama Supplier": item.nama || "",
      "Alamat Supplier": item.alamat || "",
      "Nomor Telepon": item.telepon || "",
      "Nomor Fax": item.fax || "",
      "E-mail": item.email || "",
      "Contact Person": item.contact_person || "",
      "No. HP": item.no_hp || "",
      "Nama Wajib Pajak": item.nama_wp || "",
      "Alamat Wajib Pajak": item.alamat_wp || "",
      "NPWP": item.npwp || "",
      "Tgl Pengukuhan": item.tgl_pengukuhan || "",
      "No. Seri FP Masukan": item.no_seri_fp_masukan || "",
      "Apakah PKP ?": item.is_pkp ? "Ya" : "Tidak",
      "Jenis Transaksi": JENIS_TRANSAKSI.find(j => j.value === item.jenis_transaksi)?.label || item.jenis_transaksi || "",
      "Cara Pembayaran": pembayarans.find(p => p.id === item.pembayaran_id)?.nama || "",
      "Keterangan": item.keterangan || ""
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data_Supplier");
    XLSX.writeFile(wb, "Data_Supplier.xlsx");
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const itemsToImport = data.map(row => {
          const jenisTransaksiLabel = row['Jenis Transaksi'] || '';
          const matchedJenis = JENIS_TRANSAKSI.find(j => j.label === jenisTransaksiLabel || j.value === jenisTransaksiLabel);
          
          const caraPembayaranNama = row['Cara Pembayaran'] || '';
          const matchedPembayaran = pembayarans.find(p => p.nama === caraPembayaranNama);

          return {
            kode: row['Kode Supplier'] || row['Kode'] || row['KODE'],
            nama: row['Nama Supplier'] || row['NAMA'],
            alamat: row['Alamat Supplier'] || row['Alamat'] || '',
            telepon: row['Nomor Telepon'] || row['Telepon'] || row['TELEPON'] || '',
            fax: row['Nomor Fax'] || row['Fax'] || '',
            email: row['E-mail'] || row['Email'] || '',
            contact_person: row['Contact Person'] || row['CONTACT_PERSON'] || '',
            no_hp: row['No. HP'] || row['No HP'] || '',
            nama_wp: row['Nama Wajib Pajak'] || '',
            alamat_wp: row['Alamat Wajib Pajak'] || '',
            npwp: row['NPWP'] || '',
            tgl_pengukuhan: row['Tgl Pengukuhan'] || '',
            no_seri_fp_masukan: row['No. Seri FP Masukan'] || '',
            is_pkp: (row['Apakah PKP ?'] || '').toString().toLowerCase() === 'ya',
            jenis_transaksi: matchedJenis?.value || '01',
            pembayaran_id: matchedPembayaran?.id || null,
            keterangan: row['Keterangan'] || ''
          };
        }).filter(i => i.kode && i.nama);

        if (itemsToImport.length === 0) {
          toast.error('Format file Excel tidak valid atau data kosong.');
          return;
        }

        setIsLoading(true);
        const importPromise = Promise.all(itemsToImport.map(item => setupApi.saveSupplier(item as SupplierData)));
        
        await toast.promise(importPromise, {
          loading: 'Mengimpor data supplier...',
          success: 'Data supplier berhasil diimpor!',
          error: 'Gagal mengimpor data supplier.'
        });

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

  return (
    <div className="bg-white shadow-sm border border-slate-300 w-full mx-auto mt-4 h-full flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Supplier (Vendor)</h2>
          <p className="text-xs text-slate-300 mt-1">Daftar pemasok barang/jasa untuk keperluan pembelian.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImportExcel} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 transition-colors"
          >
            <Upload size={14} />
            <span>IMPORT DARI EXCEL</span>
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            <FileSpreadsheet size={14} />
            <span>EKSPOR KE EXCEL</span>
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
                  <th className="px-4 py-3">Nama Supplier</th>
                  <th className="px-4 py-3">NPWP</th>
                  <th className="px-4 py-3">Telepon</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Cara Pembayaran</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {list.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 text-center text-slate-500">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="px-4 py-2.5 font-medium">{item.kode}</td>
                    <td className="px-4 py-2.5 font-bold">{item.nama}</td>
                    <td className="px-4 py-2.5">{item.npwp || '-'}</td>
                    <td className="px-4 py-2.5">{item.telepon || '-'}</td>
                    <td className="px-4 py-2.5">{item.contact_person || '-'}</td>
                    <td className="px-4 py-2.5">{item.pembayaran_nama || '-'}</td>
                    <td className="px-4 py-2.5 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="UBAH">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {list.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm bg-slate-50">
                      Belum ada data supplier. Klik "Tambah Baru".
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

      {/* Modal Form Supplier */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 ">
          <div className="bg-white shadow-2xl max-w-4xl w-full flex flex-col max-h-[95vh] border border-slate-300">
            {/* Header Modern */}
            <div className="px-6 py-4 bg-slate-800 text-white flex justify-between items-center shrink-0">
              <h3 className="font-semibold text-base tracking-wide">
                {editForm.id ? 'UBAH Supplier' : 'Tambah Supplier Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm bg-slate-50">
              
              <div className="flex gap-8">
                {/* Kolom Kiri */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center">
                    <label className="w-36 text-xs font-semibold text-slate-700 shrink-0">Kode Supplier</label>
                    <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={`${inputClass} w-32`} autoFocus/>
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-xs font-semibold text-slate-700 shrink-0">Nama Supplier</label>
                    <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex items-start">
                    <label className="w-36 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Supplier</label>
                    <textarea value={editForm.alamat || ''} onChange={e => setEditForm({...editForm, alamat: e.target.value})} className={`${inputClass} h-16 resize-none`} />
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-36 text-xs font-semibold text-slate-700 shrink-0">Nomor Telepon</label>
                      <input type="text" value={editForm.telepon || ''} onChange={e => setEditForm({...editForm, telepon: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-36 text-xs font-semibold text-slate-700 shrink-0">Nomor Fax</label>
                      <input type="text" value={editForm.fax || ''} onChange={e => setEditForm({...editForm, fax: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="w-36 text-xs font-semibold text-slate-700 shrink-0">E-mail</label>
                    <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-36 text-xs font-semibold text-slate-700 shrink-0">Contact Person</label>
                      <input type="text" value={editForm.contact_person || ''} onChange={e => setEditForm({...editForm, contact_person: e.target.value})} className={inputClass} />
                    </div>
                    <div className="w-32 flex items-center">
                      <label className="w-16 text-xs font-semibold text-slate-700 shrink-0 pr-3">No. HP</label>
                      <input type="text" value={editForm.no_hp || ''} onChange={e => setEditForm({...editForm, no_hp: e.target.value})} className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Kolom Kanan */}
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Nama Wajib Pajak</label>
                    <input type="text" value={editForm.nama_wp || ''} onChange={e => setEditForm({...editForm, nama_wp: e.target.value})} className={inputClass} />
                  </div>
                  <div className="flex items-start">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Wajib Pajak</label>
                    <textarea value={editForm.alamat_wp || ''} onChange={e => setEditForm({...editForm, alamat_wp: e.target.value})} className={`${inputClass} h-16 resize-none`} />
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">NPWP</label>
                      <input type="text" value={editForm.npwp || ''} onChange={e => setEditForm({...editForm, npwp: e.target.value})} className={inputClass} placeholder="00.000.000.0-000.000" />
                    </div>
                    <div className="flex items-center pl-2 gap-2 shrink-0">
                      <input 
                        type="checkbox" 
                        id="supplier_is_pkp"
                        checked={editForm.is_pkp || false} 
                        onChange={e => {
                          const checked = e.target.checked;
                          setEditForm({
                            ...editForm, 
                            is_pkp: checked,
                            tgl_pengukuhan: checked ? editForm.tgl_pengukuhan : '',
                            no_seri_fp_masukan: checked ? editForm.no_seri_fp_masukan : ''
                          });
                        }} 
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
                      />
                      <label htmlFor="supplier_is_pkp" className="text-xs font-semibold text-slate-700 cursor-pointer">Apakah PKP ?</label>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center">
                      <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Tgl Pengukuhan</label>
                      <input disabled={!editForm.is_pkp} type="date" value={editForm.tgl_pengukuhan || ''} onChange={e => setEditForm({...editForm, tgl_pengukuhan: e.target.value})} className={inputClass} />
                    </div>
                    <div className="flex-1"></div>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No. Seri FP Masukan</label>
                    <input disabled={!editForm.is_pkp} type="text" value={editForm.no_seri_fp_masukan || ''} onChange={e => setEditForm({...editForm, no_seri_fp_masukan: e.target.value})} className={inputClass} placeholder={editForm.is_pkp ? '' : 'Centang PKP terlebih dahulu'} />
                  </div>
                  
                  <div className="h-4 border-b border-slate-200"></div>
                  
                  <div className="flex items-center mt-2">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Jenis Transaksi</label>
                    <select value={editForm.jenis_transaksi || '01'} onChange={e => setEditForm({...editForm, jenis_transaksi: e.target.value})} className={inputClass}>
                      {JENIS_TRANSAKSI.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Cara Pembayaran</label>
                    <select value={editForm.pembayaran_id || ''} onChange={e => setEditForm({...editForm, pembayaran_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                      <option value=""></option>
                      {pembayarans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex items-start">
                    <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Keterangan</label>
                    <textarea value={editForm.keterangan || ''} onChange={e => setEditForm({...editForm, keterangan: e.target.value})} className={`${inputClass} h-12 resize-none`} />
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

export default SetupSupplier;
