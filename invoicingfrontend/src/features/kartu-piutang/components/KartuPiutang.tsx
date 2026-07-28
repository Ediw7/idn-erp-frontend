import React, { useState, useEffect, useMemo } from "react";
import { setupApi, PelangganData } from "../../setup/api";
import toast from "react-hot-toast";
import { Search, Printer } from "lucide-react";
import { PageLayout } from "../../../components/layouts/PageLayout";

import { kartuPiutangApi, RiwayatPiutang } from "../api";

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
      const response = await kartuPiutangApi.getRiwayat(
        filter.pelanggan_id as number,
        filter.mata_uang,
      );

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
    <PageLayout
      title="Kartu Piutang"
      contentClassName="flex-1 p-0 overflow-hidden flex flex-col"
      filters={
        <>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">
              Pelanggan:
            </span>
            <select
              className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-48"
              value={filter.pelanggan_id}
              onChange={(e) =>
                setFilter({
                  ...filter,
                  pelanggan_id: e.target.value ? Number(e.target.value) : "",
                })
              }
            >
              <option value="">-- Cari Pelanggan --</option>
              {pelanggans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>
          </div>
          <div className="h-4 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">
              Mata Uang:
            </span>
            <select
              className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              value={filter.mata_uang}
              onChange={(e) =>
                setFilter({ ...filter, mata_uang: e.target.value })
              }
            >
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </>
      }
      actions={
        <div className="flex gap-2">
          <button
            onClick={handleCetakLaporan}
            disabled={isSearching}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 bg-transparent border border-slate-600 hover:bg-slate-700 hover:text-white transition-colors rounded-sm shadow-sm disabled:opacity-50"
          >
            <Printer size={14} /> CETAK
          </button>
          <button
            onClick={fetchKartuPiutang}
            disabled={isSearching}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 border border-transparent hover:bg-blue-700 transition-colors rounded-sm shadow-sm disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={14} />
            )}
            CARI DATA
          </button>
        </div>
      }
    >
      {/* 4. Tabel Riwayat Piutang */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    Tanggal
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    No. Invoice
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    No. Ref
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 min-w-[200px]">
                    Keterangan
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                    Debet
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                    Kredit
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                    Saldo Berjalan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isSearching ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      Menarik riwayat data...
                    </td>
                  </tr>
                ) : riwayatList.length > 0 ? (
                  riwayatList.reduce(
                    (acc, row) => {
                      const saldoBerjalan =
                        acc.lastSaldo + (row.debet || 0) - (row.kredit || 0);
                      acc.elements.push(
                        <tr
                          key={row.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-3 py-2 text-slate-600">
                            {row.tanggal}
                          </td>
                          <td className="px-3 py-2 font-mono text-slate-800 font-medium">
                            {row.no_invoice}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {row.no_ref}
                          </td>
                          <td className="px-3 py-2 text-slate-600 whitespace-normal">
                            {row.keterangan}
                          </td>
                          <td className="px-3 py-2 font-mono text-slate-800 text-right">
                            {row.debet > 0 ? formatCurrency(row.debet) : ""}
                          </td>
                          <td className="px-3 py-2 font-mono text-slate-800 text-right">
                            {row.kredit > 0 ? formatCurrency(row.kredit) : ""}
                          </td>
                          <td className="px-3 py-2 font-mono text-blue-700 font-medium text-right bg-slate-50">
                            {formatCurrency(saldoBerjalan)}
                          </td>
                        </tr>,
                      );
                      acc.lastSaldo = saldoBerjalan;
                      return acc;
                    },
                    { elements: [] as React.ReactNode[], lastSaldo: 0 },
                  ).elements
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      {filter.pelanggan_id === ""
                        ? "Pilih pelanggan untuk melihat kartu piutang."
                        : "Tidak ada riwayat transaksi untuk pelanggan ini."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Footer Kalkulasi */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-slate-500 italic">
            * Klik ganda pada baris untuk melihat detail transaksi.
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Total Debet:
              </span>
              <span className="text-sm font-mono font-medium text-slate-800">
                {formatCurrency(totalKalkulasi.totalDebet)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                Total Kredit:
              </span>
              <span className="text-sm font-mono font-medium text-slate-800">
                {formatCurrency(totalKalkulasi.totalKredit)}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                Saldo Akhir:
              </span>
              <span
                className={`text-base font-mono font-bold ${
                  totalKalkulasi.saldo < 0 ? "text-red-600" : "text-blue-700"
                }`}
              >
                {formatCurrency(totalKalkulasi.saldo)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default KartuPiutang;
