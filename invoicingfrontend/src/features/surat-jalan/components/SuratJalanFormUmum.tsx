import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuratJalanFormUmumProps {
  form: any;
  setForm: (f: any) => void;
  pelanggans: any[];
  gudangs: any[];
  salesOrders: any[];
  handlePelangganChange: (form: any, setForm: any, val: string) => void;
  handleSOChange: (form: any, setForm: any, val: string) => void;
  user: any;
  inputClass: string;
  labelClass: string;
}

export const SuratJalanFormUmum: React.FC<SuratJalanFormUmumProps> = ({
  form, setForm, pelanggans, gudangs, salesOrders, handlePelangganChange, handleSOChange, user, inputClass, labelClass
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-300 rounded-sm shadow-sm p-6 shrink-0">
      <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Informasi Umum</h3>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Kolom Kiri */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start">
            <label className={labelClass}>No. Surat Jalan</label>
            <div className="flex gap-1 flex-1">
              <input type="text" className={`${inputClass} font-mono w-48 bg-slate-50`} readOnly value={form.no_sj || ''} />
              <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={14} /></button>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tanggal</label>
            <input type="date" className={`${inputClass} w-48`} value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Nama Pelanggan</label>
            <div className="flex gap-1 flex-1">
              <select className={inputClass} value={form.pelanggan_id || ''} onChange={e => handlePelangganChange(form, setForm, e.target.value)}>
                <option value="">-- Pilih --</option>
                {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
              </select>
              <button onClick={() => navigate('/setup/pelanggan')} className="px-3 py-1.5 font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm text-slate-600">+</button>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Dikirim ke Alamat</label>
            <textarea className={`${inputClass} h-20 resize-none bg-slate-50`} readOnly value={form.alamat_kirim || ''} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Gudang</label>
            <select className={`${inputClass} w-64`} value={form.gudang_id || ''} onChange={e => setForm({ ...form, gudang_id: e.target.value })}>
              <option value="">-- Pilih --</option>
              {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
            </select>
          </div>
        </div>

        {/* Kolom Tengah */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start">
            <label className={labelClass}>No. Sales Order</label>
            <div className="flex gap-1 flex-1">
              <select className={`${inputClass} font-mono`} value={form.no_so || ''} onChange={e => handleSOChange(form, setForm, e.target.value)}>
                <option value="">-- Pilih --</option>
                {salesOrders.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>No. PO</label>
            <input type="text" className={`${inputClass} w-full`} value={form.no_po || ''} onChange={e => setForm({ ...form, no_po: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>No. Kendaraan</label>
            <input type="text" className={`${inputClass} w-64`} value={form.no_kendaraan || ''} onChange={e => setForm({ ...form, no_kendaraan: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>No. Invoice</label>
            <input type="text" className={`${inputClass} w-64 bg-slate-50 cursor-not-allowed`} readOnly value={form.no_invoice || ''} placeholder="Terisi jika sudah di-invoice" />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Keterangan</label>
            <textarea className={`${inputClass} h-20 resize-none`} value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} />
          </div>
        </div>

        {/* Kolom Kanan - Audit */}
        <div className="w-[280px] flex flex-col gap-4">
          <div className="border border-slate-300 p-3 relative mt-2 rounded-sm bg-white shadow-sm">
            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Created</span>
            <div className="flex gap-2 mt-2">
              <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
              <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.create_uid_name || user?.name || 'Unknown'} />
            </div>
          </div>
          <div className="border border-slate-300 p-3 relative mt-3 rounded-sm bg-white shadow-sm">
            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Modified</span>
            <div className="flex gap-2 mt-2">
              <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
              <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.write_uid_name || user?.name || 'Unknown'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
