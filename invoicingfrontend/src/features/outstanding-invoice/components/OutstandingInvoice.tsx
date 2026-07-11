import React, { useState, useEffect, useMemo } from "react";
import { Printer, RefreshCw } from "lucide-react";
import {
  setupApi,
  PelangganData,
  ProyekData,
  SalesmanData,
} from "../../setup/api";
import { getOutstanding } from "../../transactionsApi";
import toast from "react-hot-toast";

interface OutstandingData {
  id: string;
  tanggal: string;
  no_invoice: string;
  nama_pelanggan: string;
  alamat: string;
  no_telp: string;
  tgl_jt: string;
  mata_uang: string;
  jumlah: number;
  saldo: number;
  sales: string;
  proyek: string;
  no_so: string;
  no_po: string;
  catatan: string;
}

const OutstandingInvoice: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Master Data
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [proyeks, setProyeks] = useState<ProyekData[]>([]);
  const [salesmen, setSalesmen] = useState<SalesmanData[]>([]);

  // Filter State
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const initialFilter = {
    pelanggan_nama: "",
    periode: currentMonth,
    mata_uang: "",
    proyek: "",
    sales: "",
  };
  const [filter, setFilter] = useState(initialFilter);

  // Data State
  const [dataList, setDataList] = useState<OutstandingData[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      setIsLoading(true);
      try {
        const [pelangganRes, proyekRes, salesRes, outRes] = await Promise.all([
          setupApi.getPelanggan().catch(() => []),
          setupApi.getProyek().catch(() => []),
          setupApi.getSalesman().catch(() => []),
          getOutstanding().catch(() => []),
        ]);
        setPelanggans(pelangganRes);
        setProyeks(proyekRes);
        setSalesmen(salesRes);

        const mapped: OutstandingData[] = outRes.map((inv: any) => ({
          id: String(inv.id),
          tanggal: inv.tgl_invoice,
          no_invoice: inv.no_invoice,
          nama_pelanggan: inv.pelanggan_nama,
          alamat: inv.alamat || "",
          no_telp: inv.no_telp || "",
          tgl_jt: inv.tgl_jt || "",
          mata_uang: inv.mata_uang || "IDR",
          jumlah: inv.total_tagihan,
          saldo: inv.saldo_piutang,
          sales: inv.sales || "",
          proyek: inv.proyek || "",
          no_so: inv.no_so || "",
          no_po: inv.no_po || "",
          catatan: inv.catatan || "",
        }));

        setDataList(mapped);
      } catch (error: any) {
        toast.error("Gagal memuat master data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const handleResetFilter = () => {
    setFilter({
      ...initialFilter,
      periode: currentMonth,
    });
  };

  const handleCetak = () => {
    toast.success("Menyiapkan dokumen PDF...");
  };

  // Filter Data
  const filteredData = useMemo(() => {
    return dataList.filter((item) => {
      if (
        filter.pelanggan_nama &&
        item.nama_pelanggan !== filter.pelanggan_nama
      )
        return false;
      if (filter.periode && !item.tanggal.startsWith(filter.periode))
        return false;
      if (filter.mata_uang && item.mata_uang !== filter.mata_uang) return false;
      if (filter.proyek && item.proyek !== filter.proyek) return false;
      if (filter.sales && item.sales !== filter.sales) return false;
      return true;
    });
  }, [dataList, filter]);

  // Kalkulasi Footer
  const totals = useMemo(() => {
    const totalInvoice = filteredData.reduce(
      (sum, item) => sum + (item.jumlah || 0),
      0,
    );
    const totalSaldo = filteredData.reduce(
      (sum, item) => sum + (item.saldo || 0),
      0,
    );
    return { totalInvoice, totalSaldo };
  }, [filteredData]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(val);

  return (
    <div className="bg-slate-50 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">
            Daftar Outstanding Invoice
          </h2>
          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select
                value={filter.periode.split("-")[1]}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    periode: `${filter.periode.split("-")[0]}-${e.target.value}`,
                  })
                }
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
              <span className="text-xs text-slate-300 font-medium ml-1">
                Tahun:
              </span>
              <select
                value={filter.periode.split("-")[0]}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    periode: `${e.target.value}-${filter.periode.split("-")[1]}`,
                  })
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Pelanggan:
              </span>
              <select
                value={filter.pelanggan_nama}
                onChange={(e) =>
                  setFilter({ ...filter, pelanggan_nama: e.target.value })
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-40"
              >
                <option value="">-- Semua Pelanggan --</option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.nama}>
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
                value={filter.mata_uang}
                onChange={(e) =>
                  setFilter({ ...filter, mata_uang: e.target.value })
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="">-- Semua --</option>
                <option value="IDR">IDR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Proyek:
              </span>
              <select
                value={filter.proyek}
                onChange={(e) =>
                  setFilter({ ...filter, proyek: e.target.value })
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-32"
              >
                <option value="">-- Semua Proyek --</option>
                {proyeks.map((p) => (
                  <option key={p.id} value={p.nama}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-4 w-px bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Sales:</span>
              <select
                value={filter.sales}
                onChange={(e) =>
                  setFilter({ ...filter, sales: e.target.value })
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-32"
              >
                <option value="">-- Semua Sales --</option>
                {salesmen.map((s) => (
                  <option key={s.id} value={s.nama}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    Tanggal
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    No. Invoice
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    Nama Pelanggan
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    Alamat
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    No. Telp
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    Tgl JT
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    Mata Uang
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                    Jumlah
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-right">
                    Saldo
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    Sales
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    Proyek
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    No SO
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">
                    No PO
                  </th>
                  <th className="px-3 py-2 font-semibold text-slate-700">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="px-3 py-2 text-slate-600 text-center">
                        {row.tanggal}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-800 font-medium text-center">
                        {row.no_invoice}
                      </td>
                      <td className="px-3 py-2 text-slate-800">
                        {row.nama_pelanggan}
                      </td>
                      <td
                        className="px-3 py-2 text-slate-600 truncate max-w-[250px]"
                        title={row.alamat}
                      >
                        {row.alamat}
                      </td>
                      <td className="px-3 py-2 text-slate-600 text-center">
                        {row.no_telp || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 text-center">
                        {row.tgl_jt}
                      </td>
                      <td className="px-3 py-2 text-slate-600 font-medium text-center">
                        {row.mata_uang}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right">
                        {formatCurrency(row.jumlah)}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right font-bold">
                        {formatCurrency(row.saldo)}
                      </td>
                      <td className="px-3 py-2 text-slate-600 text-center">
                        {row.sales || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-600 text-center">
                        {row.proyek || "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600 text-center">
                        {row.no_so || "-"}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600 text-center">
                        {row.no_po || "-"}
                      </td>
                      <td className="px-3 py-2 text-slate-500">
                        {row.catatan || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={14}
                      className="px-4 py-8 text-center text-slate-500 italic"
                    >
                      Tidak ada data outstanding invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Totals */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex justify-end gap-6">
            <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm">
              <span className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">
                Total Invoice
              </span>
              <span className="px-4 py-2 text-sm font-bold text-slate-900 text-right min-w-[160px] font-mono">
                {formatCurrency(totals.totalInvoice)}
              </span>
            </div>
            <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm">
              <span className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">
                Total Saldo Piutang
              </span>
              <span className="px-4 py-2 text-sm font-bold text-blue-800 text-right min-w-[160px] font-mono">
                {formatCurrency(totals.totalSaldo)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutstandingInvoice;
