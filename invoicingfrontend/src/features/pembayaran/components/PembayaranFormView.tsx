import React, { useState } from 'react';
import { Save, Printer, FilePlus, ArrowLeft, Trash2 } from 'lucide-react';
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
  handleDelete?: (id: number) => void;
}

export const PembayaranFormView: React.FC<PembayaranFormViewProps> = ({
  form, setForm, pelanggans, handlePembeliChange,
  handleOpenAddLine, handleOpenEditLine, removeLine,
  handleSaveAll, setViewMode, setShowNewModal,
  setModalForm, emptyModalForm, handleDelete
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'umum' | 'detail'>('umum');

  const totalPembayaran = (form.lines || []).reduce((acc: number, line: any) => acc + (Number(line.pembayaran) || 0), 0);
  const totalPotongan = (form.lines || []).reduce((acc: number, line: any) => acc + (Number(line.potongan) || 0), 0);

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('list')} className="text-slate-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">Pembayaran Piutang Dagang</h2>
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
             <FilePlus size={14} /> + BUAT BARU
          </button>
          <button onClick={() => navigate('/laporan?reportName=Kwitansi')} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
             <Printer size={14} /> CETAK
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">No. Bukti</span>
              <span className="font-mono text-base font-bold text-slate-800">{form.no_bukti || 'DRAFT'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Pelanggan</span>
              <span className="text-base font-bold text-slate-800">{pelanggans.find(p => p.id === form.pelanggan_id)?.nama || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Tanggal</span>
              <span className="text-base font-bold text-slate-800">{form.tanggal || '-'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
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
          
          <div className="overflow-x-auto min-h-[350px]">
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
          
          {/* Footer Totals */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
            {/* Keterangan */}
            <div className="flex-1 max-w-xl">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Keterangan Tambahan:</label>
              <textarea
                className="w-full h-24 p-3 border border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm resize-none bg-white rounded-sm shadow-sm"
                placeholder="Catatan..."
                value={form.keterangan || ''}
                onChange={e => setForm({ ...form, keterangan: e.target.value })}
              />
            </div>

            {/* Totals & Buttons */}
            <div className="w-full lg:w-[420px] flex flex-col justify-end">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Total Potongan</span>
                  <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm font-bold rounded-sm" value={totalPotongan.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                </div>
                
                {/* Total Akhir */}
                <div className="flex justify-end mt-2">
                  <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm w-full">
                    <span className="px-4 py-3 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">Total Alokasi</span>
                    <span className="px-3 py-3 text-xs font-bold text-slate-600 bg-slate-50 border-r border-slate-300">{form.mata_uang || 'IDR'}</span>
                    <span className="px-4 py-3 text-base font-bold text-slate-900 text-right min-w-[160px] font-mono">
                      {totalPembayaran.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                {handleDelete && (
                   <button disabled={!form.id} onClick={() => handleDelete(form.id)} className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50">
                     <Trash2 size={16} /> HAPUS
                   </button>
                )}
                <button onClick={handleSaveAll} className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md w-full">
                  <Save size={16} /> SIMPAN PEMBAYARAN
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
