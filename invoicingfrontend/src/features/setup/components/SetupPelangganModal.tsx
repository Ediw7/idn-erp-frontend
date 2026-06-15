import React, { useState } from 'react';
import { X, Save, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { setupApi, PelangganData } from '../api';
import { useAuth } from '../../auth/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => BATALKAN;
  onSaved: () => BATALKAN;
}

const emptyForm: Partial<PelangganData> = {
  kode: '',
  nama: '',
  is_ekspor: false,
  alamat: '',
  no_telp: '',
  no_fax: '',
  alamat_kirim: '',
  no_telp_kirim: '',
  no_fax_kirim: '',
  nama_wp: '',
  npwp: '',
  no_ktp: '',
  alamat_wp: '',
  jenis_transaksi: '1',
  ket_tambahan: '',
  email: '',
  contact_person: '',
  no_hp: '',
  jabatan: '',
  cara_pembayaran: '',
  tingkatan_harga_jual: '',
  discount_harga_jual: 0,
  no_perkiraan_piutang: '',
  keterangan: ''
};

EKSPOR const SetupPelangganModal: React.FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const { user } = useAuth();
  const [form, setForm] = useState<Partial<PelangganData>>(emptyForm);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.kode || !form.nama) {
      toast.error('Kode dan Nama Pelanggan wajib diisi!');
      return;
    }
    setLoading(true);
    try {
      await setupApi.savePelanggan(form as PelangganData);
      toast.success('Pelanggan berhasil disimpan!');
      setForm(emptyForm);
      onSaved();
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan pelanggan');
    } finally {
      setLoading(false);
    }
  };

  const btnClass = "px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm";
  const inputClass = "w-full px-2 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 bg-white h-8";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-md shadow-2xl flex flex-col border border-slate-700 my-8">
        
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 rounded-t-md">
          <h2 className="text-lg font-bold text-white">Setup Pelanggan</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Kelompok 1: Informasi Umum & Pengiriman (Kolom Kiri) */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-200">Informasi Umum & Pengiriman</h3>
              
              <div>
                <label className={labelClass}>Kode Pelanggan</label>
                <div className="flex gap-2 w-full items-center">
                  <input type="text" className={`${inputClass} font-mono w-40 uppercase`} value={form.kode || ''} onChange={e => setForm({...form, kode: e.target.value})} />
                  <button className="px-3 h-8 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm flex items-center justify-center"><Search size={14}/></button>
                  <label className="ml-4 flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.is_ekspor || false} onChange={e => setForm({...form, is_ekspor: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Ekspor
                  </label>
                </div>
              </div>
              
              <div>
                <label className={labelClass}>Nama Pelanggan</label>
                <input type="text" className={inputClass} value={form.nama || ''} onChange={e => setForm({...form, nama: e.target.value})} />
              </div>

              <div>
                <label className={labelClass}>Alamat Pelanggan</label>
                <textarea className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 bg-white h-16 resize-none" value={form.alamat || ''} onChange={e => setForm({...form, alamat: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>No. Telepon</label>
                  <input type="text" className={inputClass} value={form.no_telp || ''} onChange={e => setForm({...form, no_telp: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>No. Fax</label>
                  <input type="text" className={inputClass} value={form.no_fax || ''} onChange={e => setForm({...form, no_fax: e.target.value})} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Alamat Pengiriman</label>
                <textarea className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 bg-white h-16 resize-none" value={form.alamat_kirim || ''} onChange={e => setForm({...form, alamat_kirim: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>No. Telp (Kirim)</label>
                  <input type="text" className={inputClass} value={form.no_telp_kirim || ''} onChange={e => setForm({...form, no_telp_kirim: e.target.value})} />
                </div>
                <div>
                  <label className={labelClass}>No. Fax (Kirim)</label>
                  <input type="text" className={inputClass} value={form.no_fax_kirim || ''} onChange={e => setForm({...form, no_fax_kirim: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="flex flex-col gap-6">
              
              {/* Kelompok 2: Informasi Pajak & Legal */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-200">Informasi Pajak & Legal</h3>
                
                <div>
                  <label className={labelClass}>Nama Wajib Pajak</label>
                  <input type="text" className={inputClass} value={form.nama_wp || ''} onChange={e => setForm({...form, nama_wp: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>NPWP</label>
                    <input type="text" className={`${inputClass} font-mono`} value={form.npwp || ''} onChange={e => setForm({...form, npwp: e.target.value})} placeholder="00.000.000.0-000.000" />
                  </div>
                  <div>
                    <label className={labelClass}>No KTP</label>
                    <input type="text" className={`${inputClass} font-mono`} value={form.no_ktp || ''} onChange={e => setForm({...form, no_ktp: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Alamat Wajib Pajak</label>
                  <textarea className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 bg-white h-16 resize-none" value={form.alamat_wp || ''} onChange={e => setForm({...form, alamat_wp: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Jenis Transaksi</label>
                    <select className={inputClass} value={form.jenis_transaksi || ''} onChange={e => setForm({...form, jenis_transaksi: e.target.value})}>
                      <option value="1">1 - Bukan Pemungut PPN</option>
                      <option value="2">2 - Pemungut Bendaharawan</option>
                      <option value="3">3 - Pemungut Selain Bendaharawan</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Ket Tambahan</label>
                    <select className={`${inputClass} bg-slate-200 text-slate-500 cursor-not-allowed`} disabled value={form.ket_tambahan || ''}>
                      <option value="">-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Kelompok 3: Kontak & Keuangan */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-200">Kontak & Keuangan</h3>
                
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" className={inputClass} value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Person</label>
                    <input type="text" className={inputClass} value={form.contact_person || ''} onChange={e => setForm({...form, contact_person: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>No HP</label>
                    <input type="text" className={inputClass} value={form.no_hp || ''} onChange={e => setForm({...form, no_hp: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Jabatan</label>
                    <input type="text" className={inputClass} value={form.jabatan || ''} onChange={e => setForm({...form, jabatan: e.target.value})} />
                  </div>
                  <div>
                    <label className={labelClass}>Cara Pembayaran</label>
                    <select className={inputClass} value={form.cara_pembayaran || ''} onChange={e => setForm({...form, cara_pembayaran: e.target.value})}>
                      <option value="">-- Pilih --</option>
                      <option value="Cash">Cash</option>
                      <option value="Kredit">Kredit</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Tingkatan Harga Jual</label>
                    <select className={inputClass} value={form.tingkatan_harga_jual || ''} onChange={e => setForm({...form, tingkatan_harga_jual: e.target.value})}>
                      <option value="">-- Pilih --</option>
                      <option value="Harga 1">Harga 1</option>
                      <option value="Harga 2">Harga 2</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Discount Harga Jual</label>
                    <div className="flex gap-2">
                      <input type="number" className={`${inputClass} text-right w-full`} value={form.discount_harga_jual || 0} onChange={e => setForm({...form, discount_harga_jual: Number(e.target.value)})} />
                      <span className="flex items-center justify-center bg-slate-100 border border-slate-300 rounded-sm px-3 font-bold text-slate-600">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>No Perkiraan Piutang</label>
                  <select className={inputClass} value={form.no_perkiraan_piutang || ''} onChange={e => setForm({...form, no_perkiraan_piutang: e.target.value})}>
                    <option value="">-- Pilih Akun --</option>
                    <option value="1130.00">1130.00 - Piutang Usaha</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Keterangan</label>
                  <textarea className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 bg-white h-16 resize-none" value={form.keterangan || ''} onChange={e => setForm({...form, keterangan: e.target.value})} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-300 flex justify-between items-center shrink-0 rounded-b-md">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Record Created</span>
              <span className="text-xs font-mono text-slate-700 bg-white px-2 py-0.5 border border-slate-200 rounded-sm mt-0.5 shadow-sm">- / {user?.name || 'Admin'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Record Modified</span>
              <span className="text-xs font-mono text-slate-700 bg-white px-2 py-0.5 border border-slate-200 rounded-sm mt-0.5 shadow-sm">- / {user?.name || 'Admin'}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onClose} className={`${btnClass} bg-white text-slate-700 border border-slate-300 hover:bg-slate-50`}>
              BATAL
            </button>
            <button onClick={handleSave} disabled={loading} className={`${btnClass} bg-blue-600 text-white border border-transparent hover:bg-blue-700 w-48 disabled:opacity-50`}>
              {loading ? 'MENYIMPAN...' : <><Save size={16} /> SIMPAN PELANGGAN</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
