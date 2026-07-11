import React from "react";
import { FilePlus } from "lucide-react";
import { SalesOrderList } from "./SalesOrderList";

interface SalesOrderListViewProps {
  dataList: any[];
  loadingData: boolean;
  pelanggans: any[];
  mataUangs: any[];
  salesmans: any[];
  wajibPpnbm: boolean;
  periode: string;
  setPeriode: (p: string) => void;
  onEdit: (item: any, idx: number) => void;
  onDelete: (id: number) => void;
  onOpenForm: () => void;
}

export const SalesOrderListView: React.FC<SalesOrderListViewProps> = ({
  dataList,
  loadingData,
  pelanggans,
  mataUangs,
  salesmans,
  wajibPpnbm,
  periode,
  setPeriode,
  onEdit,
  onDelete,
  onOpenForm,
}) => {
  const [searchPelanggan, setSearchPelanggan] = React.useState("");

  const filteredData = dataList.filter((item) => {
    if (!searchPelanggan) return true;
    return String(item.pelanggan_id) === searchPelanggan;
  });

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Sales Order</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select
                value={periode.split("-")[1]}
                onChange={(e) =>
                  setPeriode(`${periode.split("-")[0]}-${e.target.value}`)
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
                value={periode.split("-")[0]}
                onChange={(e) =>
                  setPeriode(`${e.target.value}-${periode.split("-")[1]}`)
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
                value={searchPelanggan}
                onChange={(e) => setSearchPelanggan(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-48"
              >
                <option value="">-- Semua Pelanggan --</option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          onClick={onOpenForm}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
        >
          <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <SalesOrderList
        salesOrders={filteredData}
        loadingList={loadingData}
        pelanggans={pelanggans}
        mataUangs={mataUangs}
        salesmans={salesmans}
        wajibPpnbm={wajibPpnbm}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
