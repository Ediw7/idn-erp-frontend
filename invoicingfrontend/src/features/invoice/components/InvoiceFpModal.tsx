import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvoiceFpModalProps {
  form: any;
  setShowFpModal: (show: boolean) => void;
}

export const InvoiceFpModal: React.FC<InvoiceFpModalProps> = ({ form, setShowFpModal }) => {
  const navigate = useNavigate();

  const handleRouteToFp = (action: 'PERBARUI' | 'pengganti') => {
    setShowFpModal(false);
    navigate('/faktur-pajak', {
      state: {
        action,
        no_invoice: form.no_invoice,
        pembeli_id: form.pembeli_id,
        alamat: form.alamat,
        npwp: form.npwp,
        lines: form.lines,
        jumlah: 418000 // Placeholder
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-white font-bold text-lg">Konfirmasi Faktur Pajak</h3>
          <button onClick={() => setShowFpModal(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 flex flex-col gap-5 text-center">
          <p className="text-sm font-medium text-slate-700">
            Faktur Pajak untuk invoice ini telah ada. Apakah Anda ingin mengupdate datanya atau membuat Faktur Pajak Pengganti?
          </p>
        </div>
        <div className="bg-slate-50 px-8 py-5 border-t border-gray-200 flex flex-col gap-3">
          <button onClick={() => handleRouteToFp('PERBARUI')} className="w-full px-4 py-2.5 text-sm font-bold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">
            PERBARUI DATA
          </button>
          <button onClick={() => handleRouteToFp('pengganti')} className="w-full px-4 py-2.5 text-sm font-bold rounded-md bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors">
            BUAT PENGGANTI
          </button>
          <button onClick={() => setShowFpModal(false)} className="w-full px-4 py-2.5 text-sm font-bold rounded-md bg-white text-slate-700 border border-gray-300 hover:bg-slate-50 shadow-sm transition-colors mt-2">
            BATAL
          </button>
        </div>
      </div>
    </div>
  );
};
