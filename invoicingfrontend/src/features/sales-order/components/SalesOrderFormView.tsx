import React from 'react';
import { FilePlus, Trash2, Printer, Save, Send } from 'lucide-react';
import { SalesOrderFormUmum } from './SalesOrderFormUmum';
import { SalesOrderDetail } from './SalesOrderDetail';
import { SalesOrderSuratJalan } from './SalesOrderSuratJalan';
import { SalesOrderOutstanding } from './SalesOrderOutstanding';

interface SalesOrderFormViewProps {
  form: any;
  setForm: (f: any) => void;
  isReadOnly: boolean;
  inputClass: string;
  labelClass: string;
  activeTab: 'umum' | 'detail' | 'surat_jalan' | 'outstanding';
  setActiveTab: (t: 'umum' | 'detail' | 'surat_jalan' | 'outstanding') => void;
  periode: string;
  setPeriode: (p: string) => void;
  pelanggans: any[];
  mataUangs: any[];
  pembayarans: any[];
  salesmans: any[];
  items: any[];
  gudangs: any[];
  dataList: any[];
  wajibPpnbm: boolean;
  loadingData: boolean;
  subtotal: number;
  dpp: number;
  ppnAmount: number;
  ppnbmAmount: number;
  total: number;
  handleNewClick: () => void;
  handleCetak: () => void;
  handleBuatSJClick: () => void;
  handleSave: () => void;
  handleDelete: () => void;
  handleVoid: () => void;
  handlePelangganChange: (id: number) => void;
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
  setShowPelangganModal: (v: boolean) => void;
  setViewMode: (v: 'list' | 'form') => void;
  onSelectSO: (so: any) => void;
  isSaving?: boolean;
}

