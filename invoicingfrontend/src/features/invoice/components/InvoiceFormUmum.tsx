import React from 'react';
import { RefreshCcw } from 'lucide-react';

interface InvoiceFormUmumProps {
  form: any;
  setForm: (form: any) => void;
  dataList: any[];
  pelanggans: any[];
  proyeks: any[];
  mataUangs: any[];
  salesOrders: any[];
  pembayarans: any[];
  salesmans: any[];
  gudangs: any[];
  loadingData: boolean;
  setShowPelangganModal: (show: boolean) => void;
  handlePembeliChange: (id: number | '') => void;
}

export const InvoiceFormUmum: React.FC<InvoiceFormUmumProps> = ({
  form, setForm, dataList, pelanggans, proyeks, mataUangs, salesOrders,
  pembayarans, salesmans, gudangs, loadingData, setShowPelangganModal, handlePembeliChange
}) => {
  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white disabled:bg-slate-100 disabled:text-slate-500";
  const labelClass = "text-sm font-semibold text-slate-700 w-28 shrink-0 pt-1";

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-6">
      <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Informasi Umum</h3>
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Kolom Kiri */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start">
            <label className={labelClass}>No. Invoice</label>
            <select 
              className={`${inputClass} font-mono w-full`} 
              value={form.no_invoice || ''}
              onChange={(e) => {
                const val = e.target.value;
                const inv = dataList.find(x => x.no_invoice === val);
                if (inv) setForm(inv);
                else setForm({...form, no_invoice: val});
              }}
            >
              <option value={form.no_invoice}>{form.no_invoice || '-- Pilih --'}</option>
              {dataList.filter(x => x.no_invoice !== form.no_invoice).map(inv => (
                <option key={inv.id} value={inv.no_invoice}>{inv.no_invoice}</option>
              ))}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tgl Invoice</label>
            <input type="date" className={`${inputClass} w-48`} value={form.tgl_invoice || ''} onChange={e => setForm({...form, tgl_invoice: e.target.value})} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Nama Pembeli</label>
            <div className="flex gap-2 w-full">
              <select className={inputClass} value={form.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}>
                <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
                {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
              <button className="px-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm font-bold text-slate-600 transition-colors disabled:opacity-50" onClick={() => setShowPelangganModal(true)}>+</button>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Alamat</label>
            <textarea className={`${inputClass} h-24 resize-none`} value={form.alamat || ''} onChange={e => setForm({...form, alamat: e.target.value})} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>NPWP</label>
            <input type="text" className={`${inputClass} w-full`} value={form.npwp || ''} onChange={e => setForm({...form, npwp: e.target.value})} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Proyek</label>
            <select className={`${inputClass} w-full`} value={form.proyek || ''} onChange={e => setForm({...form, proyek: e.target.value})}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih Proyek --'}</option>
              {proyeks.map(p => <option key={p.id} value={p.kode}>{p.nama}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Mata Uang</label>
            <select className={`${inputClass} w-48`} value={form.mata_uang || 'IDR'} onChange={e => setForm({...form, mata_uang: e.target.value})}>
              <option value="IDR">IDR</option>
              {mataUangs.map(m => m.kode !== 'IDR' && <option key={m.id} value={m.kode}>{m.kode}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Kurs Jual</label>
            <input type="number" className={`${inputClass} w-48 text-right`} value={form.kurs_jual || ''} onChange={e => setForm({...form, kurs_jual: e.target.value})} />
          </div>
        </div>

        {/* Kolom Tengah */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start">
            <label className={labelClass}>No. SO</label>
            <div className="flex gap-1 flex-1">
              <select className={inputClass} value={form.no_so || ''} onChange={e => setForm({...form, no_so: e.target.value})}>
                <option value="">{loadingData ? 'Loading...' : '-- Pilih SO --'}</option>
                {salesOrders.map((so, idx) => <option key={idx} value={so.no_so}>{so.no_so}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>No. PO</label>
            <input type="text" className={`${inputClass} w-full`} value={form.no_po || ''} onChange={e => setForm({...form, no_po: e.target.value})} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tgl PO</label>
            <input type="date" className={`${inputClass} w-48`} value={form.tgl_po || ''} onChange={e => setForm({...form, tgl_po: e.target.value})} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tgl JT</label>
            <input type="date" className={`${inputClass} w-48`} value={form.tgl_jt || ''} onChange={e => setForm({...form, tgl_jt: e.target.value})} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Cara Pembayaran</label>
            <select className={`${inputClass} w-full`} value={form.cara_pembayaran || ''} onChange={e => setForm({...form, cara_pembayaran: e.target.value})}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
              {pembayarans.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Salesman</label>
            <select className={`${inputClass} w-full`} value={form.salesman_id || ''} onChange={e => setForm({...form, salesman_id: e.target.value ? Number(e.target.value) : ''})}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
              {salesmans.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Gudang</label>
            <select className={`${inputClass} w-full`} value={form.gudang_id || ''} onChange={e => setForm({...form, gudang_id: e.target.value ? Number(e.target.value) : ''})}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
              {gudangs.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
            </select>
          </div>
          <div className="flex items-start mt-2 border-t border-slate-200 pt-3">
            <label className={labelClass}>No. Faktur Pajak</label>
            <div className="flex gap-1 flex-1">
              <input type="text" className={`${inputClass} w-full`} value={form.no_faktur_pajak || ''} onChange={e => setForm({...form, no_faktur_pajak: e.target.value})} />
              <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><RefreshCcw size={14} /></button>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>No. Kwitansi</label>
            <div className="flex gap-1 flex-1">
              <input type="text" className={`${inputClass} w-full`} value={form.no_kwitansi || ''} onChange={e => setForm({...form, no_kwitansi: e.target.value})} />
              <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><RefreshCcw size={14} /></button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan - Audit */}
        <div className="w-[250px] flex flex-col gap-4">
          <div className="flex gap-4 items-center bg-slate-50 p-3 border border-slate-200 rounded-sm">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.is_jasa || false} onChange={e => setForm({...form, is_jasa: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Jasa ?
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.is_paid || false} onChange={e => setForm({...form, is_paid: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Paid ?
            </label>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-sm font-semibold text-slate-700">Catatan Internal</label>
            <textarea className={`${inputClass} h-24 resize-none`} value={form.catatan || ''} onChange={e => setForm({...form, catatan: e.target.value})} />
          </div>

          <div className="border border-slate-300 p-3 relative mt-4 rounded-sm bg-white shadow-sm">
            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Created</span>
            <div className="flex gap-2 mt-2">
              <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
              <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.create_uid_name || 'Admin'} />
            </div>
          </div>
          <div className="border border-slate-300 p-3 relative mt-3 rounded-sm bg-white shadow-sm">
            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Modified</span>
            <div className="flex gap-2 mt-2">
              <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
              <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.write_uid_name || 'Admin'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
