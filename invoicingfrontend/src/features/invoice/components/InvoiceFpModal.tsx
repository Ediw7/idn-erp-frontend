import React from "react";
import { AlertCircle, FileEdit, FilePlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InvoiceFpModalProps {
  form: any;
  setShowFpModal: (show: boolean) => void;
}

export const InvoiceFpModal: React.FC<InvoiceFpModalProps> = ({
  form,
  setShowFpModal,
}) => {
  const navigate = useNavigate();

  const handleRouteToFp = (action: "PERBARUI" | "pengganti") => {
    setShowFpModal(false);
    navigate("/faktur-pajak", {
      state: {
        action,
        no_invoice: form.no_invoice,
        pembeli_id: form.pembeli_id,
        alamat: form.alamat,
        npwp: form.npwp,
        lines: form.lines,
        jumlah: 418000, // Placeholder
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4">
      <div className="bg-white w-full max-w-[480px] rounded shadow-xl flex flex-col overflow-hidden border border-slate-300">
        
        {/* Header (Light and subtle) */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-500" />
            <h3 className="text-slate-800 font-bold text-base">
              Konfirmasi Faktur Pajak
            </h3>
          </div>
          <button
            onClick={() => setShowFpModal(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-sm hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 text-sm text-slate-600 leading-relaxed">
          Faktur Pajak untuk invoice <span className="font-semibold text-slate-800">{form?.no_invoice || "ini"}</span> telah ada. Apakah Anda ingin mengupdate datanya atau membuat Faktur Pajak Pengganti?
        </div>

        {/* Footer (Buttons side by side) */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-2 border-t border-slate-100">
          <button
            onClick={() => setShowFpModal(false)}
            className="px-4 py-2 text-sm font-semibold rounded-sm bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 hover:text-slate-800 shadow-sm transition-colors"
          >
            Batal
          </button>
          
          <button
            onClick={() => handleRouteToFp("PERBARUI")}
            className="px-4 py-2 text-sm font-semibold rounded-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
          >
            <FileEdit size={16} />
            Perbarui Data
          </button>

          <button
            onClick={() => handleRouteToFp("pengganti")}
            className="px-4 py-2 text-sm font-semibold rounded-sm bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors flex items-center gap-2"
          >
            <FilePlus size={16} />
            Buat Pengganti
          </button>
        </div>

      </div>
    </div>
  );
};
