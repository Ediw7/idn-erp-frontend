import React from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface PembayaranLineModalProps {
  editLineIndex: number | null;
  lineForm: any;
  setLineForm: (form: any) => void;
  availableInvoices: any[];
  onClose: () => void;
  onSave: () => void;
}

export const PembayaranLineModal: React.FC<PembayaranLineModalProps> = ({
  editLineIndex, lineForm, setLineForm, availableInvoices, onClose, onSave
}) => {
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white";
  const readOnlyClass = "w-full px-3 py-2 border border-slate-200 rounded-sm text-sm bg-slate-50 text-slate-500 cursor-not-allowed";

  const handleInvoiceChange = (noInvoice: string) => {
    const inv = availableInvoices.find(i => i.no_invoice === noInvoice);
    if (inv) {
      // In a real system, saldo_piutang should be calculated from invoice total minus existing payments.
      // We will assume the invoice object has total_akhir or similar.
      const totalInvoice = inv.total_akhir || 0;
      setLineForm({
        ...lineForm,
        no_invoice: inv.no_invoice,
        no_faktur_pajak: inv.no_faktur_pajak || '',
        tgl_jt: inv.jatuh_tempo || inv.tanggal || '',
        ccy: 'IDR',
        saldo_piutang: totalInvoice,
        pembayaran: totalInvoice, // Auto-fill with full amount by default
        potongan: 0
      });
    } else {
      setLineForm({
        ...lineForm, no_invoice: '', no_faktur_pajak: '', tgl_jt: '', ccy: 'IDR', saldo_piutang: 0, pembayaran: 0, potongan: 0
      });
    }
  };

  const handleSave = () => {
    if (!lineForm.no_invoice) {
      toast.error('Pilih No. Invoice terlebih dahulu!');
      return;
    }
    if (Number(lineForm.pembayaran) <= 0) {
      toast.error('Nominal Pembayaran harus lebih dari 0!');
      return;
    }
    onSave();
  };

  const saldoPiutang = Number(lineForm.saldo_piutang) || 0;
  const pembayaran = Number(lineForm.pembayaran) || 0;
  const potongan = Number(lineForm.potongan) || 0;
  const saldoAkhir = saldoPiutang - (pembayaran + potongan);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-md shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-semibold text-base">{editLineIndex !== null ? 'Ubah Rincian Pembayaran' : 'Tambah Rincian Pembayaran'}</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col gap-6 bg-slate-50">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Pilih Invoice</label>
              <select 
                className={inputClass}
                value={lineForm.no_invoice || ''}
                onChange={(e) => handleInvoiceChange(e.target.value)}
                disabled={editLineIndex !== null}
              >
                <option value="">- Pilih Invoice -</option>
                {editLineIndex !== null && <option value={lineForm.no_invoice}>{lineForm.no_invoice}</option>}
                {availableInvoices.map(inv => (
                  <option key={inv.id} value={inv.no_invoice}>{inv.no_invoice}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">No. Faktur Pajak</label>
              <input type="text" className={readOnlyClass} readOnly value={lineForm.no_faktur_pajak || '-'} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Tanggal Jatuh Tempo</label>
              <input type="text" className={readOnlyClass} readOnly value={lineForm.tgl_jt || '-'} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Mata Uang</label>
              <input type="text" className={readOnlyClass} readOnly value={lineForm.ccy || 'IDR'} />
            </div>
          </div>

          <hr className="border-slate-200" />

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Saldo Piutang Awal</label>
              <input type="text" className={`${readOnlyClass} font-mono text-right`} readOnly value={saldoPiutang.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Nilai Pembayaran</label>
              <input 
                type="number" 
                className={`${inputClass} font-mono text-right font-bold text-blue-700`}
                value={lineForm.pembayaran}
                onChange={(e) => setLineForm({ ...lineForm, pembayaran: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Nilai Potongan</label>
              <input 
                type="number" 
                className={`${inputClass} font-mono text-right text-orange-600`}
                value={lineForm.potongan}
                onChange={(e) => setLineForm({ ...lineForm, potongan: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Saldo Akhir</label>
              <input 
                type="text" 
                className={`${readOnlyClass} font-mono font-bold text-right ${saldoAkhir === 0 ? 'text-green-600' : (saldoAkhir < 0 ? 'text-red-600' : 'text-slate-800')}`} 
                readOnly 
                value={saldoAkhir.toLocaleString('en-US', { minimumFractionDigits: 2 })} 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Keterangan</label>
            <textarea 
              className={`${inputClass} h-16 resize-none`}
              value={lineForm.keterangan || ''}
              onChange={(e) => setLineForm({ ...lineForm, keterangan: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors shadow-sm">
            Batal
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Save size={16} /> {editLineIndex !== null ? 'Simpan Perubahan' : 'Tambahkan Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
};
