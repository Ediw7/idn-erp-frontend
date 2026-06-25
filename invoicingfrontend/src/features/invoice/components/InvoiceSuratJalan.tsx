import React from 'react';

interface InvoiceSuratJalanProps {
  form: any;
}

export const InvoiceSuratJalan: React.FC<InvoiceSuratJalanProps> = ({ form }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col min-h-[300px]">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
          <tr>
            <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
            <th className="px-4 py-2 border-r border-slate-300 font-semibold w-48 text-center">No. SJ</th>
            <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-center">Tgl SJ</th>
            <th className="px-4 py-2 font-semibold">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {form.surat_jalans && form.surat_jalans.length > 0 ? form.surat_jalans.map((sj: any, idx: number) => (
            <tr key={idx} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2 border-r border-slate-200 text-center">{idx + 1}</td>
              <td className="px-4 py-2 border-r border-slate-200 font-mono text-center">{sj.no_sj}</td>
              <td className="px-4 py-2 border-r border-slate-200 text-center">{sj.tanggal}</td>
              <td className="px-4 py-2">{sj.keterangan || '-'}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="px-4 py-12 text-center text-slate-500 italic">Belum ada Surat Jalan terkait untuk Invoice ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
