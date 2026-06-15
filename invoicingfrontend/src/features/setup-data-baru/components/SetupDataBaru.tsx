import React, { useState } from 'react';
import { X, Save, FolderOpen, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SetupDataBaru: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    namaPerusahaan: 'PT. EDI ACCOUNTING',
    alamatPerusahaan: '',
    npwp: '',
    kota: '',
    noTelepon: '',
    noFax: '',
    maksPelanggan: '',
    periodeSerial: '',
    noSerial: '',
    folderData: 'C:\\krishand\\invc\\601\\',
    tahunPembukuan: '2026' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast.success('Setup Data Baru telah disimpan!');
    navigate(-1);
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm transition-shadow";
  const labelClass = "text-sm font-semibold text-slate-700 w-48 shrink-0 pt-2";

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Modern Top Header Banner */}
      <div className="bg-slate-800 px-6 py-5 flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">Setup Data Baru</h1>
          <p className="text-slate-400 text-sm mt-1">Konfigurasi awal profil perusahaan dan alokasi database sistem.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold text-white transition-colors"
          >
            <X size={14} /> BATAL </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-600 rounded-sm text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Save size={14} /> OK
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div className="w-full max-w-3xl">
          
          {/* Warning Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-md shadow-sm flex items-start gap-3">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              Proses Setup Data Baru hanya diperlukan dengan syarat Anda ingin menginput data bukan dimulai dari tahun 2020 dan proses ini hanya boleh dijalankan sekali saja.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200 rounded-md shadow-sm p-6 flex flex-col gap-4">
            
            <div className="flex items-start gap-4">
              <label className={labelClass}>Nama Perusahaan</label>
              <input 
                type="text" 
                name="namaPerusahaan"
                value={formData.namaPerusahaan}
                onChange={handleChange}
                className={inputClass} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>Alamat Perusahaan</label>
              <textarea 
                name="alamatPerusahaan"
                value={formData.alamatPerusahaan}
                onChange={handleChange}
                rows={2}
                className={`${inputClass} resize-none`} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>NPWP</label>
              <input 
                type="text" 
                name="npwp"
                value={formData.npwp}
                onChange={handleChange}
                className={`${inputClass} max-w-xs`} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>Kota</label>
              <input 
                type="text" 
                name="kota"
                value={formData.kota}
                onChange={handleChange}
                className={`${inputClass} max-w-xs`} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>No. Telepon</label>
              <input 
                type="text" 
                name="noTelepon"
                value={formData.noTelepon}
                onChange={handleChange}
                className={`${inputClass} max-w-xs`} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>No Fax</label>
              <input 
                type="text" 
                name="noFax"
                value={formData.noFax}
                onChange={handleChange}
                className={`${inputClass} max-w-xs`} 
              />
            </div>

            <div className="w-full h-px bg-slate-100 my-2"></div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>Maks. Jlh Pelanggan</label>
              <input 
                type="text" 
                name="maksPelanggan"
                value={formData.maksPelanggan}
                onChange={handleChange}
                className={`${inputClass} w-24`} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>Periode Serial</label>
              <input 
                type="text" 
                name="periodeSerial"
                value={formData.periodeSerial}
                onChange={handleChange}
                className={`${inputClass} max-w-xs`} 
              />
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>No. Serial</label>
              <input 
                type="text" 
                name="noSerial"
                value={formData.noSerial}
                onChange={handleChange}
                className={`${inputClass} max-w-xs`} 
              />
            </div>

            <div className="w-full h-px bg-slate-100 my-2"></div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>Folder Data</label>
              <div className="flex-1 flex items-center gap-2 max-w-lg">
                <input 
                  type="text" 
                  name="folderData"
                  value={formData.folderData}
                  onChange={handleChange}
                  className={`${inputClass} font-mono text-xs`} 
                />
                <button className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-sm text-slate-700 transition-colors shrink-0 flex items-center gap-1.5">
                  <FolderOpen size={14} />
                  <span className="text-xs font-semibold">Browse...</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <label className={labelClass}>Tahun Pembukuan</label>
              <input 
                type="text" 
                name="tahunPembukuan"
                value={formData.tahunPembukuan}
                onChange={handleChange}
                className={`${inputClass} w-24 font-semibold text-center`} 
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupDataBaru;
