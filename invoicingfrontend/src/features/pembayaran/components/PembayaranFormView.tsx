import React, { useState } from 'react';
import { Save, X, FileText, Printer, FilePlus, ArrowLeft } from 'lucide-react';
import { PembayaranFormUmum } from './PembayaranFormUmum';
import { PembayaranDetail } from './PembayaranDetail';
import { useNavigate } from 'react-router-dom';

interface PembayaranFormViewProps {
  form: any;
  setForm: (form: any) => void;
  pelanggans: any[];
  handlePembeliChange: (id: number | '') => void;
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
  handleSaveAll: () => void;
  setViewMode: (mode: 'list' | 'form') => void;
  setShowNewModal: (show: boolean) => void;
  setModalForm: (form: any) => void;
  emptyModalForm: any;
}

export const PembayaranFormView: React.FC<PembayaranFormViewProps> = ({
  form, setForm, pelanggans, handlePembeliChange,
  handleOpenAddLine, handleOpenEditLine, removeLine,
  handleSaveAll, setViewMode, setShowNewModal,
  setModalForm, emptyModalForm
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'umum' | 'detail'>('umum');

  const totalPembayaran = (form.lines || []).reduce((acc: number, line: any) => acc + (Number(line.pembayaran) || 0), 0);
  const totalPotongan = (form.lines || []).reduce((acc: number, line: any) => acc + (Number(line.potongan) || 0), 0);

  return (
    <div className="bg-slate-50 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('list')} className="text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">Pembayaran Piutang Dagang</h2>
          </div>
          <div className="flex items-center gap-2 mt-1.5 ml-9">
             <span className="text-xs text-slate-300 font-medium">No. Bukti:</span>
             <span className="text-xs text-blue-300 font-bold font-mono">{form.no_bukti || '-'}</span>
             <span className="text-xs text-slate-500 mx-2">|</span>
             <span className="text-xs text-slate-300 font-medium">Pembeli:</span>
             <span className="text-xs text-blue-300 font-bold">{pelanggans.find(p => p.id === form.pelanggan_id)?.nama || '-'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={async () => {
              const { getPembayaranAutoNo } = await import('../../transactionsApi');
              const autoNo = await getPembayaranAutoNo();
              setModalForm({ ...emptyModalForm, no_bukti: autoNo });
              setShowNewModal(true);
            }} 
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
             <FilePlus size={14} /> + TAMBAH BARU
          </button>
          <button onClick={() => navigate('/laporan?reportName=Kwitansi')} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
             <Printer size={14} /> CETAK
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1 shrink-0">
          <button 
            onClick={() => setActiveTab('umum')}
            className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${
              activeTab === 'umum' 
              ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' 
              : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'
            }`}
          >
            Informasi Umum
          </button>
          <button 
            onClick={() => setActiveTab('detail')}
            className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 flex items-center gap-2 ${
              activeTab === 'detail' 
              ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' 
              : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'
            }`}
          >
            Rincian Pembayaran
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs ml-1">{form.lines?.length || 0}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'umum' && (
            <PembayaranFormUmum 
              form={form} setForm={setForm} pelanggans={pelanggans} handlePembeliChange={handlePembeliChange}
            />
          )}
          
          {activeTab === 'detail' && (
            <PembayaranDetail 
              form={form} handleOpenAddLine={handleOpenAddLine} handleOpenEditLine={handleOpenEditLine} removeLine={removeLine}
            />
          )}
        </div>
      </div>

      {/* Footer Calculation */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-300 shrink-0 z-10 flex justify-between items-center">
        <div className="flex gap-8 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-semibold uppercase text-xs">Total Pembayaran Di-alokasikan</span>
            <span className="font-mono text-xl font-bold text-slate-800">
              IDR {totalPembayaran.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-500 font-semibold uppercase text-xs">Total Potongan</span>
            <span className="font-mono text-xl font-bold text-slate-800">
              IDR {totalPotongan.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <button 
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-blue-600 border border-transparent hover:bg-blue-700 transition-colors rounded-sm shadow-sm"
        >
          <Save size={16} /> SIMPAN PEMBAYARAN
        </button>
      </div>
    </div>
  );
};
