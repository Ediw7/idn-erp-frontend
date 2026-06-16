import React, { useState, useEffect } from 'react';
import { setupApi, ItemData } from '../../setup/api';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';

const ProsesHPP: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Master Data States
  const [items, setItems] = useState<ItemData[]>([]);

  // Form State
  const [form, setForm] = useState({
    item_id: '' as number | '',
    prosesDariAwal: false,
    prosesSemuaBarang: true // Default to true typically for this kind of process
  });

  // Fetch Master Data on Mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const itemRes = await setupApi.getItem();
        setItems(itemRes);
      } catch (error: any) {
        toast.error('Gagal memuat data master barang: ' + error.message);
      }
    };
    fetchMasterData();
  }, []);

  const handleBatal = () => {
    setForm({
      item_id: '',
      prosesDariAwal: false,
      prosesSemuaBarang: true
    });
  };

  const handleProses = async () => {
    if (!form.prosesSemuaBarang && form.item_id === '') {
      toast.error('Silakan pilih Kode Barang terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Sedang memproses perhitungan HPP...');

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Proses perhitungan HPP selesai dilakukan!', { id: toastId });
      handleBatal();
    }, 2000);
  };

  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";
  const inputClass = "w-full md:w-1/3 px-3 py-2 border border-slate-300 bg-white rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:bg-gray-100";

  return (
    <div className="w-full h-full bg-white rounded-none flex flex-col shadow-sm border border-slate-300">
        
        {/* 2. Header Banner Gelap */}
        <div className="p-6 bg-slate-900 w-full rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Proses Perhitungan HPP</h2>
            <p className="text-sm text-slate-300 mt-1">Modul utilitas untuk menghitung ulang Harga Pokok Penjualan (HPP) Inventory</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBatal} 
              disabled={isLoading}
              className="px-5 py-2 bg-transparent border border-slate-600 rounded-sm text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleProses} 
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Proses HPP
            </button>
          </div>
        </div>

        {/* 3. Body Form Area */}
        <div className="p-6 bg-white w-full rounded-none">
          
          {/* Kotak Informasi */}
          <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-md mb-8 border border-blue-100">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm font-medium leading-relaxed">
              Proses ini akan menghitung HPP atas semua transaksi yang belum diproses atau menghitung ulang HPP jika ditemukan data yang tidak sesuai. Proses ini dapat dilakukan setiap saat.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Input Barang */}
            <div>
              <label className={labelClass}>Kode Barang</label>
              <select 
                className={inputClass} 
                value={form.item_id}
                onChange={e => setForm({...form, item_id: e.target.value ? Number(e.target.value) : ''})}
                disabled={form.prosesSemuaBarang || isLoading}
              >
                <option value="">-- Pilih Kode Barang --</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>{item.kode} - {item.nama}</option>
                ))}
              </select>
            </div>

            <div className="w-full h-px bg-slate-100 my-4"></div>

            {/* Checkboxes */}
            <div className="space-y-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  checked={form.prosesDariAwal}
                  onChange={(e) => setForm({...form, prosesDariAwal: e.target.checked})}
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                  Proses Transaksi Dari Awal Penginputan
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  checked={form.prosesSemuaBarang}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    // If checked, optionally clear the selected item_id since it won't be used
                    setForm({...form, prosesSemuaBarang: checked, item_id: checked ? '' : form.item_id});
                  }}
                  disabled={isLoading}
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                  Proses Semua Kode Barang
                </span>
              </label>
            </div>

          </div>

        </div>
      </div>
  );
};

export default ProsesHPP;
