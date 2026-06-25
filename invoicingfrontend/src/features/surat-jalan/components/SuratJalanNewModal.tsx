import React from 'react';
import { X, Save } from 'lucide-react';

interface SuratJalanNewModalProps {
  modalForm: any;
  setModalForm: (f: any) => void;
  pelanggans: any[];
  gudangs: any[];
  salesOrders: any[];
  handlePelangganChange: (form: any, setForm: any, val: string) => void;
  handleSOChange: (form: any, setForm: any, val: string) => void;
  handleCreateSJ: () => void;
  onClose: () => void;
}

export const SuratJalanNewModal: React.FC<SuratJalanNewModalProps> = ({
  modalForm, setModalForm, pelanggans, gudangs, salesOrders,
  handlePelangganChange, handleSOChange, handleCreateSJ, onClose
}) => {
  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-md shadow-2xl flex flex-col overflow-hidden border border-slate-300 my-8">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="font-semibold text-base">Buat Surat Jalan Baru</h3>
            <p className="text-xs text-slate-300 mt-0.5">Isi detail dokumen header sebelum menambahkan pengiriman barang.</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">No. Surat Jalan</label>
                <div className="flex gap-2">
                  <input type="text" className={`${inputClass} flex-1`} value={modalForm.no_sj || ''} onChange={e => setModalForm({ ...modalForm, no_sj: e.target.value })} />
                  <button
                    className="px-3 py-1.5 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm"
                    onClick={() => {
                      const defGudangId = gudangs.find(g => g.is_default)?.id || '';
                      setModalForm({ ...modalForm, gudang_id: String(defGudangId), no_sj: `SJ/00${Math.floor(Math.random() * 100)}/06/2026` });
                    }}
                  >
                    Auto No
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Tanggal Pengiriman</label>
                <input type="date" className={inputClass} value={modalForm.tanggal || ''} onChange={e => setModalForm({ ...modalForm, tanggal: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                <select
                  className={inputClass}
                  value={modalForm.pelanggan_id || ''}
                  onChange={e => handlePelangganChange(modalForm, setModalForm, e.target.value)}
                >
                  <option value="">-- Pilih --</option>
                  {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Dikirim ke Alamat</label>
                <textarea
                  className={`${inputClass} h-20 resize-none bg-slate-50`}
                  readOnly
                  value={modalForm.alamat_kirim || ''}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Gudang</label>
                <select className={inputClass} value={modalForm.gudang_id || ''} onChange={e => setModalForm({ ...modalForm, gudang_id: e.target.value })}>
                  <option value="">-- Pilih Gudang --</option>
                  {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">No. Sales Order</label>
                  <select className={inputClass} value={modalForm.no_so || ''} onChange={e => handleSOChange(modalForm, setModalForm, e.target.value)}>
                    <option value="">-- Pilih SO --</option>
                    {salesOrders.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">No. PO Pelanggan</label>
                  <input type="text" className={inputClass} value={modalForm.no_po || ''} onChange={e => setModalForm({ ...modalForm, no_po: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">No. Kendaraan</label>
                <input type="text" className={inputClass} value={modalForm.no_kendaraan || ''} onChange={e => setModalForm({ ...modalForm, no_kendaraan: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Keterangan</label>
                <input type="text" className={inputClass} value={modalForm.keterangan || ''} onChange={e => setModalForm({ ...modalForm, keterangan: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleCreateSJ}
            className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 border border-transparent rounded-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={14} /> Buat Header SJ
          </button>
        </div>
      </div>
    </div>
  );
};
