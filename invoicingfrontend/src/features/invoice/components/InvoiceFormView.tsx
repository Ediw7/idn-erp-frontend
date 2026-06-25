import React from 'react';
import { FilePlus, Printer, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { InvoiceFormUmum } from './InvoiceFormUmum';
import { InvoiceDetail } from './InvoiceDetail';
import { InvoiceSuratJalan } from './InvoiceSuratJalan';
import { InvoiceHistory } from './InvoiceHistory';
import toast from 'react-hot-toast';

interface InvoiceFormViewProps {
  form: any;
  setForm: (form: any) => void;
  emptyForm: any;
  dataList: any[];
  pelanggans: any[];
  proyeks: any[];
  mataUangs: any[];
  salesOrders: any[];
  pembayarans: any[];
  salesmans: any[];
  gudangs: any[];
  items: any[];
  loadingData: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setViewMode: (mode: 'list' | 'form') => void;
  setModalForm: (form: any) => void;
  setShowNewInvoiceModal: (show: boolean) => void;
  setShowPelangganModal: (show: boolean) => void;
  setShowFpModal: (show: boolean) => void;
  handlePembeliChange: (id: number | '') => void;
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
  handleSaveAll: () => void;
  signatureData: any;
  user: any;
  confirm: any;
}

export const InvoiceFormView: React.FC<InvoiceFormViewProps> = ({
  form, setForm, emptyForm, dataList, pelanggans, proyeks, mataUangs, salesOrders,
  pembayarans, salesmans, gudangs, items, loadingData, activeTab, setActiveTab,
  setViewMode, setModalForm, setShowNewInvoiceModal, setShowPelangganModal, setShowFpModal,
  handlePembeliChange, handleOpenAddLine, handleOpenEditLine, removeLine, handleSaveAll,
  signatureData, user, confirm
}) => {
  const navigate = useNavigate();
  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white disabled:bg-slate-100 disabled:text-slate-500";
  const btnClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2";

  const handleCreateKwitansi = async () => {
    if (!form.no_invoice) {
      toast.error('Pilih atau buat Invoice terlebih dahulu!');
      return;
    }
    
    const isConfirmed = await confirm({
      title: 'Buat Kwitansi',
      message: `Apakah Anda ingin membuat Kwitansi untuk Invoice ${form.no_invoice}?`,
      confirmText: 'Ya, Lanjutkan',
      isDestructive: false
    });

    if (isConfirmed) {
      navigate('/kwitansi', { 
        state: { 
          no_invoice: form.no_invoice,
          pembeli_id: form.pembeli_id,
          alamat: form.alamat,
          // Placeholder for total since it's uncalculated locally, ideally passed from a real calculated total
          jumlah: 418000, 
          keterangan: `Pembayaran untuk Invoice No. ${form.no_invoice}`
        }
      });
    }
  };

  const handleUpdateFpClick = () => {
    if (!form.no_invoice) {
      toast.error('Pilih atau buat Invoice terlebih dahulu!');
      return;
    }
    setShowFpModal(true);
  };

  const subtotal = (form.lines || []).reduce((acc: number, line: any) => {
    const base = (line.kuantum || 0) * (line.harga_satuan || 0);
    const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
    return acc + (base - disc);
  }, 0);
  
  const ppnPercent = 11;
  const ppnAmount = subtotal * (ppnPercent / 100);
  const totalAkhir = subtotal + ppnAmount;

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex flex-wrap gap-3 justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Invoice</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
            <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400">
              <option>Juni 2026</option>
              <option>Mei 2026</option>
            </select>
            <span className="text-xs text-slate-300 font-medium ml-2">Jenis Invoice:</span>
            <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400">
              <option>Dengan PPN</option>
              <option>Tanpa PPN</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setViewMode('list')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors rounded-sm shadow-sm whitespace-nowrap">
             KEMBALI KE LIST
          </button>
          <button onClick={() => { setModalForm({...emptyForm, no_invoice: `INV/00${Math.floor(Math.random()*100)}/06/2026`}); setShowNewInvoiceModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm whitespace-nowrap">
             <FilePlus size={12} /> + TAMBAH INVOICE
          </button>
          <button onClick={() => navigate(form.no_invoice ? `/laporan?invoice_number=${encodeURIComponent(form.no_invoice)}&reportName=${encodeURIComponent('Invoice (A4 / Kuarto)')}` : '/laporan?reportName=Invoice (A4 / Kuarto)')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm whitespace-nowrap">
             <Printer size={12} /> CETAK
          </button>
          <button onClick={handleUpdateFpClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-600 border border-transparent hover:bg-green-700 transition-colors rounded-sm shadow-sm whitespace-nowrap">
             PERBARUI FP
          </button>
          <button onClick={handleCreateKwitansi} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-green-600 border border-transparent hover:bg-green-700 transition-colors rounded-sm shadow-sm whitespace-nowrap">
             PERBARUI KWITANSI
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-100 p-6 flex flex-col">
        {/* Tabs */}
        <div className="px-1 border-b border-slate-300 flex gap-1 mb-6">
          {(['umum', 'detail', 'surat_jalan', 'history'] as const).map(tab => {
            const labels: any = {
              umum: 'Informasi Umum',
              detail: 'Detail Barang/Jasa',
              surat_jalan: 'Surat Jalan',
              history: 'History Pembayaran'
            };
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

        {activeTab === 'umum' && (
          <div className="flex flex-col gap-6">
            <InvoiceFormUmum 
              form={form} setForm={setForm} dataList={dataList} pelanggans={pelanggans} proyeks={proyeks} mataUangs={mataUangs} salesOrders={salesOrders} pembayarans={pembayarans} salesmans={salesmans} gudangs={gudangs} loadingData={loadingData} setShowPelangganModal={setShowPelangganModal} handlePembeliChange={handlePembeliChange}
            />
          </div>
        )}

        {activeTab === 'detail' && (
          <div className="flex flex-col gap-6">
            <InvoiceDetail 
              form={form} items={items} handleOpenAddLine={handleOpenAddLine} handleOpenEditLine={handleOpenEditLine} removeLine={removeLine}
            />
          </div>
        )}

        {activeTab === 'surat_jalan' && (
          <div className="flex flex-col gap-6 h-full">
            <InvoiceSuratJalan form={form} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex flex-col gap-6 h-full">
            <InvoiceHistory form={form} totalAkhir={totalAkhir} />
          </div>
        )}
        {/* Box 4: Footer Kalkulasi & Tanda Tangan */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm p-6 shrink-0 flex flex-col lg:flex-row gap-8 justify-between mt-2">
           {/* Kiri: Tanda Tangan */}
           <div className="flex-1 max-w-lg flex flex-col gap-4">
             <div className="flex gap-4 items-start">
                <div className="w-24 shrink-0 flex flex-col gap-1">
                  <label className="text-sm font-semibold text-slate-700">Ttd / Cap</label>
                  {signatureData && signatureData.ttd_image ? (
                    <img src={`data:image/png;base64,${signatureData.ttd_image}`} alt="Tanda Tangan" className="h-16 object-contain border border-slate-200 bg-white p-1 rounded-sm shadow-sm" />
                  ) : (
                    <div className="h-16 border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 text-center p-2 rounded-sm leading-tight">Canvas / Kosong</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                     <label className="text-xs font-semibold text-slate-600 w-12 shrink-0">Nama</label>
                     <input type="text" className={`${inputClass} flex-1 min-w-[120px]`} value={form.penandatangan || ''} onChange={e => setForm({...form, penandatangan: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-2">
                     <label className="text-xs font-semibold text-slate-600 w-12 shrink-0">Jabatan</label>
                     <input type="text" className={`${inputClass} flex-1 min-w-[120px]`} value={form.jabatan || ''} onChange={e => setForm({...form, jabatan: e.target.value})} />
                  </div>
                </div>
             </div>
             <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Keterangan</label>
                <textarea className={`${inputClass} w-full h-16 resize-none`} value={form.keterangan || ''} onChange={e => setForm({...form, keterangan: e.target.value})} />
             </div>
           </div>

           {/* Kanan: Dua Kolom Kalkulasi */}
           <div className="flex flex-wrap lg:flex-nowrap gap-6 shrink-0">
             {/* Kalkulasi Piutang */}
             <div className="flex flex-col gap-2 w-[240px] shrink-0 lg:border-l border-slate-300 lg:pl-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Nilai Invoice</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value={totalAkhir.toLocaleString('en-US', {minimumFractionDigits: 2})} />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Pembayaran</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value="0.00" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Potongan</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value="0.00" />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Nota Kredit</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value="0.00" />
               </div>
               <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-300">
                  <span className="text-sm font-bold text-slate-800">Sisa Piutang</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-white border border-slate-400 rounded-sm font-mono font-bold text-slate-900" readOnly value={totalAkhir.toLocaleString('en-US', {minimumFractionDigits: 2})} />
               </div>
             </div>

             {/* Kalkulasi Akhir */}
             <div className="flex flex-col gap-2 w-[260px] shrink-0 border-l border-slate-300 pl-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Jlh Harga Jual</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value={subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})} />
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Disc.</span>
                  <div className="flex gap-1.5 w-32 justify-end">
                    <input type="number" className="w-10 text-center px-1 py-1 text-sm border border-slate-300 rounded-sm" placeholder="%" />
                    <input type="text" className="w-[80px] text-right px-2 py-1 text-sm bg-white border border-slate-300 rounded-sm font-mono" value="0.00" readOnly />
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Uang Muka</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-white border border-slate-300 rounded-sm font-mono" readOnly value="0.00" />
               </div>
               <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" /> Incl PPN
                  </label>
                  <div className="flex gap-1.5 items-center w-32 justify-end">
                    <span className="text-xs font-bold text-slate-500">PPN</span>
                    <input type="number" className="w-10 text-center px-1 py-1 text-sm border border-slate-300 rounded-sm" value={ppnPercent} readOnly />
                    <input type="text" className="w-[80px] text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono" readOnly value={ppnAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} />
                  </div>
               </div>
               <div className="flex items-center justify-end">
                  <div className="flex gap-1.5 items-center w-32 justify-end">
                    <span className="text-xs font-bold text-slate-500">PPh 22</span>
                    <input type="number" className="w-10 text-center px-1 py-1 text-sm border border-slate-300 rounded-sm" defaultValue={0} />
                    <input type="text" className="w-[80px] text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono" readOnly value="0.00" />
                  </div>
               </div>
               <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-300">
                  <span className="text-sm font-bold text-slate-800">Total</span>
                  <input type="text" className="w-32 text-right px-2 py-1 text-base bg-white border border-slate-400 rounded-sm font-mono font-bold text-slate-900 shadow-inner" readOnly value={totalAkhir.toLocaleString('en-US', {minimumFractionDigits: 2})} />
               </div>
           </div>
        </div>
      </div>
      </div>

      {/* Global Persistent Footer Buttons */}
      <div className="bg-white border-t border-slate-300 p-4 shrink-0 flex justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button className={`${btnClass} bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-6 py-2 text-sm`}>
           BATAL
        </button>
        <button onClick={handleSaveAll} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-8 py-2 text-sm shadow-sm`}>
          <Save size={16} /> SIMPAN INVOICE
        </button>
      </div>
    </div>
  );
};
