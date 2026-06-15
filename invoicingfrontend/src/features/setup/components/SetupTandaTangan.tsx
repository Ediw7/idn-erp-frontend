import React, { useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, Eraser } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { setupApi, TandaTanganData } from '../api';
import { useMasterDataCRUD } from '../../../hooks/useMasterDataCRUD';
import toast from 'react-hot-toast';

const FORM_TYPES = [
  'Faktur Pajak',
  'Invoice',
  'Kwitansi',
  'Nota Kredit',
  'Nota Retur',
  'SPT Masa PPN',
  'SSP',
  'Lainnya'
];

const SetupTandaTangan: React.FC = () => {
  const {
    list, isLoading, isModalOpen, setIsModalOpen,
    editForm, setEditForm, handleDelete, fetchData
  } = useMasterDataCRUD<TandaTanganData>({
    fetchApi: setupApi.getTandaTangan,
    saveApi: setupApi.saveTandaTangan,
    deleteApi: setupApi.deleteTandaTangan,
    initialForm: { jenis_formulir: 'Faktur Pajak', nama: '', jabatan: '', lokasi: '', ttd_image: null }
  });

  const sigCanvas = useRef<SignatureCanvas>(null);



  const handleAddNew = () => {
    setEditForm({
      jenis_formulir: 'Faktur Pajak',
      nama: '',
      jabatan: '',
      lokasi: '',
      ttd_image: null
    });
    setIsModalOpen(true);
    setTimeout(() => {
      if (sigCanvas.current) sigCanvas.current.clear();
    }, 100);
  };

  const handleEdit = (item: TandaTanganData) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
    setTimeout(() => {
      if (sigCanvas.current) {
        sigCanvas.current.clear();
        if (item.ttd_image) {
          // Load base64 image to canvas
          sigCanvas.current.fromDataURL(`data:image/png;base64,${item.ttd_image}`);
        }
      }
    }, 100);
  };

  const handleClearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setEditForm({ ...editForm, ttd_image: null });
  };

  const handleSimpan = async () => {
    if (!editForm.jenis_formulir || !editForm.nama) {
      toast.error('Jenis Formulir dan Tanda Tangan (Nama) harus diisi!');
      return;
    }

    let payload = { ...editForm };
    
    // Grab signature from canvas if not empty
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      payload.ttd_image = sigCanvas.current.toDataURL('image/png');
    }

    try {
      await setupApi.saveTandaTangan(payload);
      toast.success('Berhasil! Data tanda tangan telah ditambahkan.');
      setIsModalOpen(false);
      
      // Reset form
      setEditForm({
        jenis_formulir: 'Faktur Pajak',
        nama: '',
        jabatan: '',
        lokasi: '',
        ttd_image: null
      });
      if (sigCanvas.current) {
        sigCanvas.current.clear();
      }

      fetchData();
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data.');
    }
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 text-sm transition-colors rounded-sm";

  return (
    <div className="bg-white shadow-sm border border-slate-300 max-w-5xl mx-auto mt-8">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Tanda Tangan Dokumen</h2>
          <p className="text-xs text-slate-300 mt-1">Kelola nama dan digital signature untuk berbagai dokumen.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} />
          <span>TAMBAH BARU</span>
        </button>
      </div>

      <div className="p-6">


        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-700"></div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3">Jenis Formulir</th>
                  <th className="px-4 py-3">Tanda Tangan (Nama)</th>
                  <th className="px-4 py-3">Jabatan</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3 w-32 text-center">Preview TTD</th>
                  <th className="px-4 py-3 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                {list.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-center text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.jenis_formulir}</td>
                    <td className="px-4 py-3">{item.nama}</td>
                    <td className="px-4 py-3">{item.jabatan || '-'}</td>
                    <td className="px-4 py-3">{item.lokasi || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      {item.ttd_image ? (
                        <div className="h-8 border border-slate-200 bg-white rounded overflow-hidden flex justify-center items-center">
                          <img src={`data:image/png;base64,${item.ttd_image}`} alt="Signature" className="h-full object-contain" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Kosong</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="UBAH">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {list.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-500 text-sm">
                      Belum ada data setup tanda tangan. Klik "Tambah Baru" untuk memulai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20">
          <div className="bg-white rounded shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">
                {editForm.id ? 'UBAH Tanda Tangan' : 'Tambah Tanda Tangan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Formulir</label>
                  <select 
                    value={editForm.jenis_formulir} 
                    onChange={e => setEditForm({...editForm, jenis_formulir: e.target.value})}
                    className={inputClass}
                  >
                    {FORM_TYPES.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama (Penanda Tangan)</label>
                  <input 
                    type="text" 
                    value={editForm.nama} 
                    onChange={e => setEditForm({...editForm, nama: e.target.value})}
                    className={inputClass}
                    placeholder="Contoh: Vonny Kusuma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan</label>
                  <input 
                    type="text" 
                    value={editForm.jabatan} 
                    onChange={e => setEditForm({...editForm, jabatan: e.target.value})}
                    className={inputClass}
                    placeholder="Contoh: Manager Accounting"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                  <input 
                    type="text" 
                    value={editForm.lokasi} 
                    onChange={e => setEditForm({...editForm, lokasi: e.target.value})}
                    className={inputClass}
                    placeholder="Contoh: Jakarta"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Digital Signature (Opsional)</label>
                  <button 
                    onClick={handleClearSignature}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                  >
                    <Eraser size={12} /> Bersihkan TTD
                  </button>
                </div>
                <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-sm">
                  <SignatureCanvas 
                    ref={sigCanvas}
                    canvasProps={{ className: 'w-full h-40 cursor-crosshair' }}
                    backgroundColor="rgba(255,255,255,1)"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1 italic">
                  Gunakan mouse atau sentuh layar untuk membuat tanda tangan digital. Ini akan dicetak di dokumen terkait.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSimpan}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2"
              >
                <Save size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupTandaTangan;
