import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setupApi, ItemData, PelangganData } from '../../setup/api';
import { salesOrderApi, SalesOrderData } from '../../sales-order/api';

interface HistoryRecord {
  id: string;
  tgl: string;
  no_invoice: string;
  pelanggan_id: number | null;
  pelanggan_nama: string;
  terms: string;
  curr: string;
  item_id: number | null;
  kode_item: string;
  nama_item: string;
  qty: number;
  harga_satuan: number;
  harga_jual: number;
}

const HistoryHargaJual: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemData[]>([]);
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrderData[]>([]);

  const [filterItemId, setFilterItemId] = useState<number | null>(null);
  const [filterPelangganId, setFilterPelangganId] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(100);

  const [dataList, setDataList] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [i, p, so] = await Promise.all([
        setupApi.getItem(),
        setupApi.getPelanggan(),
        salesOrderApi.getAll()
      ]);
      setItems(i || []);
      setPelanggans(p || []);
      setSalesOrders(so || []);
    } catch (e) {
      console.error(e);
    }
  };

  const applyFilter = (useFilter: boolean) => {
    let allLines: HistoryRecord[] = [];
    salesOrders.forEach(so => {
      (so.lines || []).forEach(line => {
        allLines.push({
          id: `${so.id}-${line.id || Math.random()}`,
          tgl: so.tgl_so || '',
          no_invoice: so.no_so || '',
          pelanggan_id: so.pelanggan_id,
          pelanggan_nama: so.pelanggan_nama || '',
          terms: so.pembayaran_nama || 'Kredit 14 Hari',
          curr: so.mata_uang_kode || 'IDR',
          item_id: line.item_id,
          kode_item: line.kode_barang || items.find(i => i.id === line.item_id)?.kode || '',
          nama_item: line.nama_barang || items.find(i => i.id === line.item_id)?.nama || '',
          qty: line.kuantum || 0,
          harga_satuan: line.harga_satuan || 0,
          harga_jual: line.harga_jual || ((line.kuantum * line.harga_satuan) - (((line.kuantum * line.harga_satuan) * line.disc_persen / 100) + line.disc_harga))
        });
      });
    });

    if (useFilter) {
      if (filterItemId) {
        allLines = allLines.filter(x => x.item_id === filterItemId);
      }
      if (filterPelangganId) {
        allLines = allLines.filter(x => x.pelanggan_id === filterPelangganId);
      }
    }

    allLines.sort((a, b) => TAMBAH BARU Date(b.tgl).getTime() - TAMBAH BARU Date(a.tgl).getTime());

    if (limit > 0) {
      allLines = allLines.slice(0, limit);
    }

    setDataList(allLines);
  };

  const selectedItem = items.find(i => i.id === filterItemId);

  const inputClass = "px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm text-sm";
  const labelClass = "text-xs font-semibold text-slate-700 w-28 shrink-0";
  const btnPrimary = "flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors";
  const btnSecondary = "px-4 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-sm hover:bg-slate-50 border border-slate-300 transition-colors shadow-sm";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Cek History Harga Jual</h2>
          <p className="text-xs text-slate-300 mt-1">Pemantauan riwayat harga jual per pelanggan atau per barang.</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white"
        >
          <X size={14} /> TUTUP </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-12 shrink-0">
        <div className="flex flex-col gap-3 flex-1 max-w-md">
          <div className="flex items-center">
            <label className="text-sm font-semibold text-slate-700 w-32 shrink-0">Kode Barang</label>
            <div className="flex gap-1 flex-1">
              <select 
                className="w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" 
                value={filterItemId || ''} 
                onChange={e => setFilterItemId(Number(e.target.value) || null)}
              >
                <option value="">Semua Barang</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.kode}</option>)}
              </select>
              <button className="px-3 bg-white border border-slate-300 rounded-sm hover:bg-slate-100 flex items-center justify-center">
                <Search size={14} className="text-slate-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <label className="text-sm font-semibold text-slate-700 w-32 shrink-0">Nama Barang</label>
            <input type="text" className="w-full px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-600 rounded-sm text-sm" readOnly value={selectedItem?.nama || ''} />
          </div>
          <div className="flex items-center">
            <label className="text-sm font-semibold text-slate-700 w-32 shrink-0">Nama Pelanggan</label>
            <select 
              className="w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" 
              value={filterPelangganId || ''} 
              onChange={e => setFilterPelangganId(Number(e.target.value) || null)}
            >
              <option value="">Semua Pelanggan</option>
              {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-start">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Tampilkan</span>
            <input type="number" className="w-20 px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm text-center" value={limit} onChange={e => setLimit(Number(e.target.value))} />
            <span className="text-sm font-semibold text-slate-700">record terakhir</span>
          </div>
          <div className="flex gap-2 items-start mt-2">
            <button className="flex items-center gap-2 px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-transparent transition-colors rounded-sm shadow-sm" onClick={() => applyFilter(true)}>
              <Filter size={14} /> FILTER
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors rounded-sm shadow-sm" onClick={() => applyFilter(false)}>
              SHOW ALL
            </button>
          </div>
        </div>
      </div>

      {/* Data Grid Section */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-12">No</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-24">Tanggal</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32">No. Invoice</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold min-w-[200px]">Nama Pelanggan</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-24">Terms</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-center w-16">Ccy</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24">Kode Item</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold min-w-[200px]">Nama Item</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right w-24">Qty</th>
                <th className="px-3 py-2 border-r border-slate-300 font-semibold text-right w-32">Harga Satuan</th>
                <th className="px-3 py-2 border-slate-300 font-semibold text-right w-32">Harga Jual</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-4 text-center text-slate-500 italic">Klik 'FILTER' atau 'SHOW ALL' untuk menampilkan data history.</td>
                </tr>
              ) : (
                dataList.map((row, idx) => (
                  <tr key={row.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">{row.tgl}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 font-medium">{row.no_invoice}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.pelanggan_nama}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">{row.terms}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-center">{row.curr}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.kode_item}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200">{row.nama_item}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-right">{row.qty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-1.5 border-r border-slate-200 text-right">{row.harga_satuan.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-1.5 text-right font-medium">{row.harga_jual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Pagination */}
        <div className="bg-slate-50 border-t border-slate-200 p-2 flex items-center justify-start text-xs text-slate-600 gap-2 shrink-0">
          <span className="ml-2 font-semibold">Record:</span>
          <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm mx-1">
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-r border-slate-300 font-bold">{'|<'}</button>
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-r border-slate-300 font-bold">{'<'}</button>
            <div className="px-4 py-1 bg-white min-w-[50px] text-center font-mono font-semibold">1</div>
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-l border-slate-300 font-bold">{'>'}</button>
            <button className="px-2 py-1 bg-slate-100 hover:bg-white border-l border-slate-300 font-bold">{'>|'}</button>
          </div>
          <span className="font-semibold">of {dataList.length}</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryHargaJual;
