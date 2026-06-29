import React, { useState } from 'react';
import { Save, Trash2, ArrowLeft, Printer } from 'lucide-react';
import { SuratSetoranPajakData } from '../api';

interface FormViewProps {
  form: SuratSetoranPajakData;
  setForm: (v: SuratSetoranPajakData) => void;
  isNew: boolean;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const SuratSetoranPajakFormView: React.FC<FormViewProps> = ({
  form, setForm, isNew, onSave, onDelete, onClose
}) => {
  const [activeTab, setActiveTab] = useState<'ssp'>('ssp');

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors";
  const numInputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm text-right font-mono font-bold text-blue-700 disabled:bg-slate-50 disabled:text-slate-500 transition-colors";
  const labelClass = "text-xs font-semibold text-slate-700 w-40 shrink-0 mt-1";
  
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Mirip Sales Order */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors" title="Kembali ke Daftar">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">Surat Setoran Pajak</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
              <Printer size={14} /> CETAK
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header Mirip Sales Order */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12 items-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama WP</span>
              <span className="font-bold text-base text-slate-800">{form.nama_wp || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">NPWP</span>
              <span className="font-mono font-bold text-base text-slate-800">{form.npwp || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bulan / Tahun</span>
              <div className="flex items-center gap-2">
                <select className={`${inputClass} w-20 py-1 font-bold`} value={form.bulan} onChange={e => setForm({...form, bulan: e.target.value})}>
                   {Array.from({length: 12}, (_, i) => {
                     const m = (i+1).toString().padStart(2, '0');
                     return <option key={m} value={m}>{m}</option>
                   })}
                </select>
                <span className="text-xs font-semibold text-slate-500">/</span>
                <input type="text" className={`${inputClass} w-24 font-mono font-bold py-1`} value={form.tahun} onChange={e => setForm({...form, tahun: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Mirip Sales Order */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
            <button
              className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm`}
            >
              Formulir Surat Setoran Pajak
            </button>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <div className="p-6 shrink-0 max-w-4xl flex flex-col gap-5">
              
              <div className="flex items-start gap-4">
                 <span className={labelClass}>KPP</span>
                 <input type="text" className={`${inputClass} w-32`} value={form.kpp} onChange={e => setForm({...form, kpp: e.target.value})} />
              </div>
              
              <div className="flex items-start gap-4">
                 <span className={labelClass}>Nama WP</span>
                 <input type="text" className={`${inputClass} w-full`} value={form.nama_wp} onChange={e => setForm({...form, nama_wp: e.target.value})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>NPWP</span>
                 <input type="text" className={`${inputClass} w-64`} value={form.npwp} onChange={e => setForm({...form, npwp: e.target.value})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Alamat</span>
                 <textarea className={`${inputClass} w-full resize-none h-16`} value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Kode Pos</span>
                 <input type="text" className={`${inputClass} w-32`} value={form.kode_pos} onChange={e => setForm({...form, kode_pos: e.target.value})} />
              </div>
              
              <div className="flex items-start gap-4 mt-2 border-t border-slate-200 pt-4">
                 <span className={labelClass}>Kode Jenis Pajak/MAP</span>
                 <div className="flex items-center gap-2 w-full">
                    <select className={`${inputClass} w-40`} value={form.kode_jenis_pajak} onChange={e => setForm({...form, kode_jenis_pajak: e.target.value})}>
                      <option value="411211">411211</option>
                      <option value="411212">411212</option>
                    </select>
                    <input type="text" className={`${inputClass} flex-1 bg-slate-50`} readOnly value={form.kode_jenis_pajak_desc} onChange={e => setForm({...form, kode_jenis_pajak_desc: e.target.value})} />
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Kode Jenis Setoran</span>
                 <div className="flex items-center gap-2 w-full">
                    <select className={`${inputClass} w-40`} value={form.kode_jenis_setoran} onChange={e => setForm({...form, kode_jenis_setoran: e.target.value})}>
                      <option value="100">100</option>
                      <option value="900">900</option>
                    </select>
                    <input type="text" className={`${inputClass} flex-1 bg-slate-50`} readOnly value={form.kode_jenis_setoran_desc} onChange={e => setForm({...form, kode_jenis_setoran_desc: e.target.value})} />
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Uraian Pembayaran</span>
                 <textarea className={`${inputClass} w-full resize-none h-16`} value={form.uraian_pembayaran} onChange={e => setForm({...form, uraian_pembayaran: e.target.value})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>No. Ketetapan</span>
                 <input type="text" className={`${inputClass} w-64`} value={form.no_ketetapan} onChange={e => setForm({...form, no_ketetapan: e.target.value})} />
                 <span className="text-xs font-semibold text-slate-700 shrink-0 mt-1 ml-4">NTPP</span>
                 <input type="text" className={`${inputClass} w-64`} value={form.ntpp} onChange={e => setForm({...form, ntpp: e.target.value})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Jumlah (Rp)</span>
                 <input type="number" className={`${numInputClass} w-64`} value={form.jumlah} onChange={e => setForm({...form, jumlah: Number(e.target.value)})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Tanggal</span>
                 <input type="date" className={`${inputClass} w-40`} value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} />
              </div>
              
              <div className="flex items-start gap-4">
                 <span className={labelClass}>Tanda Tangan</span>
                 <input type="text" className={`${inputClass} w-64`} value={form.tanda_tangan} onChange={e => setForm({...form, tanda_tangan: e.target.value})} />
              </div>

              <div className="flex items-start gap-4">
                 <span className={labelClass}>Keterangan</span>
                 <input type="text" className={`${inputClass} w-full`} value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} />
              </div>

              <div className="flex items-center gap-4 mt-2">
                 <span className={labelClass}>SSP Pemungut</span>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" checked={form.ssp_pemungut} onChange={e => setForm({...form, ssp_pemungut: e.target.checked})} />
                 </label>
              </div>

            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3 shrink-0">
             <button disabled={isNew} onClick={onDelete} className="px-6 py-2.5 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50">
               <Trash2 size={16} /> HAPUS SSP
             </button>
             <button onClick={onSave} className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md">
               <Save size={16} /> SIMPAN SSP
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
