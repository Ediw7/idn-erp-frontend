import React, { useEffect, useState } from 'react';
import { setupApi, CompanyData } from '../api';

const SetupPerusahaan: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profil' | 'perpajakan'>('profil');
  const [formData, setFormData] = useState<CompanyData>({
    name: '',
    street: '',
    city: '',
    zip: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    fax: '',
    maks_pelanggan: 100,
    periode_serial: '',
    no_serial: '',
    npwp: '',
    nitku: '',
    nama_pkp: '',
    kpp: '',
    nppkp: '',
    tgl_pengukuhan: '',
    alamat_wp: '',
    kota_wp: '',
    kodepos_wp: '',
    tahun_buku_start: '1',
    tahun_buku_end: '12',
    kode_klu: '',
    wajib_ppnbm: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const data = await setupApi.getPerusahaan();
        setFormData({
          name: data.name || '',
          street: data.street || '',
          city: data.city || '',
          zip: data.zip || '',
          phone: data.phone || '',
          mobile: data.mobile || '',
          email: data.email || '',
          website: data.website || '',
          fax: data.fax || '',
          maks_pelanggan: data.maks_pelanggan || 100,
          periode_serial: data.periode_serial || '',
          no_serial: data.no_serial || '',
          npwp: data.npwp || '',
          nitku: data.nitku || '',
          nama_pkp: data.nama_pkp || '',
          kpp: data.kpp || '',
          nppkp: data.nppkp || '',
          tgl_pengukuhan: data.tgl_pengukuhan || '',
          alamat_wp: data.alamat_wp || '',
          kota_wp: data.kota_wp || '',
          kodepos_wp: data.kodepos_wp || '',
          tahun_buku_start: data.tahun_buku_start || '1',
          tahun_buku_end: data.tahun_buku_end || '12',
          kode_klu: data.kode_klu || '',
          wajib_ppnbm: data.wajib_ppnbm || false,
        });
      } catch (error) {
        setMessage({ text: 'Gagal memuat data perusahaan dari server.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await setupApi.updatePerusahaan(formData);
      setMessage({ text: response.message || 'Data berhasil disimpan!', type: 'success' });
      
      // Auto-hide message after 1.5 seconds
      setTimeout(() => {
        setMessage(null);
      }, 1500);
    } catch (error) {
      setMessage({ text: 'Terjadi kesalahan saat menyimpan data.', type: 'error' });
      setTimeout(() => setMessage(null), 1500);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div></div>;
  }

  const inputClass = "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 text-sm transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1";

  return (
    <div className="bg-white shadow-sm border border-slate-300">
      {/* Header Form */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Perusahaan</h2>
          <p className="text-xs text-slate-300 mt-1">Konfigurasi identitas utama dan legalitas perpajakan perusahaan (NPWP & NITKU).</p>
        </div>
      </div>

      <div className="p-6">
        {message && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/20 backdrop-blur-sm transition-opacity">
            <div className={`p-6 rounded-md shadow-xl border-t-4 max-w-sm w-full mx-4 transform transition-all scale-100 bg-white ${message.type === 'success' ? 'border-emerald-500' : 'border-red-500'}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${message.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {message.type === 'success' ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {message.type === 'success' ? 'Berhasil' : 'Peringatan'}
                </h3>
                <p className="text-sm mt-2 text-slate-500 font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button 
            onClick={() => setActiveTab('profil')}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === 'profil' ? 'text-slate-800 border-b-2 border-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Profil
          </button>
          <button 
            onClick={() => setActiveTab('perpajakan')}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${activeTab === 'perpajakan' ? 'text-slate-800 border-b-2 border-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Perpajakan
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'profil' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {/* Kolom Kiri */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nama Perusahaan <span className="text-red-600">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="PT. IDN ERP System" />
                </div>
                <div>
                  <label className={labelClass}>Alamat Perusahaan</label>
                  <textarea name="street" value={formData.street} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Jl. Jend. Sudirman Kav. 88" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Kota</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Jakarta Selatan" />
                  </div>
                  <div>
                    <label className={labelClass}>Kode Pos</label>
                    <input type="text" name="zip" value={formData.zip} onChange={handleChange} className={inputClass} placeholder="12720" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>No. Telepon</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="021-68666462" />
                  </div>
                  <div>
                    <label className={labelClass}>No. HP</label>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>No. Fax</label>
                  <input type="text" name="fax" value={formData.fax} onChange={handleChange} className={inputClass} placeholder="021-68666462" />
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Web Site</label>
                  <input type="text" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="www.idnerp.com" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="admin@idnerp.com" />
                </div>
                
                <div className="pt-4 mt-2 border-t border-slate-100 space-y-4">
                  <div className="w-1/2">
                    <label className={labelClass}>Maks. Jlh Pelanggan</label>
                    <input type="number" name="maks_pelanggan" value={formData.maks_pelanggan} onChange={handleChange} className={inputClass} />
                  </div>
                  <div className="w-1/2">
                    <label className={labelClass}>Periode Serial</label>
                    <input type="text" name="periode_serial" value={formData.periode_serial} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>No. Serial</label>
                    <input type="text" name="no_serial" value={formData.no_serial} onChange={handleChange} className={`${inputClass} font-mono`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perpajakan' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Nama PKP</label>
                  <input type="text" name="nama_pkp" value={formData.nama_pkp} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>KPP</label>
                  <input type="text" name="kpp" value={formData.kpp} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>NPWP</label>
                  <input type="text" name="npwp" value={formData.npwp} onChange={handleChange} className={`${inputClass} font-mono`} />
                </div>
                <div>
                  <label className={labelClass}>NPPKP</label>
                  <input type="text" name="nppkp" value={formData.nppkp} onChange={handleChange} className={`${inputClass} font-mono`} />
                </div>
                <div>
                  <label className={labelClass}>Tgl Pengukuhan</label>
                  <input type="date" name="tgl_pengukuhan" value={formData.tgl_pengukuhan} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>NITKU (22 Digit) - Opsional</label>
                  <input type="text" name="nitku" value={formData.nitku} onChange={handleChange} maxLength={22} className={`${inputClass} font-mono`} />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Alamat Wajib Pajak</label>
                  <textarea name="alamat_wp" value={formData.alamat_wp} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Kota</label>
                    <input type="text" name="kota_wp" value={formData.kota_wp} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Kode Pos</label>
                    <input type="text" name="kodepos_wp" value={formData.kodepos_wp} onChange={handleChange} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Tahun Buku</label>
                  <div className="flex items-center gap-3">
                    <select name="tahun_buku_start" value={formData.tahun_buku_start} onChange={handleChange} className={inputClass}>
                      {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                    <span className="text-sm font-semibold text-slate-700">s/d</span>
                    <select name="tahun_buku_end" value={formData.tahun_buku_end} onChange={handleChange} className={inputClass}>
                      {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Kode KLU</label>
                  <input type="text" name="kode_klu" value={formData.kode_klu} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="wajib_ppnbm" name="wajib_ppnbm" checked={formData.wajib_ppnbm} onChange={handleChange} className="w-4 h-4 text-slate-800 border-slate-300 rounded focus:ring-slate-500" />
                  <label htmlFor="wajib_ppnbm" className="text-sm font-semibold text-slate-700">Wajib PPnBM</label>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 mt-8 border-t border-slate-200 flex justify-end gap-3">
            <button 
              type="button" 
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 hover:bg-slate-200 transition-colors"
            >
              BATAL
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 border border-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? 'MENYIMPAN...' : 'SIMPAN PENGATURAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupPerusahaan;
