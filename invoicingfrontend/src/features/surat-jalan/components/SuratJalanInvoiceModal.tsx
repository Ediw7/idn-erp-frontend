import React from 'react';
import { X, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface SuratJalanInvoiceModalProps {
  form: any;
  pelanggans: any[];
  onClose: () => void;
  navigate: (url: string) => void;
}

export const SuratJalanInvoiceModal: React.FC<SuratJalanInvoiceModalProps> = ({
  form, pelanggans, onClose, navigate
}) => {
  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-md shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-semibold text-base">Generate Invoice</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-50 flex flex-col gap-4">
          <div className="bg-green-50 text-green-800 text-xs p-3 rounded-sm border border-green-200 font-medium">
            Proses ini akan mengonversi Surat Jalan saat ini menjadi Draft Invoice.
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
            <select className={`${inputClass} bg-slate-100 cursor-not-allowed`} disabled value={form.pelanggan_id || ''}>
              <option value="">-- Pilih --</option>
              {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Dikirim ke Alamat</label>
            <textarea className={`${inputClass} bg-slate-100 h-16 resize-none cursor-not-allowed`} disabled value={form.alamat_kirim || ''} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">No. Surat Jalan</label>
              <select className={`${inputClass} bg-slate-100 font-mono cursor-not-allowed`} disabled value={form.no_sj || ''}>
                <option value={form.no_sj}>{form.no_sj}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-700">Tanggal Buat Invoice</label>
              <input type="date" className={inputClass} value={new Date().toISOString().split('T')[0]} readOnly />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700">Pilih Jenis PPN</label>
            <select className={inputClass} >
              <option>Dengan PPN 11%</option>
              <option>Tanpa PPN (0%)</option>
            </select>
          </div>
        </div>

        <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              toast.success('Draft Invoice berhasil digenerate!');
              const sjParam = encodeURIComponent(form.no_sj || '');
              const soParam = encodeURIComponent(form.no_so || '');
              const pelangganParam = encodeURIComponent(form.pelanggan_id || '');
              navigate(`/invoice?sj=${sjParam}&so=${soParam}&pelanggan=${pelangganParam}`);
            }}
            className="px-6 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent rounded-sm hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Send size={14} /> Buat Invoice Penjualan
          </button>
        </div>
      </div>
    </div>
  );
};
