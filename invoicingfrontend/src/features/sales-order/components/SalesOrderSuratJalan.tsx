import React from 'react';

interface SalesOrderSuratJalanProps {
  form: any;
  gudangs: any[];
}

export const SalesOrderSuratJalan: React.FC<SalesOrderSuratJalanProps> = ({ form, gudangs }) => {
  return (
    <table className="w-full text-sm text-left whitespace-nowrap">
      <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
        <tr>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-40">No. Surat Jalan</th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32">Kode Gudang</th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32">Tanggal</th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold w-40">No. Kendaraan</th>
          <th className="px-4 py-2 border-r border-slate-300 font-semibold">Keterangan</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 bg-slate-50">
        {form.surat_jalans && form.surat_jalans.length > 0 ? form.surat_jalans.map((sj: any, idx: number) => (
          <tr key={idx} className="hover:bg-blue-50 transition-colors">
            <td className="px-4 py-2 border-r border-slate-200 text-center">{idx + 1}</td>
            <td className="px-4 py-2 border-r border-slate-200 font-mono">{sj.no_sj}</td>
            <td className="px-4 py-2 border-r border-slate-200">{sj.gudang_id ? gudangs.find(g => String(g.id) === String(sj.gudang_id))?.nama_gudang : '-'}</td>
            <td className="px-4 py-2 border-r border-slate-200">{sj.tanggal}</td>
            <td className="px-4 py-2 border-r border-slate-200">{sj.no_kendaraan || '-'}</td>
            <td className="px-4 py-2 border-r border-slate-200">{sj.keterangan || '-'}</td>
          </tr>
        )) : (
          <tr>
            <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">Belum ada riwayat pengiriman Surat Jalan untuk Sales Order ini.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
