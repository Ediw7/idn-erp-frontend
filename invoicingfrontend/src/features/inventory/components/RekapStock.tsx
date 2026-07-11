import React, { useState, useEffect } from "react";
import { setupApi, GroupBarangData } from "../../setup/api";
import toast from "react-hot-toast";
import { Printer, Download, Search } from "lucide-react";

interface RekapItem {
  id: number;
  kode_barang: string;
  nama_barang: string;
  group_barang: string;
  satuan: string;
  saldo_gudang: number;
  blm_dikirim_so: number;
  saldo_setelah_so: number;
}

const RekapStock: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Master Data States
  const [groups, setGroups] = useState<GroupBarangData[]>([]);

  // Filter States
  const [filterGroupId, setFilterGroupId] = useState<number | "">("");

  // Table Data State
  const [rekapList, setRekapList] = useState<RekapItem[]>([]);

  // Fetch Master Data on Mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const groupRes = await setupApi.getGroupBarang();
        setGroups(groupRes);
      } catch (error: any) {
        toast.error("Gagal memuat data Master Group Barang: " + error.message);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch Rekap Data
  const fetchRekapStok = async () => {
    setIsLoading(true);
    try {
      // Simulasi panggilan API ke endpoint (misal: /api/inventory/rekap-stok)
      // karena API spesifik belum didefinisikan di backend.
      const response = await new Promise<RekapItem[]>((resolve) => {
        setTimeout(() => {
          resolve([]); // Return empty list as mockup since no real backend logic for now
        }, 800);
      });

      setRekapList(response);

      if (response.length === 0) {
        // toast.success('Data rekap stok kosong.'); // Optional to comment out to avoid spamming
      }
    } catch (error: any) {
      toast.error("Gagal menarik data rekap stok: " + error.message);
      setRekapList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when filter changes or on mount
  useEffect(() => {
    fetchRekapStok();
  }, [filterGroupId]);

  const handleCetakPDF = () => {
    toast.success("Menyiapkan dokumen cetak PDF...");
  };

  const handleEksporExcel = () => {
    toast.success("Mengekspor data ke format Excel...");
  };

  return (
    <div className="w-full h-full bg-white rounded-none flex flex-col shadow-sm border border-slate-300">
      {/* 2. Header Banner Gelap */}
      <div className="p-6 bg-slate-900 w-full rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Rekap Stock Barang
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Laporan Saldo Barang dan Outstanding SO
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCetakPDF}
            disabled={isLoading}
            className="px-5 py-2 bg-transparent border border-slate-600 rounded-sm text-sm font-bold text-slate-200 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Printer size={16} />
            CETAK PDF
          </button>
          <button
            onClick={handleEksporExcel}
            disabled={isLoading}
            className="px-5 py-2 bg-green-600 border border-green-700 rounded-sm text-sm font-bold text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Download size={16} />
            EKSPOR EXCEL
          </button>
        </div>
      </div>

      {/* 3. Filter Area */}
      <div className="p-6 bg-white border-b border-slate-200 w-full rounded-none">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Pilih Group Barang
          </label>
          <div className="relative">
            <select
              className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
              value={filterGroupId}
              onChange={(e) =>
                setFilterGroupId(e.target.value ? Number(e.target.value) : "")
              }
              disabled={isLoading}
            >
              <option value="">-- Semua Group Barang --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabel Rekap (Read-Only) */}
      <div className="bg-white w-full rounded-none">
        <div className="overflow-x-auto min-h-[500px] custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-slate-200 sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Kode Barang</th>
                <th className="px-5 py-4 min-w-[200px]">Nama Barang</th>
                <th className="px-5 py-4 whitespace-nowrap">Group Barang</th>
                <th className="px-5 py-4 whitespace-nowrap">Satuan</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">
                  Saldo Gudang
                </th>
                <th className="px-5 py-4 text-right whitespace-nowrap">
                  Blm Dikirim (SO)
                </th>
                <th className="px-5 py-4 text-right whitespace-nowrap">
                  Saldo Setelah SO
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="font-medium text-sm">
                        Memuat rekapan stok...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : rekapList.length > 0 ? (
                rekapList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">
                      {row.kode_barang}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {row.nama_barang}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {row.group_barang}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{row.satuan}</td>
                    <td className="px-5 py-3 text-right font-medium text-slate-800">
                      {new Intl.NumberFormat("id-ID").format(row.saldo_gudang)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-blue-600">
                      {new Intl.NumberFormat("id-ID").format(
                        row.blm_dikirim_so,
                      )}
                    </td>
                    <td
                      className={`px-5 py-3 text-right font-bold ${row.saldo_setelah_so < 0 ? "text-red-600" : "text-slate-900"}`}
                    >
                      {new Intl.NumberFormat("id-ID").format(
                        row.saldo_setelah_so,
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <span className="font-medium text-sm">
                        Tidak ada data rekap stok untuk filter ini.
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RekapStock;
