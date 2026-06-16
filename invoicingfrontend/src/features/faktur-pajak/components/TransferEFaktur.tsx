import React, { useState, useMemo } from 'react';
import axiosClient from '../../../lib/axiosClient';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-100 text-red-900 border border-red-500 rounded">
          <h1 className="text-2xl font-bold">Terjadi Kesalahan Runtime!</h1>
          <pre className="mt-4 p-4 bg-white border border-red-200 overflow-auto">
            {this.state.error?.toString()}
            <br />
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const TransferEFakturForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const currentYear = new Date().getFullYear();
  
  const [form, setForm] = useState({
    jenis_pajak: 'Pajak Keluaran',
    tahun: currentYear,
    bulan: '01',
    pembetulan: 0,
    fp_awal: '',
    fp_akhir: ''
  });

  const bulanOptions = [
    { v: '01', l: 'Januari' }, { v: '02', l: 'Februari' }, { v: '03', l: 'Maret' }, { v: '04', l: 'April' },
    { v: '05', l: 'Mei' }, { v: '06', l: 'Juni' }, { v: '07', l: 'Juli' }, { v: '08', l: 'Agustus' },
    { v: '09', l: 'September' }, { v: '10', l: 'Oktober' }, { v: '11', l: 'November' }, { v: '12', l: 'Desember' }
  ];

  const jenisPajakOptions = [
    'Pajak Keluaran',
    'Pajak Masukan',
    'Retur Pajak Keluaran',
    'Retur Pajak Masukan'
  ];

  // Auto-generate file name based on current form state
  const outputFileName = useMemo(() => {
    const formattedJenis = form.jenis_pajak.replace(/\s+/g, '_');
    return `${formattedJenis}_${form.tahun}${form.bulan}.csv`;
  }, [form.jenis_pajak, form.tahun, form.bulan]);

  const handleExport = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Memproses ekspor file CSV...');

    try {
      const response = await axiosClient.get('/api/export-efaktur', {
        params: {
          jenis_pajak: form.jenis_pajak,
          tahun: form.tahun,
          bulan: form.bulan,
          pembetulan: form.pembetulan,
          fp_awal: form.fp_awal,
          fp_akhir: form.fp_akhir
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      let downloadFileName = outputFileName;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          downloadFileName = matches[1].replace(/['"]/g, '');
        }
      }

      link.setAttribute('download', downloadFileName);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File e-Faktur berhasil diekspor', { id: toastId });

    } catch (error) {
      console.error('Export Error:', error);
      toast.error('Gagal mengekspor data e-Faktur. Periksa parameter Anda.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatal = () => {
    setForm({
      jenis_pajak: 'Pajak Keluaran',
      tahun: currentYear,
      bulan: '01',
      pembetulan: 0,
      fp_awal: '',
      fp_akhir: ''
    });
  };

  const inputClass = "w-full px-3 py-2 border border-slate-300 bg-white rounded-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50";

  return (
    <div className="w-full h-full bg-white rounded-none flex flex-col shadow-sm border border-slate-300">
        
        {/* 2. Header Banner Gelap (Full Width) */}
        <div className="p-6 bg-slate-900 w-full rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Transfer ke Program e-Faktur</h2>
            <p className="text-sm text-slate-300 mt-1">Ekspor data faktur pajak ke format CSV (Skema Impor e-Faktur DJP)</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBatal} 
              disabled={isLoading}
              className="px-5 py-2 bg-transparent border border-slate-600 rounded-sm text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleExport} 
              disabled={isLoading}
              className="px-5 py-2 bg-blue-600 border border-blue-700 rounded-sm text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Proses Ekspor
            </button>
          </div>
        </div>

        {/* 3. Body Form Area (Putih Bersih) */}
        <div className="p-6 bg-white space-y-4">
          
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">Jenis Pajak</label>
            <div className="col-span-9">
              <select 
                className={`${inputClass} w-full md:w-1/2 lg:w-1/3`} 
                value={form.jenis_pajak} 
                onChange={e => setForm({...form, jenis_pajak: e.target.value})}
                disabled={isLoading}
              >
                {jenisPajakOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">Tahun</label>
            <div className="col-span-9">
              <input 
                type="number" 
                className={`${inputClass} w-full md:w-1/3 lg:w-1/4`} 
                value={form.tahun} 
                onChange={e => setForm({...form, tahun: Number(e.target.value)})}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">Bulan</label>
            <div className="col-span-9">
              <select 
                className={`${inputClass} w-full md:w-1/3 lg:w-1/4`} 
                value={form.bulan} 
                onChange={e => setForm({...form, bulan: e.target.value})}
                disabled={isLoading}
              >
                {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">Pembetulan</label>
            <div className="col-span-9">
              <input 
                type="number" 
                className={`${inputClass} w-full md:w-1/4 lg:w-1/5`} 
                value={form.pembetulan} 
                onChange={e => setForm({...form, pembetulan: Number(e.target.value)})}
                disabled={isLoading}
                min={0}
              />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-4"></div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">No FP Awal</label>
            <div className="col-span-9">
              <input 
                type="text" 
                className={`${inputClass} font-mono w-full md:w-1/2 lg:w-1/3`} 
                value={form.fp_awal} 
                onChange={e => setForm({...form, fp_awal: e.target.value})}
                placeholder="13 digit terakhir"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">No FP Akhir</label>
            <div className="col-span-9">
              <input 
                type="text" 
                className={`${inputClass} font-mono w-full md:w-1/2 lg:w-1/3`} 
                value={form.fp_akhir} 
                onChange={e => setForm({...form, fp_akhir: e.target.value})}
                placeholder="13 digit terakhir"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-4"></div>

          {/* Generated File Output Name (Read-Only) */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className="col-span-3 text-sm font-medium text-gray-700">Nama File Output</label>
            <div className="col-span-9">
              <input 
                type="text" 
                readOnly
                className="w-full md:w-2/3 lg:w-1/2 px-3 py-2 border border-slate-200 bg-gray-50 text-gray-500 rounded-sm text-sm font-semibold focus:outline-none font-mono"
                value={outputFileName}
              />
            </div>
          </div>

        </div>

      </div>
  );
};

const TransferEFaktur: React.FC = () => {
  return (
    <ErrorBoundary>
      <TransferEFakturForm />
    </ErrorBoundary>
  );
};

export default TransferEFaktur;
