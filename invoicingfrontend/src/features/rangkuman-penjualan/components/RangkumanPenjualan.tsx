import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RangkumanPenjualan: React.FC = () => {
  const navigate = useNavigate();

  // Data Arrays
  const dataQtyBarang: any[] = [];
  const dataSaleBarang: any[] = [];
  const dataNilaiPelanggan: any[] = [];
  const dataPiutangPelanggan: any[] = [];

  const TableCard = ({
    title,
    columns,
    data,
    dataKeys,
    alignRightIdx,
  }: any) => (
    <div className="flex flex-col bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden h-64">
      <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 shrink-0">
        <h3 className="text-xs font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
            <tr>
              <th className="px-2 py-1.5 border-r border-slate-200 w-8 text-center"></th>
              {columns.map((col: string, idx: number) => (
                <th
                  key={idx}
                  className={`px-2 py-1.5 border-r border-slate-200 font-semibold text-slate-700 ${idx === alignRightIdx ? "text-right" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, i: number) => (
              <tr
                key={i}
                className="border-b border-slate-100 hover:bg-blue-50"
              >
                <td className="px-2 py-1.5 border-r border-slate-100 text-center text-slate-400">
                  {i === 0 ? "▶" : ""}
                </td>
                {dataKeys.map((key: string, idx: number) => (
                  <td
                    key={idx}
                    className={`px-2 py-1.5 border-r border-slate-100 ${idx === alignRightIdx ? "text-right font-medium" : ""}`}
                  >
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Modern Top Header Banner */}
      <div className="bg-slate-800 px-6 py-5 flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">
            Rangkuman Data Penjualan
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Dashboard ringkasan statistik performa penjualan barang dan nilai
            piutang pelanggan.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold text-white transition-colors"
          >
            <X size={14} /> TUTUP{" "}
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <TableCard
            title="Daftar 50 Barang Dengan Kuantitas Penjualan Tertinggi"
            columns={["Kode Barang", "Nama Barang", "Quantity"]}
            dataKeys={["kode", "nama", "qty"]}
            data={dataQtyBarang}
            alignRightIdx={2}
          />

          <TableCard
            title="Daftar 50 Pelanggan Dengan Nilai Penjualan Terbesar"
            columns={["Kode Pelanggan", "Nama Pelanggan", "Alamat", "Jumlah"]}
            dataKeys={["kode", "nama", "alamat", "jumlah"]}
            data={dataNilaiPelanggan}
            alignRightIdx={3}
          />

          <TableCard
            title="Daftar 50 Barang Dengan Nilai Penjualan Tertinggi"
            columns={["Kode Barang", "Nama Barang", "Sale"]}
            dataKeys={["kode", "nama", "sale"]}
            data={dataSaleBarang}
            alignRightIdx={2}
          />

          <TableCard
            title="Daftar 25 Pelanggan Dengan Nilai Piutang Terbesar"
            columns={["Kode Pelanggan", "Nama Pelanggan", "Alamat", "Piutang"]}
            dataKeys={["kode", "nama", "alamat", "piutang"]}
            data={dataPiutangPelanggan}
            alignRightIdx={3}
          />
        </div>
      </div>
    </div>
  );
};

export default RangkumanPenjualan;
