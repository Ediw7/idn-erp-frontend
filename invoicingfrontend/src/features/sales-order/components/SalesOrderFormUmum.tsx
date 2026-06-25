import React from 'react';
import { PelangganData, MataUangData } from '../../setup/api';

interface SalesOrderFormUmumProps {
  form: any;
  setForm: (form: any) => void;
  isReadOnly: boolean;
  loadingData: boolean;
  pelanggans: PelangganData[];
  mataUangs: MataUangData[];
  pembayarans: any[];
  salesmans: any[];
  dataList: any[];
  handlePelangganChange: (id: number) => void;
  setShowPelangganModal: (show: boolean) => void;
  handleVoid: () => void;
  onSelectSO: (so: any) => void;
  inputClass: string;
  labelClass: string;
}

export const SalesOrderFormUmum: React.FC<SalesOrderFormUmumProps> = ({
  form,
  setForm,
  isReadOnly,
  loadingData,
  pelanggans,
  mataUangs,
  pembayarans,
  salesmans,
  dataList,
  handlePelangganChange,
  setShowPelangganModal,
  handleVoid,
  onSelectSO,
  inputClass,
  labelClass
}) => {
  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Kolom Kiri */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start">
            <label className={labelClass}>No. Sales Order</label>
            <select
              className={`${inputClass} font-mono w-56`}
              value={form.no_so || ''}
              onChange={e => {
                const selected = dataList.find(so => so.no_so === e.target.value);
                if (selected) onSelectSO(selected);
              }}
            >
              <option value="">-- Pilih No. SO --</option>
              {dataList.map(so => (
                <option key={so.id || so.no_so} value={so.no_so}>{so.no_so}</option>
              ))}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tgl Sales Order</label>
            <input type="date" disabled={isReadOnly} className={`${inputClass} w-48`} value={form.tgl_so || ''} onChange={e => setForm({ ...form, tgl_so: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Nama Pelanggan</label>
            <div className="flex gap-2 w-full">
              <select disabled={isReadOnly} className={inputClass} value={form.pelanggan_id || ''} onChange={e => handlePelangganChange(Number(e.target.value))}>
                <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
                {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
              <button disabled={isReadOnly} className="px-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm font-bold text-slate-600 transition-colors disabled:opacity-50" onClick={() => setShowPelangganModal(true)}>+</button>
            </div>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Dikirim ke Alamat</label>
            <textarea disabled={isReadOnly} className={`${inputClass} h-24 resize-none`} value={form.alamat_kirim || ''} onChange={e => setForm({ ...form, alamat_kirim: e.target.value })} />
          </div>
        </div>

        {/* Kolom Tengah */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-start">
            <label className={labelClass}>No. PO Pelanggan</label>
            <input disabled={isReadOnly} type="text" className={`${inputClass} w-full`} placeholder="Isi manual dari PO pelanggan" value={form.no_po || ''} onChange={e => setForm({ ...form, no_po: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tgl PO</label>
            <input disabled={isReadOnly} type="date" className={`${inputClass} w-48`} value={form.tgl_po || ''} onChange={e => setForm({ ...form, tgl_po: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Mata Uang</label>
            <select disabled={isReadOnly} className={`${inputClass} w-48`} value={form.mata_uang_id || ''} onChange={e => setForm({ ...form, mata_uang_id: Number(e.target.value) || null })}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
              {mataUangs.map(m => <option key={m.id} value={m.id}>{m.kode}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Cara Pembayaran</label>
            <select disabled={isReadOnly} className={inputClass} value={form.pembayaran_id || ''} onChange={e => setForm({ ...form, pembayaran_id: Number(e.target.value) || null })}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
              {pembayarans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Salesman</label>
            <select disabled={isReadOnly} className={inputClass} value={form.salesman_id || ''} onChange={e => setForm({ ...form, salesman_id: Number(e.target.value) || null })}>
              <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
              {salesmans.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Tgl Kirim</label>
            <input disabled={isReadOnly} type="date" className={`${inputClass} w-48`} value={form.tgl_kirim || ''} onChange={e => setForm({ ...form, tgl_kirim: e.target.value })} />
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Dipesan Oleh</label>
            <input disabled={isReadOnly} type="text" className={`${inputClass} w-full`} value={form.dipesan_oleh || ''} onChange={e => setForm({ ...form, dipesan_oleh: e.target.value })} />
          </div>
        </div>

        {/* Kolom Kanan - Status & Audit */}
        <div className="w-[280px] flex flex-col gap-4">
          <div className="flex flex-col gap-2 bg-slate-50 p-3 border border-slate-200 rounded-sm">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!form.is_void} onChange={() => handleVoid()} className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500 accent-red-600" />
              <span className={form.is_void ? 'text-red-600' : ''}>Void (Batalkan)</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!form.is_closed} onChange={e => setForm({ ...form, is_closed: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              Closed
            </label>
          </div>

          <div className="border border-slate-300 p-3 relative mt-2 rounded-sm bg-white shadow-sm">
            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Created</span>
            <div className="flex gap-2 mt-2">
              <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
              <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.create_uid_name || 'Unknown'} />
            </div>
          </div>
          <div className="border border-slate-300 p-3 relative mt-1 rounded-sm bg-white shadow-sm">
            <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Modified</span>
            <div className="flex gap-2 mt-2">
              <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
              <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.write_uid_name || 'Unknown'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
