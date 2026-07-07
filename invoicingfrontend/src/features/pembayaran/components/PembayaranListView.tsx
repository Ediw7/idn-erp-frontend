import React from 'react';
import { FilePlus, Edit, Trash2 } from 'lucide-react';
import { getPembayaranAutoNo } from '../../transactionsApi';

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
  const [periode, setPeriode] = React.useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
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
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select 
                value={periode.split('-')[1]} 
                onChange={e => setPeriode(`${periode.split('-')[0]}-${e.target.value}`)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <span className="text-xs text-slate-300 font-medium ml-1">Tahun:</span>
              <select 
                value={periode.split('-')[0]} 
                onChange={e => setPeriode(`${e.target.value}-${periode.split('-')[1]}`)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
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
          onClick={async () => {
            const autoNo = await getPembayaranAutoNo();
            setForm({ ...emptyForm, no_bukti: autoNo });
            setViewMode('form');
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
        >
          <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center w-12">No.</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No. Bukti</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center w-28">Tgl</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Nama Pembeli</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center w-16">Curr</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right w-32">Jumlah</th>
                <th className="px-3 py-2 font-semibold text-slate-700 w-28">Metode Bayar</th>
                <th className="px-3 py-2 font-semibold text-slate-700 w-32">No. Giro</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Keterangan</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-slate-500 italic">
                    Belum ada data pembayaran piutang. Klik "+ BUKA FORM" untuk memulai.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => {
                  const p = pelanggans.find(x => x.id === item.pelanggan_id);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-600 text-center">{idx + 1}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 font-medium">{item.no_bukti}</td>
                      <td className="px-3 py-2 text-slate-600 text-center">{item.tanggal}</td>
                      <td className="px-3 py-2 text-slate-800 truncate max-w-[150px]" title={p?.nama || 'Unknown'}>{p?.nama || 'Unknown'}</td>
                      <td className="px-3 py-2 text-slate-600 font-medium text-center">{item.mata_uang || 'IDR'}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right font-semibold">
                        {(item.jumlah_penerimaan || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-2 text-slate-600">{item.metode_pembayaran || '-'}</td>
                      <td className="px-3 py-2 font-mono text-slate-600">{item.no_cek_giro || '-'}</td>
                      <td className="px-3 py-2 text-slate-600 truncate max-w-[150px]" title={item.keterangan || '-'}>{item.keterangan || '-'}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setForm(item); setViewMode('form'); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title="Ubah">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors" title="Hapus">
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
    </div>
  );
};
