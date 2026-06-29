import React, { useState, useEffect } from 'react';
import { Search, List, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHistoryHargaJualLogic } from './useHistoryHargaJualLogic';
import { setupApi, ItemData } from '../../setup/api';

const HistoryHargaJual: React.FC = () => {
  const navigate = useNavigate();
  const logic = useHistoryHargaJualLogic();
  
  // Modal Items Logic
  const [items, setItems] = useState<ItemData[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchModalKode, setSearchModalKode] = useState('');
  const [searchModalNama, setSearchModalNama] = useState('');
  const [searchModalGroup, setSearchModalGroup] = useState('');

  useEffect(() => {
    if (logic.showItemModal && items.length === 0) {
       fetchItems();
    }
  }, [logic.showItemModal]);

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const res = await setupApi.getItem();
      setItems(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingItems(false);
    }
  };

  const filteredItems = items.filter(it => {
    if (searchModalKode && !it.kode.toLowerCase().includes(searchModalKode.toLowerCase())) return false;
    if (searchModalNama && !it.nama.toLowerCase().includes(searchModalNama.toLowerCase())) return false;
    if (searchModalGroup && it.group_barang_nama && !it.group_barang_nama.toLowerCase().includes(searchModalGroup.toLowerCase())) return false;
    return true;
  });

  const selectItem = (item: ItemData) => {
    logic.setKodeBarang(item.kode);
    logic.setNamaBarang(item.nama);
    logic.setShowItemModal(false);
  };

  return (
    <div className="bg-slate-300 flex flex-col h-[calc(100vh-4rem)] relative overflow-hidden">
      
      {/* Fake Application Window Bar for Krishand Look */}
      <div className="bg-slate-200 border-b border-slate-400 px-2 py-1 flex items-center justify-between shrink-0 shadow-sm">
        <button onClick={() => navigate(-1)} className="px-4 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-400 text-xs font-bold text-slate-800">Close</button>
      </div>

      {/* Top Filter Area (Dark Blue) */}
      <div className="bg-blue-900 px-4 py-3 flex flex-col shrink-0 border-b-2 border-slate-400 shadow-md z-10">
         <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1.5">
               <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-bold w-28 shrink-0">Kode Barang</span>
                  <div className="flex items-center">
                    <input 
                      type="text" 
                      className="w-48 px-1 py-0.5 text-xs bg-white text-slate-800 focus:outline-none focus:bg-yellow-50" 
                      value={logic.kodeBarang} 
                      onChange={e => logic.setKodeBarang(e.target.value)} 
                    />
                    <button 
                      onClick={() => logic.setShowItemModal(true)} 
                      className="bg-slate-200 px-1 py-0.5 hover:bg-slate-300 transition-colors flex items-center justify-center border border-l-0 border-slate-400"
                    >
                      <Search size={14} className="text-slate-700" />
                    </button>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-bold w-28 shrink-0">Nama Barang</span>
                  <input 
                    type="text" 
                    className="w-64 px-1 py-0.5 text-xs bg-white text-slate-800 focus:outline-none focus:bg-yellow-50" 
                    value={logic.namaBarang} 
                    onChange={e => logic.setNamaBarang(e.target.value)} 
                  />
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-bold w-28 shrink-0">Nama Pelanggan</span>
                  <input 
                    type="text" 
                    className="w-64 px-1 py-0.5 text-xs bg-white text-slate-800 focus:outline-none focus:bg-yellow-50" 
                    value={logic.namaPelanggan} 
                    onChange={e => logic.setNamaPelanggan(e.target.value)} 
                  />
               </div>
            </div>

            <div className="flex flex-col gap-3 mr-12">
               <div className="flex items-center gap-2 mt-1">
                  <span className="text-white text-xs font-bold">Tampilkan</span>
                  <input 
                    type="number" 
                    className="w-12 px-1 py-0.5 text-xs text-center bg-white text-slate-800 focus:outline-none" 
                    value={logic.limit === 0 ? '' : logic.limit} 
                    onChange={e => logic.setLimit(Number(e.target.value))} 
                  />
                  <span className="text-white text-xs font-bold">record terakhir</span>
               </div>
               
               <div className="flex flex-col gap-1.5 w-24 ml-auto">
                 <button onClick={logic.handleFilter} className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold py-1 px-2 border border-slate-400 shadow-sm flex justify-center items-center">
                   Filter
                 </button>
                 <button onClick={logic.handleShowAll} className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[11px] font-bold py-1 px-2 border border-slate-400 shadow-sm flex justify-center items-center">
                   Show All
                 </button>
               </div>
            </div>
         </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-slate-400 p-1">
         <div className="overflow-x-auto flex-1 bg-white border border-slate-500 shadow-inner">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-200 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-2 py-1 font-bold text-slate-800 text-center border-r border-b border-slate-400">Tgl</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-center border-r border-b border-slate-400">No. Invoice</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-left border-r border-b border-slate-400">Nama Pelanggan</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-center border-r border-b border-slate-400">Terms</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-center border-r border-b border-slate-400">Curr</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-center border-r border-b border-slate-400">Kode Item</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-left border-r border-b border-slate-400">Nama Item</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-center border-r border-b border-slate-400">Qty</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-right border-r border-b border-slate-400">Harga Satuan</th>
                  <th className="px-2 py-1 font-bold text-slate-800 text-right border-b border-slate-400">Harga Jual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 bg-slate-400">
                {logic.loading ? (
                  <tr><td colSpan={10} className="text-center py-8 italic text-slate-200">Memuat data...</td></tr>
                ) : logic.dataList.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-8 italic text-slate-200">Tidak ada record.</td></tr>
                ) : (
                  logic.dataList.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-blue-800 hover:text-white bg-slate-400 text-black transition-colors cursor-default">
                      <td className="px-2 py-1 text-center border-r border-slate-500">{item.tgl}</td>
                      <td className="px-2 py-1 text-center border-r border-slate-500">{item.no_invoice}</td>
                      <td className="px-2 py-1 text-left border-r border-slate-500 truncate max-w-[200px]">{item.nama_pelanggan}</td>
                      <td className="px-2 py-1 text-center border-r border-slate-500">{item.terms}</td>
                      <td className="px-2 py-1 text-center border-r border-slate-500">{item.curr}</td>
                      <td className="px-2 py-1 text-center border-r border-slate-500">{item.kode_item}</td>
                      <td className="px-2 py-1 text-left border-r border-slate-500 truncate max-w-[250px]">{item.nama_item}</td>
                      <td className="px-2 py-1 text-center border-r border-slate-500">{item.qty}</td>
                      <td className="px-2 py-1 text-right border-r border-slate-500">{item.harga_satuan.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-2 py-1 text-right">{item.harga_jual.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
         </div>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-200 border-t border-slate-400 px-2 py-1 flex items-center shrink-0">
         <span className="text-[11px] font-bold text-slate-800">Record: 1 / {logic.dataList.length}</span>
      </div>

      {/* Modal Pencarian Barang */}
      {logic.showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-slate-400 w-full max-w-2xl shadow-2xl flex flex-col border-2 border-slate-500">
            {/* Modal Header */}
            <div className="bg-blue-900 px-2 py-1 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <List size={14} className="text-white" />
                 <span className="text-white text-[11px] font-bold">Pencarian Barang</span>
              </div>
              <button onClick={() => logic.setShowItemModal(false)} className="text-white hover:text-red-400"><X size={14}/></button>
            </div>
            
            {/* Modal Filters */}
            <div className="bg-blue-800/80 p-2 flex flex-col gap-1.5 shrink-0 border-b border-blue-900">
               <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white font-bold w-20">Kode Barang</span>
                  <input type="text" className="w-32 px-1 py-0.5 text-[11px] bg-white text-black focus:outline-none" value={searchModalKode} onChange={e => setSearchModalKode(e.target.value)} />
                  <span className="text-[11px] text-white font-bold w-20 ml-4">Nama Barang</span>
                  <input type="text" className="flex-1 px-1 py-0.5 text-[11px] bg-white text-black focus:outline-none" value={searchModalNama} onChange={e => setSearchModalNama(e.target.value)} />
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white font-bold w-20">Group Barang</span>
                  <input type="text" className="w-48 px-1 py-0.5 text-[11px] bg-white text-black focus:outline-none" value={searchModalGroup} onChange={e => setSearchModalGroup(e.target.value)} />
               </div>
            </div>

            {/* Modal Table */}
            <div className="h-64 overflow-y-auto bg-slate-400 p-1">
               <table className="w-full text-[11px] text-left border-collapse bg-white">
                 <thead className="bg-slate-200 sticky top-0 z-10 shadow-sm">
                   <tr>
                     <th className="px-1 py-0.5 font-bold text-slate-800 border-r border-b border-slate-400 w-6 text-center"></th>
                     <th className="px-1 py-0.5 font-bold text-slate-800 border-r border-b border-slate-400">Kode Barang</th>
                     <th className="px-1 py-0.5 font-bold text-slate-800 border-r border-b border-slate-400">Nama Barang</th>
                     <th className="px-1 py-0.5 font-bold text-slate-800 border-r border-b border-slate-400 text-center">Satuan</th>
                     <th className="px-1 py-0.5 font-bold text-slate-800 border-b border-slate-400">Group Barang</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white text-black">
                   {loadingItems ? (
                     <tr><td colSpan={5} className="text-center py-4 italic text-slate-500">Memuat data barang...</td></tr>
                   ) : filteredItems.map(it => (
                     <tr key={it.id} onDoubleClick={() => selectItem(it)} className="hover:bg-blue-800 hover:text-white cursor-pointer group">
                       <td className="px-1 py-0.5 border-r border-slate-300 text-center text-slate-400 group-hover:text-white" onClick={() => selectItem(it)}>▶</td>
                       <td className="px-1 py-0.5 border-r border-slate-300">{it.kode}</td>
                       <td className="px-1 py-0.5 border-r border-slate-300">{it.nama}</td>
                       <td className="px-1 py-0.5 border-r border-slate-300 text-center">{it.satuan}</td>
                       <td className="px-1 py-0.5">{it.group_barang_nama || ''}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-blue-100 p-2 flex flex-col gap-1 shrink-0">
               <span className="text-[10px] text-blue-900 font-bold leading-tight">Untuk memilih data, letakkan kursor pada baris data yang diinginkan, lalu tekan tombol OK atau dobel klik pada bagian record pointer (kiri layar bertanda panah)</span>
               <div className="flex gap-2 mt-1">
                 <button className="px-6 py-0.5 bg-slate-200 border border-slate-400 text-[11px] font-bold text-slate-800 hover:bg-slate-300 shadow-sm" onClick={() => selectItem(filteredItems[0])}>OK</button>
                 <button className="px-6 py-0.5 bg-slate-200 border border-slate-400 text-[11px] font-bold text-slate-800 hover:bg-slate-300 shadow-sm" onClick={() => logic.setShowItemModal(false)}>Cancel</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryHargaJual;
