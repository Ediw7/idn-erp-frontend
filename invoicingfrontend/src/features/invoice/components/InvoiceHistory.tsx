import React from 'react';

interface InvoiceHistoryProps {
  form: any;
  totalAkhir: number;
}

export const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ form, totalAkhir }) => {
  return (
    <div className="flex gap-6 min-h-[300px]">
      <div className="flex-1 bg-white border border-slate-200 shadow-sm flex flex-col rounded-sm">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
            <tr>
              <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
              <th className="px-4 py-2 border-r border-slate-300 font-semibold w-48 text-center">No. Ref</th>
              <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-center">Tanggal</th>
              <th className="px-4 py-2 border-r border-slate-300 font-semibold">Keterangan</th>
              <th className="px-4 py-2 font-semibold w-40 text-right">Pembayaran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {form.histories && form.histories.length > 0 ? form.histories.map((h: any, idx: number) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                <td className="px-4 py-2 border-r border-slate-200 text-center">{idx + 1}</td>
                <td className="px-4 py-2 border-r border-slate-200 font-mono text-center">{h.no_ref}</td>
                <td className="px-4 py-2 border-r border-slate-200 text-center">{h.tanggal}</td>
                <td className="px-4 py-2 border-r border-slate-200">{h.keterangan || '-'}</td>
                <td className="px-4 py-2 text-right font-mono text-blue-800 font-semibold">{(h.pembayaran || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500 italic">Belum ada riwayat pembayaran untuk Invoice ini.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="w-64 shrink-0 flex flex-col gap-2">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2 border-b border-slate-200 pb-2">Sisa Piutang</label>
          <div className="bg-slate-50 border border-slate-300 px-3 py-2 text-right font-mono text-xl font-bold text-blue-900 rounded-sm">
            {totalAkhir.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};
