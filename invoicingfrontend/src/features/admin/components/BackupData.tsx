import React, { useState, useEffect } from 'react';
import { DatabaseBackup, Download, Clock, Info, CheckCircle2, History } from 'lucide-react';
import toast from 'react-hot-toast';

interface BackupHistory {
  id: string;
  date: string;
  size: string;
  createdBy: string;
  status: 'success' | 'failed';
}

const BackupData: React.FC = () => {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [history, setHistory] = useState<BackupHistory[]>([]);

  useEffect(() => {
    // Simulasi memuat riwayat backup
    setHistory([
      { id: '1', date: '2026-06-16 17:30:00', size: '15.2 MB', createdBy: 'Admin', status: 'success' },
      { id: '2', date: '2026-06-15 17:30:00', size: '14.8 MB', createdBy: 'Admin', status: 'success' },
      { id: '3', date: '2026-06-14 17:30:00', size: '14.5 MB', createdBy: 'System Auto', status: 'success' },
    ]);
  }, []);

  const handleBackup = async () => {
    setIsBackingUp(true);
    const toastId = toast.loading('Sedang men-generate file backup database...');

    try {
      /* =========================================================================
         LOGIKA MENGUNDUH FILE BLOB (FILE STREAM) DARI BACKEND DI APLIKASI WEB
         =========================================================================
         Karena ini aplikasi berbasis Web, kita tidak bisa langsung memaksa 
         browser untuk menyimpan file ke "D:/folder" secara spesifik tanpa prompt. 
         
         Backend harus mengembalikan file (misal: .sql atau .zip) sebagai response 
         binary (blob). Frontend menerimanya, lalu memicu fitur "Download" bawaan
         browser (biasanya masuk ke folder "Downloads" user).
         
         Contoh Implementasi Axios yang Nyata:
         
         const response = await axiosClient.get('/api/system/backup', {
           responseType: 'blob', // WAJIB ada agar axios tahu ini file, bukan JSON
         });
         
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', `backup_idn_erp_${new Date().getTime()}.sql`);
         document.body.appendChild(link);
         link.click();
         
         // Cleanup
         link.parentNode?.removeChild(link);
         window.URL.revokeObjectURL(url);
      ========================================================================== */

      // Simulasi delay pembuatan backup file
      await new Promise(resolve => setTimeout(resolve, 2500));

      toast.success('Backup berhasil diunduh ke komputer Anda!', { id: toastId });
      
      // Tambahkan ke riwayat lokal
      const newHistory: BackupHistory = {
        id: new Date().getTime().toString(),
        date: new Date().toLocaleString('id-ID'),
        size: '15.4 MB',
        createdBy: 'Anda',
        status: 'success'
      };
      
      setHistory([newHistory, ...history]);
    } catch (err) {
      toast.error('Gagal men-generate backup.', { id: toastId });
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white font-sans text-slate-800">
      
      {/* Header Banner (Full Bleed) */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">

            Backup Data
          </h1>
          <p className="text-sm text-slate-300 mt-1">Unduh salinan database sistem untuk keamanan data</p>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto bg-gray-50 flex flex-col gap-8">
        
        {/* Area Konten Utama - Download Logic */}
        <div className="max-w-4xl bg-white border border-gray-200 shadow-sm rounded-sm p-8">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-sm flex items-start gap-4 mb-8">
            <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Mekanisme Backup Web App</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Proses backup akan menginstruksikan server backend (PostgreSQL) untuk men-generate file ekspor (SQL/ZIP) dari seluruh tabel dan skema database saat ini. Setelah siap, file tersebut akan disalurkan via internet dan <strong>otomatis terunduh langsung ke komputer Anda</strong> layaknya mengunduh file biasa. Simpan file tersebut di lokasi yang aman.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-sm bg-gray-50">
            <DatabaseBackup className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-lg font-bold text-gray-700 mb-2">Siap untuk Backup Database?</h2>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
              Pastikan tidak ada transaksi besar yang sedang berjalan di sistem sebelum melakukan backup manual untuk meminimalisir data yang terlewat.
            </p>
            
            <button 
              onClick={handleBackup}
              disabled={isBackingUp}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md shadow-sm flex items-center gap-3 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isBackingUp ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Men-generate File...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Generate & Unduh Backup ( .SQL )
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabel Riwayat Backup (Opsional) */}
        <div className="max-w-4xl bg-white border border-gray-200 shadow-sm rounded-sm p-0 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h3 className="text-base font-bold text-gray-800">Riwayat Backup Terakhir</h3>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-600 font-semibold border-b border-gray-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12 text-center">No</th>
                <th className="px-6 py-4">Waktu Backup</th>
                <th className="px-6 py-4">Ukuran File</th>
                <th className="px-6 py-4">Dibuat Oleh</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 italic">Belum ada riwayat backup tercatat.</td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-3.5 text-center text-gray-500">{idx + 1}</td>
                    <td className="px-6 py-3.5 font-medium text-gray-800 flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" /> {item.date}
                    </td>
                    <td className="px-6 py-3.5 text-gray-600">{item.size}</td>
                    <td className="px-6 py-3.5 text-gray-600">{item.createdBy}</td>
                    <td className="px-6 py-3.5 text-center">
                      {item.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          <CheckCircle2 size={12} /> Sukses
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                          Gagal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default BackupData;
