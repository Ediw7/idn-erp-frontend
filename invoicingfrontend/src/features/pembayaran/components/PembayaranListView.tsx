import React from 'react';
import { FilePlus, Edit, Trash2 } from 'lucide-react';

interface PembayaranListViewProps {
  dataList: any[];
  setViewMode: (mode: 'list' | 'form') => void;
  setForm: (form: any) => void;
  emptyForm: any;
  handleDelete: (id: number) => void;
  pelanggans: any[];
}

export const PembayaranListView: React.FC<PembayaranListViewProps> = ({
  dataList, setViewMode, setForm, emptyForm, handleDelete, pelanggans
}) => {
  const [periode, setPeriode] = React.useState('2026-06');
  const [searchPelanggan, setSearchPelanggan] = React.useState('');

  const filteredData = dataList.filter(item => {
    if (!searchPelanggan) return true;
    return String(item.pelanggan_id) === searchPelanggan;
  });

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Pembayaran Piutang Dagang</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Periode:</span>
              <select 
                value={periode} 
                onChange={e => setPeriode(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
                <option value="2026-04">April 2026</option>
              </select>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Pelanggan:</span>
              <select 
                value={searchPelanggan}
                onChange={e => setSearchPelanggan(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-48"
              >
                <option value="">-- Semua Pelanggan --</option>
                {pelanggans.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setForm({ ...emptyForm, no_bukti: `BM/00${Math.floor(Math.random()*100)}/${new Date().getMonth()+1}/${new Date().getFullYear()}` });
            setViewMode('form');
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
        >
          <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white p-4">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
            <tr>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-12">No.</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold">No. Bukti</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-28">Tgl</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold">Nama Pembeli</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-16">Curr</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right w-32">Jumlah</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-28">Metode Bayar</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32">No. Giro</th>
              <th className="px-3 py-2 border-r border-slate-300 font-semibold">Keterangan</th>
              <th className="px-3 py-2 font-semibold text-center w-20">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-12 text-center text-slate-500 italic">
                  Belum ada data pembayaran piutang. Klik "BUKA FORM" untuk memulai.
                </td>
              </tr>
            ) : (
              filteredData.map((item, idx) => {
                const p = pelanggans.find(x => x.id === item.pelanggan_id);
                return (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-2 border-r border-slate-200 text-center">{idx + 1}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-mono font-medium">{item.no_bukti}</td>
                    <td className="px-3 py-2 border-r border-slate-200 text-center">{item.tanggal}</td>
                    <td className="px-3 py-2 border-r border-slate-200">{p?.nama || 'Unknown'}</td>
                    <td className="px-3 py-2 border-r border-slate-200 text-center">{item.mata_uang || 'IDR'}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-mono text-right">
                      {(item.jumlah_penerimaan || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-200">{item.metode_pembayaran || '-'}</td>
                    <td className="px-3 py-2 border-r border-slate-200 font-mono text-slate-600">{item.no_cek_giro || '-'}</td>
                    <td className="px-3 py-2 border-r border-slate-200 text-slate-600">{item.keterangan || '-'}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => { setForm(item); setViewMode('form'); }} className="text-blue-500 hover:text-blue-700 p-1.5 rounded transition-colors hover:bg-blue-50" title="Ubah">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded transition-colors hover:bg-red-50" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
