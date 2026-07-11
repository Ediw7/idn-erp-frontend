import React, { useState, useEffect, useMemo } from "react";
import { setupApi, PelangganData } from "../../setup/api";
import toast from "react-hot-toast";
import { Search, Printer } from "lucide-react";

interface RiwayatPiutang {
  id: string;
  tanggal: string;
  no_invoice: string;
  no_ref: string;
  keterangan: string;
  debet: number;
  kredit: number;
}

const KartuPiutang: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Master Data States
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);

  // Filter States
  const [filter, setFilter] = useState({
    pelanggan_id: "" as number | "",
    mata_uang: "IDR",
  });

  // Table Data State
  const [riwayatList, setRiwayatList] = useState<RiwayatPiutang[]>([]);

  // Fetch Master Data on Mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const pelangganRes = await setupApi.getPelanggan();
        setPelanggans(pelangganRes);
      } catch (error: any) {
        toast.error("Gagal memuat data master pelanggan: " + error.message);
      }
    };
    fetchMasterData();
  }, []);

  // Fetch Kartu Piutang Data
  const fetchKartuPiutang = async () => {
    if (filter.pelanggan_id === "") {
      toast.error("Pilih Nama Pelanggan terlebih dahulu!");
      return;
    }

    setIsSearching(true);
    try {
      // Simulasi panggilan API (misal: /api/piutang/kartu?pelanggan_id=...)
      const response = await new Promise<RiwayatPiutang[]>((resolve) => {
        setTimeout(() => {
          resolve([]); // Return empty for now as it's a mockup
        }, 800);
      });

      setRiwayatList(response);

      if (response.length === 0) {
        toast.success("Data riwayat kosong untuk pelanggan tersebut.");
      } else {
        toast.success("Data riwayat berhasil dimuat.");
      }
    } catch (error: any) {
      toast.error("Gagal menarik data kartu piutang: " + error.message);
      setRiwayatList([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCetakLaporan = () => {
    if (filter.pelanggan_id === "") {
      toast.error("Tidak ada data yang bisa dicetak. Pilih Pelanggan!");
      return;
    }
    toast.success("Menyiapkan dokumen cetak...");
  };

  // Kalkulasi Footer
  const totalKalkulasi = useMemo(() => {
    const totalDebet = riwayatList.reduce(
      (sum, item) => sum + (item.debet || 0),
      0,
    );
    const totalKredit = riwayatList.reduce(
      (sum, item) => sum + (item.kredit || 0),
      0,
    );
    const saldo = totalDebet - totalKredit;

    return { totalDebet, totalKredit, saldo };
  }, [riwayatList]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2 }).format(val);

  return (
    <div className="w-full h-full bg-white rounded-none flex flex-col shadow-sm border border-slate-300">
      {/* 2. Header Banner Gelap */}
      <div className="p-6 bg-slate-900 w-full rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Kartu Piutang
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Riwayat Transaksi dan Saldo Piutang Pelanggan
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCetakLaporan}
            disabled={isSearching}
            className="px-5 py-2 bg-transparent border border-white/50 rounded-sm text-sm font-bold text-white hover:bg-white/10 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Printer size={16} />
            CETAK LAPORAN
          </button>
          <button
            onClick={fetchKartuPiutang}
            disabled={isSearching}
            className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            CARI DATA
          </button>
        </div>
      </div>

      {/* 3. Filter Area */}
      <div className="p-6 bg-white border-b border-slate-200 w-full rounded-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Pilih Nama Pelanggan
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={filter.pelanggan_id}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  pelanggan_id: e.target.value ? Number(e.target.value) : "",
                })
              }
            >
              <option value="">-- Cari atau Pilih Pelanggan --</option>
              {pelanggans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Pilih Mata Uang
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50"
              value={filter.mata_uang}
              onChange={(e) =>
                setFilter({ ...filter, mata_uang: e.target.value })
              }
            >
              <option value="IDR">IDR - Rupiah</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Tabel Riwayat Piutang */}
      <div className="bg-white w-full rounded-none">
        <div className="overflow-x-auto min-h-[400px] custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Tanggal</th>
                <th className="px-5 py-4 whitespace-nowrap">No. Invoice</th>
                <th className="px-5 py-4 whitespace-nowrap">No. Ref</th>
                <th className="px-5 py-4 min-w-[200px]">Keterangan</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">
                  Debet
                </th>
                <th className="px-5 py-4 text-right whitespace-nowrap">
                  Kredit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isSearching ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="font-medium text-sm">
                        Menarik riwayat data...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : riwayatList.length > 0 ? (
                riwayatList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">
                      {row.tanggal}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {row.no_invoice}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs">
                      {row.no_ref}
                    </td>
                    <td className="px-5 py-3">{row.keterangan}</td>
                    <td className="px-5 py-3 text-right font-medium text-blue-600">
                      {row.debet > 0 ? formatCurrency(row.debet) : "-"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-green-600">
                      {row.kredit > 0 ? formatCurrency(row.kredit) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <span className="font-medium text-sm">
                        {filter.pelanggan_id === ""
                          ? "Pilih pelanggan untuk melihat kartu piutang."
                          : "Tidak ada riwayat transaksi untuk pelanggan ini."}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Footer Kalkulasi */}
      <div className="bg-slate-100 p-6 border-t border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="text-sm text-blue-600 font-medium">
          * Catatan: Klik ganda pada baris untuk melihat detail transaksi.
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Debet
            </label>
            <div className="bg-gray-50 border border-slate-300 rounded-sm px-4 py-2">
              <span className="text-lg font-bold text-slate-900 block text-right">
                {formatCurrency(totalKalkulasi.totalDebet)}
              </span>
            </div>
          </div>

          <div className="text-2xl font-light text-slate-400 mt-4">-</div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Kredit
            </label>
            <div className="bg-gray-50 border border-slate-300 rounded-sm px-4 py-2">
              <span className="text-lg font-bold text-slate-900 block text-right">
                {formatCurrency(totalKalkulasi.totalKredit)}
              </span>
            </div>
          </div>

          <div className="text-2xl font-light text-slate-400 mt-4">=</div>

          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Saldo
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-sm px-4 py-2 shadow-inner">
              <span
                className={`text-xl font-black block text-right ${totalKalkulasi.saldo < 0 ? "text-red-600" : "text-blue-700"}`}
              >
                {formatCurrency(totalKalkulasi.saldo)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KartuPiutang;
