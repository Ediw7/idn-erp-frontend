import React from "react";
import { ArrowLeft } from "lucide-react";

interface HistoryHargaJualFormViewProps {
  logic: any;
}

export const HistoryHargaJualFormView: React.FC<
  HistoryHargaJualFormViewProps
> = ({ logic }) => {
  const record = logic.selectedRecord || {};

  const inputClass =
    "flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-sm bg-slate-50 text-slate-700 shadow-sm";
  const labelClass =
    "w-40 text-sm font-semibold text-slate-700 mt-1.5 shrink-0";

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <button
              onClick={() => logic.setViewMode("list")}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-white">
              Detail History Harga Jual
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {/* Mini Header */}
        <div className="bg-white border-l-4 border-l-blue-600 border-y border-r border-slate-300 rounded-sm shadow-sm p-4 shrink-0 flex justify-between items-center">
          <div className="flex gap-12">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                No. Invoice
              </span>
              <span className="font-mono text-base font-bold text-slate-800">
                {record.no_invoice || "-"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                Pelanggan
              </span>
              <span className="text-base font-bold text-slate-800">
                {record.nama_pelanggan || "-"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase">
                Tanggal
              </span>
              <span className="text-base font-bold text-slate-800">
                {record.tgl || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
          <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
            <button className="px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm">
              Rincian Transaksi
            </button>
          </div>

          <div className="overflow-x-auto min-h-[350px] p-6">
            <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
              {/* Kolom Kiri */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>No. Invoice</label>
                  <input
                    type="text"
                    disabled
                    className={`${inputClass} font-mono`}
                    value={record.no_invoice || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Tanggal</label>
                  <input
                    type="text"
                    disabled
                    className={inputClass}
                    value={record.tgl || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Nama Pelanggan</label>
                  <input
                    type="text"
                    disabled
                    className={inputClass}
                    value={record.nama_pelanggan || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Terms</label>
                  <input
                    type="text"
                    disabled
                    className={`${inputClass} w-32`}
                    value={record.terms || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Mata Uang</label>
                  <input
                    type="text"
                    disabled
                    className={`${inputClass} w-32`}
                    value={record.curr || ""}
                  />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>Kode Item</label>
                  <input
                    type="text"
                    disabled
                    className={`${inputClass} font-mono`}
                    value={record.kode_item || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Nama Item</label>
                  <input
                    type="text"
                    disabled
                    className={inputClass}
                    value={record.nama_item || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Qty</label>
                  <input
                    type="text"
                    disabled
                    className={`${inputClass} text-right w-32`}
                    value={record.qty || ""}
                  />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Harga Satuan</label>
                  <input
                    type="text"
                    disabled
                    className={`${inputClass} text-right`}
                    value={
                      record.harga_satuan
                        ? record.harga_satuan.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })
                        : ""
                    }
                  />
                </div>
                <div className="flex items-start mt-2 pt-4 border-t border-slate-200">
                  <label className="w-40 text-sm font-bold text-slate-800 mt-1.5 shrink-0">
                    Total Harga Jual
                  </label>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-bold text-slate-600">
                      {record.curr}
                    </span>
                    <input
                      type="text"
                      disabled
                      className="flex-1 px-3 py-1.5 text-base font-bold text-emerald-700 text-right border border-emerald-300 bg-emerald-50 rounded-sm shadow-sm"
                      value={
                        record.harga_jual
                          ? record.harga_jual.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
