import React from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

interface PembayaranDetailProps {
  form: any;
  handleOpenAddLine: () => void;
  handleOpenEditLine: (idx: number) => void;
  removeLine: (idx: number) => void;
}

export const PembayaranDetail: React.FC<PembayaranDetailProps> = ({
  form, handleOpenAddLine, handleOpenEditLine, removeLine
}) => {
  const lines = form.lines || [];

  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      <div className="bg-slate-100 border-b border-slate-300 px-4 py-3 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800 text-sm">Rincian Pembayaran</h3>
        <button 
          onClick={handleOpenAddLine} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm"
        >
          <Plus size={14} /> TAMBAH PEMBAYARAN INVOICE
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-center w-12">No.</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold">No. Invoice</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold">No. Faktur Pajak</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-center w-28">Tgl JT</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-center w-16">Ccy</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-right w-32">Saldo Piutang</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-right w-32">Pembayaran</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-right w-32">Potongan</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold text-right w-32">Saldo Akhir</th>
              <th className="px-3 py-2 border-r border-slate-200 font-semibold">Keterangan</th>
              <th className="px-3 py-2 font-semibold text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lines.length > 0 ? lines.map((line: any, idx: number) => {
              const saldoPiutang = Number(line.saldo_piutang) || 0;
              const pembayaran = Number(line.pembayaran) || 0;
              const potongan = Number(line.potongan) || 0;
              const saldoAkhir = saldoPiutang - (pembayaran + potongan);

              return (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-3 py-2 border-r border-slate-100 text-center text-slate-500">{idx + 1}</td>
                  <td className="px-3 py-2 border-r border-slate-100 font-mono font-medium">{line.no_invoice}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-slate-500 font-mono">{line.no_faktur_pajak || '-'}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-center text-slate-600">{line.tgl_jt || '-'}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-center text-slate-500">{line.ccy || 'IDR'}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-right font-mono">{saldoPiutang.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-right font-mono font-bold">{pembayaran.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-right font-mono font-bold text-slate-700">{potongan.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-right font-mono font-bold text-slate-800 bg-slate-50">{saldoAkhir.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-3 py-2 border-r border-slate-100 text-slate-600">{line.keterangan || '-'}</td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => handleOpenEditLine(idx)} className="text-blue-600 hover:bg-blue-100 p-1 rounded transition-colors" title="Ubah Baris">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => removeLine(idx)} className="text-red-600 hover:bg-red-100 p-1 rounded transition-colors" title="Hapus Baris">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={11} className="px-3 py-12 text-center text-slate-500 italic">
                  Belum ada invoice yang dipilih untuk dibayar. Klik "TAMBAH PEMBAYARAN INVOICE".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
