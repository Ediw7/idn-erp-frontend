import React from 'react';
import { FilePlus, Printer, Send, Save, ArrowLeft } from 'lucide-react';
import { SuratJalanFormUmum } from './SuratJalanFormUmum';
import { SuratJalanDetail } from './SuratJalanDetail';

interface SuratJalanFormViewProps {
  form: any;
  setForm: (f: any) => void;
  emptyForm: any;
  modalForm: any;
  setModalForm: (f: any) => void;
  pelanggans: any[];
  gudangs: any[];
  salesOrders: any[];
  periode: string;
  setPeriode: (p: string) => void;
  user: any;
  handlePelangganChange: (form: any, setForm: any, val: string) => void;
  handleSOChange: (form: any, setForm: any, val: string) => void;
  handleSaveAll: () => void;
  calculateTotalQty: () => number;
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
  setViewMode: (v: 'list' | 'form') => void;
  setShowNewSjModal: (v: boolean) => void;
  setShowInvoiceModal: (v: boolean) => void;
  navigate: (url: string) => void;
  isSaving?: boolean;
}

export const SuratJalanFormView: React.FC<SuratJalanFormViewProps> = ({
  form, setForm, emptyForm, modalForm, setModalForm, pelanggans, gudangs, salesOrders,
  periode, setPeriode, user, handlePelangganChange, handleSOChange, handleSaveAll,
  calculateTotalQty, handleOpenAddLine, handleOpenEditLine, removeLine,
  setViewMode, setShowNewSjModal, setShowInvoiceModal, navigate, isSaving
}) => {
  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";
  const labelClass = "text-sm font-semibold text-slate-700 w-36 shrink-0 pt-1";

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('list')} className="text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">Surat Jalan</h2>
          </div>
          <div className="flex items-center gap-2 mt-1.5 ml-9">
            <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
            <select
              value={periode}
              onChange={e => setPeriode(e.target.value)}
              className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
            >
              <option value="2026-06">Juni 2026</option>
              <option value="2026-05">Mei 2026</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const defGudangId = gudangs.find(g => g.is_default)?.id || '';
              setModalForm({ ...emptyForm, gudang_id: String(defGudangId), no_sj: `SJ/00${Math.floor(Math.random() * 100)}/06/2026` });
              setShowNewSjModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
            <FilePlus size={14} /> BUAT SJ OTOMATIS </button>
          <button
            onClick={() => {
              const reportName = 'Surat Jalan (A4 / Kwarto / 1/2 Kwarto) - Font 10';
              const url = form.no_sj
                ? `/laporan?sj_number=${encodeURIComponent(form.no_sj)}&reportName=${encodeURIComponent(reportName)}`
                : `/laporan?reportName=${encodeURIComponent(reportName)}`;
              navigate(url);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm"
          >
            <Printer size={14} /> CETAK
          </button>
          <button
            onClick={() => {
              if (!form.no_sj) {
                alert('Harap buat atau pilih Surat Jalan terlebih dahulu! Data invoice akan ditarik otomatis dari Surat Jalan tersebut.');
                return;
              }
              setShowInvoiceModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent hover:bg-green-500 transition-colors ml-2 rounded-sm shadow-sm"
          >
            <Send size={14} /> BUAT INVOICE </button>
        </div>
      </div>

      {/* Mini Header State */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex gap-12">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">No. Surat Jalan</span>
            <span className="text-sm font-mono font-bold text-slate-800">{form.no_sj || '-'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pelanggan</span>
            <span className="text-sm font-bold text-slate-800">
              {pelanggans.find(p => String(p.id) === form.pelanggan_id)?.nama || '-'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tanggal</span>
            <span className="text-sm font-bold text-slate-800">{form.tanggal || '-'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dari SO</span>
            <span className="text-sm font-mono font-bold text-slate-800">{form.no_so || '-'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {form.no_invoice && (
            <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-sm uppercase tracking-wide">
              Telah Di-Invoice
            </span>
          )}
        </div>
      </div>

      {/* Main Flowing Layout */}
      <div className="flex-1 overflow-y-auto bg-slate-100 p-6 flex flex-col gap-6">
        <SuratJalanFormUmum
          form={form}
          setForm={setForm}
          pelanggans={pelanggans}
          gudangs={gudangs}
          salesOrders={salesOrders}
          handlePelangganChange={handlePelangganChange}
          handleSOChange={handleSOChange}
          user={user}
          inputClass={inputClass}
          labelClass={labelClass}
        />

        <SuratJalanDetail
          form={form}
          handleOpenAddLine={handleOpenAddLine}
          handleOpenEditLine={handleOpenEditLine}
          removeLine={removeLine}
        />
      </div>

      {/* Global Persistent Footer */}
      <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-sm px-6 py-2 flex items-center gap-4">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Total Kuantum Pengiriman</span>
              <span className="text-2xl font-mono font-black text-blue-900">{calculateTotalQty()}</span>
            </div>
          </div>
          <button disabled={isSaving} onClick={handleSaveAll} className="px-10 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg rounded-sm flex items-center gap-2 disabled:bg-slate-400">
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'MENYIMPAN...' : 'SIMPAN SURAT JALAN'}
          </button>
        </div>
      </div>
    </div>
  );
};