export const SalesOrderFormView: React.FC<SalesOrderFormViewProps> = ({
  form, setForm, isReadOnly, inputClass, labelClass, activeTab, setActiveTab,
  periode, setPeriode, pelanggans, mataUangs, pembayarans, salesmans, items, gudangs,
  dataList, wajibPpnbm, loadingData, subtotal, dpp, ppnAmount, ppnbmAmount, total,
  handleNewClick, handleCetak, handleBuatSJClick, handleSave, handleDelete, handleVoid,
  handlePelangganChange, handleOpenAddLine, handleOpenEditLine, removeLine,
  setShowPelangganModal, setViewMode, onSelectSO, isSaving
}) => {
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Sales Order</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
            <select 
              value={periode} 
              onChange={e => setPeriode(e.target.value)}
              className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
            >
              <option value="2026-06">Juni 2026</option>
              <option value="2026-05">Mei 2026</option>
              <option value="2026-04">April 2026</option>
              <option value="2026-03">Maret 2026</option>
              <option value="2026-02">Februari 2026</option>
              <option value="2026-01">Januari 2026</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('list')} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors rounded-sm shadow-sm mr-2">
             KEMBALI KE LIST
          </button>
          <button onClick={handleNewClick} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
             <FilePlus size={14} /> + TAMBAH SO
          </button>
          <button onClick={handleCetak} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
             <Printer size={14} /> CETAK
          </button>
          {!isReadOnly && (
            <button onClick={handleBuatSJClick} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent hover:bg-green-500 transition-colors ml-2 rounded-sm shadow-sm">
               <Send size={14} /> BUAT SJ
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">No. Sales Order</span>
              <span className="font-mono text-base font-bold text-slate-800">{form.no_so || 'DRAFT'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Pelanggan</span>
              <span className="text-base font-bold text-slate-800">{pelanggans.find(p => p.id === form.pelanggan_id)?.nama || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">Tanggal</span>
              <span className="text-base font-bold text-slate-800">{form.tgl_so || '-'}</span>
            </div>
          </div>
          <div className="flex gap-3">
             {form.is_void && <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-sm border border-red-200">DIBATALKAN (VOID)</span>}
             {form.is_closed && <span className="px-3 py-1 bg-slate-200 text-slate-700 font-bold text-xs rounded-sm border border-slate-300">CLOSED</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
            {(['umum', 'detail', 'surat_jalan', 'outstanding'] as const).map(tab => {
              const labels = { umum: 'Informasi Umum', detail: 'Detail Barang/Jasa', surat_jalan: 'Surat Jalan', outstanding: 'Outstanding' };
              return (
                <button
                  key={tab}
                  className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === tab ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>
          
          <div className="overflow-x-auto min-h-[350px]">
            {activeTab === 'umum' && (
              <SalesOrderFormUmum
                form={form}
                setForm={setForm}
                isReadOnly={isReadOnly}
                loadingData={loadingData}
                pelanggans={pelanggans}
                mataUangs={mataUangs}
                pembayarans={pembayarans}
                salesmans={salesmans}
                dataList={dataList}
                handlePelangganChange={handlePelangganChange}
                setShowPelangganModal={setShowPelangganModal}
                handleVoid={handleVoid}
                onSelectSO={onSelectSO}
                inputClass={inputClass}
                labelClass={labelClass}
              />
            )}
            {activeTab === 'detail' && (
              <SalesOrderDetail
                form={form}
                isReadOnly={isReadOnly}
                items={items}
                handleOpenAddLine={handleOpenAddLine}
                handleOpenEditLine={handleOpenEditLine}
                removeLine={removeLine}
              />
            )}
            {activeTab === 'surat_jalan' && (
              <SalesOrderSuratJalan form={form} gudangs={gudangs} />
            )}
            {activeTab === 'outstanding' && (
              <SalesOrderOutstanding form={form} items={items} />
            )}
          </div>

          {/* Footer Totals */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
            {/* Keterangan */}
            <div className="flex-1 max-w-xl">
              <label className="block text-sm font-semibold text-slate-800 mb-2">Keterangan:</label>
              <textarea
                disabled={isReadOnly}
                className="w-full h-32 p-3 border border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm resize-none bg-white rounded-sm shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
                placeholder="Tuliskan keterangan untuk sales order ini..."
                value={form.keterangan || ''}
                onChange={e => setForm({ ...form, keterangan: e.target.value })}
              />
            </div>

            {/* Totals & Buttons */}
            <div className="w-full lg:w-[420px] flex flex-col">
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Sub Total</span>
                  <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm font-bold rounded-sm" value={subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">Potongan Harga</span>
                  <input disabled={isReadOnly} type="number" className="w-48 px-3 py-1.5 text-right bg-white border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm disabled:bg-slate-100 disabled:text-slate-500" value={form.potongan_harga || ''} onChange={e => setForm({ ...form, potongan_harga: Number(e.target.value) })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">PPN (%)</span>
                    <input disabled={isReadOnly} type="number" className="w-16 px-2 py-1.5 text-center bg-white border border-slate-300 focus:outline-none focus:border-blue-500 text-sm rounded-sm disabled:bg-slate-100 disabled:text-slate-500" value={form.ppn_persen || ''} onChange={e => setForm({ ...form, ppn_persen: Number(e.target.value) })} />
                  </div>
                  <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm rounded-sm" value={ppnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                </div>
                {wajibPpnbm && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">PPnBM (%)</span>
                      <input disabled={isReadOnly} type="number" className="w-16 px-2 py-1.5 text-center bg-white border border-slate-300 focus:outline-none focus:border-blue-500 text-sm rounded-sm disabled:bg-slate-100 disabled:text-slate-500" value={form.ppnbm_persen || ''} onChange={e => setForm({ ...form, ppnbm_persen: Number(e.target.value) })} />
                    </div>
                    <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm rounded-sm text-purple-700" value={ppnbmAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-slate-700">Ongkos Angkut</span>
                  <input disabled={isReadOnly} type="number" className="w-48 px-3 py-1.5 text-right bg-white border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm disabled:bg-slate-100 disabled:text-slate-500" value={form.ongkos_angkut || ''} onChange={e => setForm({ ...form, ongkos_angkut: Number(e.target.value) })} />
                </div>
                
                {/* Total Akhir */}
                <div className="flex justify-end mt-2">
                  <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm w-full">
                    <span className="px-4 py-3 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">Total Akhir</span>
                    <span className="px-3 py-3 text-xs font-bold text-slate-600 bg-slate-50 border-r border-slate-300">IDR</span>
                    <span className="px-4 py-3 text-base font-bold text-slate-900 text-right min-w-[160px] font-mono">
                      {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button disabled={isReadOnly || !form.id} onClick={handleDelete} className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50">
                  <Trash2 size={16} /> HAPUS SO
                </button>
                <button disabled={isReadOnly || isSaving} onClick={handleSave} className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md w-full disabled:bg-slate-400">
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {isSaving ? 'MENYIMPAN...' : 'SIMPAN SALES ORDER'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
