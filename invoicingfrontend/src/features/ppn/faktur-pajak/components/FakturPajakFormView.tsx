import React, { useState } from 'react';
import { FilePlus, Trash2, Printer, Save, Send, ArrowLeft, Plus } from 'lucide-react';
import { FakturPajakData, FakturPajakLine } from '../api';
import { PelangganData, ItemData } from '../../../setup/api';

interface FormViewProps {
  form: FakturPajakData;
  setForm: (v: FakturPajakData) => void;
  isNew: boolean;
  pelanggans: PelangganData[];
  items: ItemData[];
  fakturPajakSetups: any[];

  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
  onNew: () => void;

  handlePembeliChange: (id: number | '') => void;
  handleAddLine: () => void;
  handleRemoveLine: (idx: number) => void;
  handleUpdateLine: (idx: number, field: keyof FakturPajakLine, value: any) => void;

  setShowNsfpModal: (v: boolean) => void;
  setShowPelangganModal: (v: boolean) => void;
  setShowPenggantiModal: (v: boolean) => void;
  setShowEFakturModal: (v: boolean) => void;

  totals: { totalHargaJual: number; dppValas: number; dpp: number; ppn: number; };
  isSaving?: boolean;
}

export const FakturPajakFormView: React.FC<FormViewProps> = ({
  form, setForm, isNew, pelanggans, items, fakturPajakSetups,
  onSave, onDelete, onClose, onNew,
  handlePembeliChange, handleAddLine, handleRemoveLine, handleUpdateLine,
  setShowNsfpModal, setShowPelangganModal, setShowPenggantiModal, setShowEFakturModal,
  totals, isSaving
}) => {
  const [activeTab, setActiveTab] = useState<'umum' | 'detail'>('umum');

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors";
  const labelClass = "w-36 text-xs font-semibold text-slate-700 shrink-0 mt-2";

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header - persis Sales Order */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">Faktur Pajak</h2>
          </div>
          <div className="flex items-center gap-2 mt-1.5 ml-9">
            <span className="text-xs text-slate-300 font-medium">Status FP:</span>
            <span className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 font-bold uppercase">
              {form.jenis_status || 'Normal'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onNew} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
            <FilePlus size={14} /> + TAMBAH FP
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
            <Printer size={14} /> CETAK
          </button>
          <button onClick={() => setShowPenggantiModal(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent hover:bg-green-500 transition-colors ml-2 rounded-sm shadow-sm">
            <Send size={14} /> FP PENGGANTI
          </button>
          <button onClick={() => setShowEFakturModal(true)} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-600 border border-transparent hover:bg-slate-500 transition-colors ml-2 rounded-sm shadow-sm">
            e-FAKTUR
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header - persis Sales Order */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">No. Faktur Pajak</span>
              <span className="font-mono text-base font-bold text-slate-800">{form.no_fp || 'DRAFT'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Pembeli</span>
              <span className="text-base font-bold text-slate-800">{pelanggans.find(p => p.id === form.pembeli_id)?.nama || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Tanggal</span>
              <span className="text-base font-bold text-slate-800">{form.tgl_fp || '-'}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-sm border border-blue-200 uppercase">{form.jenis_transaksi?.split(' - ')[0] || '01'}</span>
          </div>
        </div>

        {/* Tabs + Content - persis Sales Order */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          {/* Tab bar */}
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
            {([
              { key: 'umum' as const, label: 'Informasi Umum' },
              { key: 'detail' as const, label: 'Detail BKP / JKP' },
            ]).map(tab => (
              <button
                key={tab.key}
                className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === tab.key ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="overflow-x-auto min-h-[350px]">
            {/* === TAB: Informasi Umum === */}
            {activeTab === 'umum' && (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                {/* Left Column */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start">
                    <label className={labelClass}>Penomoran</label>
                    <div className="flex gap-2 flex-1">
                      <select className={inputClass} value={form.penomoran || ''} onChange={e => setForm({ ...form, penomoran: e.target.value })}>
                        <option value="">- Pilih Rentang NSFP -</option>
                        {fakturPajakSetups.map(fp => <option key={fp.id} value={fp.id}>{fp.no_seri_awal} - {fp.no_seri_akhir}</option>)}
                      </select>
                      <button onClick={() => setShowNsfpModal(true)} className="px-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-sm transition-colors">+</button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>No. Faktur Pajak</label>
                    <input type="text" className={`${inputClass} font-mono font-semibold`} value={form.no_fp || ''} onChange={e => setForm({ ...form, no_fp: e.target.value })} placeholder="010.000-26.00000001" />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Tgl Faktur Pajak</label>
                    <input type="date" className={inputClass} value={form.tgl_fp || ''} onChange={e => setForm({ ...form, tgl_fp: e.target.value })} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Nama Pembeli</label>
                    <div className="flex gap-2 flex-1">
                      <select className={inputClass} value={form.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}>
                        <option value="">- Pilih Pembeli -</option>
                        {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                      </select>
                      <button onClick={() => setShowPelangganModal(true)} className="px-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-sm transition-colors">+</button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Alamat Pembeli</label>
                    <textarea className={`${inputClass} h-16 resize-none bg-slate-100 text-slate-500`} readOnly value={form.alamat || ''} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>NPWP</label>
                    <input type="text" className={`${inputClass} font-mono bg-slate-100 text-slate-500`} readOnly value={form.npwp || ''} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>FP Yang Diganti</label>
                    <div className="flex gap-2 flex-1 items-center">
                      <input type="text" className={`${inputClass} font-mono ${form.jenis_status === 'Normal' ? 'bg-slate-100 text-slate-500' : ''}`} disabled={form.jenis_status === 'Normal'} value={form.fp_diganti || ''} onChange={e => setForm({ ...form, fp_diganti: e.target.value })} placeholder="No. FP Lama" />
                      <span className="text-xs font-semibold text-slate-700 shrink-0">Tgl</span>
                      <input type="date" className={`${inputClass} w-36 ${form.jenis_status === 'Normal' ? 'bg-slate-100 text-slate-500' : ''}`} disabled={form.jenis_status === 'Normal'} value={form.tgl_fp_diganti || ''} onChange={e => setForm({ ...form, tgl_fp_diganti: e.target.value })} />
                    </div>
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Jenis Transaksi</label>
                    <select className={inputClass} value={form.jenis_transaksi || ''} onChange={e => setForm({ ...form, jenis_transaksi: e.target.value })}>
                      <option value="01 - Kepada Bukan Pemungut PPN">01 - Kepada Bukan Pemungut PPN</option>
                      <option value="02 - Kepada Pemungut Bendaharawan">02 - Kepada Pemungut Bendaharawan</option>
                      <option value="03 - Kepada Pemungut Selain Bendaharawan">03 - Kepada Pemungut Selain Bendaharawan</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start">
                    <label className={labelClass}>Jenis Status</label>
                    <select className={inputClass} value={form.jenis_status || ''} onChange={e => setForm({ ...form, jenis_status: e.target.value })}>
                      <option value="Normal">Normal</option>
                      <option value="Pengganti">Pengganti</option>
                    </select>
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>No. Invoice Ref.</label>
                    <input type="text" className={inputClass} value={form.no_invoice || ''} onChange={e => setForm({ ...form, no_invoice: e.target.value })} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Tarif PPN (%)</label>
                    <input type="number" className={`${inputClass} w-24 text-right`} value={form.tarif_ppn ?? 11} onChange={e => setForm({ ...form, tarif_ppn: Number(e.target.value) })} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Mata Uang</label>
                    <select className={`${inputClass} w-24`} value={form.mata_uang || 'IDR'} onChange={e => setForm({ ...form, mata_uang: e.target.value })}>
                      <option value="IDR">IDR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Kurs Pajak</label>
                    <div className="flex gap-2 items-center flex-1">
                      <input type="number" className={`${inputClass} w-32 text-right`} value={form.kurs_pajak || 1} onChange={e => setForm({ ...form, kurs_pajak: Number(e.target.value) })} />
                      <span className="text-xs font-semibold text-slate-700">/ 1 RP</span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Tanda Tangan</label>
                    <input type="text" className={inputClass} value={form.penandatangan || ''} onChange={e => setForm({ ...form, penandatangan: e.target.value })} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Jabatan</label>
                    <input type="text" className={inputClass} value={form.jabatan || ''} onChange={e => setForm({ ...form, jabatan: e.target.value })} />
                  </div>

                  <div className="flex items-start">
                    <label className={labelClass}>Ket Tambahan</label>
                    <input type="text" className={inputClass} value={form.ket_tambahan || ''} onChange={e => setForm({ ...form, ket_tambahan: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {/* === TAB: Detail BKP/JKP === */}
            {activeTab === 'detail' && (
              <div className="flex flex-col h-full">
                <div className="p-3 bg-white border-b border-slate-200 shrink-0">
                  <button onClick={handleAddLine} className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm">
                    <Plus size={14} /> TAMBAH BARANG
                  </button>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
                    <tr>
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold w-64">Kode / Nama BKP</th>
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-center">Satuan</th>
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-right">Kuantum</th>
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Harga Satuan</th>
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Harga Jual</th>
                      <th className="px-3 py-2 w-16 text-center font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(form.lines || []).map((line, idx) => {
                      const itemInfo = items.find(i => i.id === line.item_id);
                      return (
                        <tr key={idx} className="hover:bg-blue-50 transition-colors border-b border-slate-200">
                          <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            {itemInfo ? `${itemInfo.kode} - ${itemInfo.nama}` : (line.kode_barang ? `${line.kode_barang} - ${line.nama_barang}` : '-')}
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200 text-center">{line.satuan || '-'}</td>
                          <td className="px-3 py-1.5 border-r border-slate-200 text-right">{line.kuantum}</td>
                          <td className="px-3 py-1.5 border-r border-slate-200 text-right">{(line.harga_satuan || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                          <td className="px-3 py-1.5 border-r border-slate-200 text-right font-semibold text-slate-800 bg-slate-50">
                            {(line.harga_jual || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <button onClick={() => handleRemoveLine(idx)} className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50" title="Hapus">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(!form.lines || form.lines.length === 0) && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic bg-slate-50">Belum ada barang. Klik tombol Tambah Barang di atas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Totals - persis Sales Order */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
            {/* Keterangan */}
            <div className="flex-1 max-w-xl">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Keterangan:</label>
              <textarea
                className="w-full h-32 p-3 border border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm resize-none bg-white rounded-sm shadow-sm"
                placeholder="Tuliskan keterangan untuk faktur pajak ini..."
                value={form.ket_tambahan || ''}
                onChange={e => setForm({ ...form, ket_tambahan: e.target.value })}
              />
            </div>

            {/* Totals & Buttons */}
            <div className="w-full lg:w-[420px] flex flex-col">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Harga Jual / Penggantian</span>
                  <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm font-bold rounded-sm" value={totals.totalHargaJual.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Potongan Harga</span>
                  <input type="number" className="w-48 px-3 py-1.5 text-right bg-white border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm" value={form.potongan || ''} onChange={e => setForm({ ...form, potongan: Number(e.target.value) })} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Uang Muka Diterima</span>
                  <input type="number" className="w-48 px-3 py-1.5 text-right bg-white border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm" value={form.uang_muka || ''} onChange={e => setForm({ ...form, uang_muka: Number(e.target.value) })} />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-slate-700">DPP Valas</span>
                  <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm rounded-sm" value={totals.dppValas.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                </div>

                {/* DPP Box */}
                <div className="flex justify-end mt-2">
                  <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm w-full">
                    <span className="px-4 py-3 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">Dasar Pengenaan Pajak</span>
                    <span className="px-3 py-3 text-xs font-bold text-slate-600 bg-slate-50 border-r border-slate-300">IDR</span>
                    <span className="px-4 py-3 text-base font-bold text-slate-900 text-right min-w-[160px] font-mono">
                      {totals.dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* PPN Total Box */}
                <div className="flex justify-end mt-1">
                  <div className="flex items-center border border-blue-300 bg-blue-50 rounded-sm overflow-hidden shadow-sm w-full">
                    <span className="px-4 py-3 text-xs font-bold text-blue-800 bg-blue-100 border-r border-blue-200 flex-1">PPN = {form.tarif_ppn}% x DPP</span>
                    <span className="px-3 py-3 text-xs font-bold text-blue-700 bg-blue-50 border-r border-blue-200">IDR</span>
                    <span className="px-4 py-3 text-base font-bold text-blue-900 text-right min-w-[160px] font-mono">
                      {totals.ppn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button disabled={isNew || !form.id} onClick={onDelete} className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50">
                  <Trash2 size={16} /> HAPUS FP
                </button>
                <button disabled={isSaving} onClick={onSave} className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md w-full disabled:bg-slate-400">
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? 'MENYIMPAN...' : 'SIMPAN FAKTUR PAJAK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
