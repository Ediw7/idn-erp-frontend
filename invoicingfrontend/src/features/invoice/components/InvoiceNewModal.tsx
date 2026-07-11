import React from "react";
import { X } from "lucide-react";
import { getInvoiceAutoNo } from "../../transactionsApi";

interface InvoiceNewModalProps {
  modalForm: any;
  setModalForm: (form: any) => void;
  setShowNewInvoiceModal: (show: boolean) => void;
  handleCreateInvoiceHeader: () => void;
  pelanggans: any[];
  salesOrders: any[];
  loadingData: boolean;
  handlePembeliChange: (id: number | "", isModal: boolean) => void;
}

export const InvoiceNewModal: React.FC<InvoiceNewModalProps> = ({
  modalForm,
  setModalForm,
  setShowNewInvoiceModal,
  handleCreateInvoiceHeader,
  pelanggans,
  salesOrders,
  loadingData,
  handlePembeliChange,
}) => {
  const inputClass =
    "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white disabled:bg-slate-100 disabled:text-slate-500";
  const labelClass = "text-sm font-semibold text-slate-700 w-28 shrink-0 pt-1";
  const btnClass =
    "px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-white font-bold text-lg">
            Buat Header Invoice Baru
          </h3>
          <button
            onClick={() => setShowNewInvoiceModal(false)}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-5">
          <div>
            <label className={labelClass}>No. Invoice</label>
            <div className="flex gap-3">
              <input
                type="text"
                className={`${inputClass} font-mono flex-1 bg-slate-50`}
                value={modalForm.no_invoice || ""}
                onChange={(e) =>
                  setModalForm({ ...modalForm, no_invoice: e.target.value })
                }
              />
              <button
                className="px-5 text-sm font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm transition-colors"
                onClick={async () => {
                  const autoNo = await getInvoiceAutoNo();
                  setModalForm({ ...modalForm, no_invoice: autoNo });
                }}
              >
                Auto No
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Tanggal Invoice</label>
            <input
              type="date"
              className={inputClass}
              value={modalForm.tgl_invoice || ""}
              onChange={(e) =>
                setModalForm({ ...modalForm, tgl_invoice: e.target.value })
              }
            />
          </div>
          <div>
            <label className={labelClass}>Nama Pembeli</label>
            <div className="flex gap-3">
              <select
                className={`${inputClass} flex-1`}
                value={modalForm.pembeli_id || ""}
                onChange={(e) =>
                  handlePembeliChange(
                    e.target.value ? Number(e.target.value) : "",
                    true,
                  )
                }
              >
                <option value="">
                  {loadingData ? "Loading data..." : "-- Pilih Pembeli --"}
                </option>
                {pelanggans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} - {p.alamat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>No. Sales Order</label>
            <div className="flex gap-3">
              <select
                className={`${inputClass} flex-1`}
                value={modalForm.no_so || ""}
                onChange={(e) => {
                  const no_so = e.target.value;
                  const so = salesOrders.find((s) => s.no_so === no_so);
                  if (so && so.pelanggan_id) {
                    const p = pelanggans.find((x) => x.id === so.pelanggan_id);
                    setModalForm({
                      ...modalForm,
                      no_so,
                      pembeli_id: so.pelanggan_id,
                      alamat: p?.alamat_wp || p?.alamat || "",
                      npwp: p?.npwp || "",
                    });
                  } else {
                    setModalForm({ ...modalForm, no_so });
                  }
                }}
              >
                <option value="">-- Kosong / Opsional --</option>
                {salesOrders.map((so) => (
                  <option key={so.id} value={so.no_so}>
                    {so.no_so} - {so.pelanggan_nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-8 py-5 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => setShowNewInvoiceModal(false)}
            className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50`}
          >
            {" "}
            TUTUP{" "}
          </button>
          <button
            onClick={handleCreateInvoiceHeader}
            className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-6`}
          >
            {" "}
            BUAT INVOICE{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
