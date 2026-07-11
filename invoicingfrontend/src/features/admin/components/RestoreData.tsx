import React, { useRef, useState } from "react";
import {
  UploadCloud,
  AlertTriangle,
  FileUp,
  X,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../../../contexts/ConfirmContext";

const RestoreData: React.FC = () => {
  const confirm = useConfirm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validasi sederhana (opsional)
      if (!file.name.endsWith(".sql") && !file.name.endsWith(".zip")) {
        toast.error(
          "Format file tidak didukung! Harap unggah file .sql atau .zip.",
        );
        return;
      }
      setSelectedFile(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRestore = async () => {
    if (!selectedFile) return;

    // KONFIRMASI GANDA: Aksi ini sangat berbahaya
    const isConfirmed = await confirm(
      "PERINGATAN FINAL!\n\n" +
        "Apakah Anda benar-benar yakin ingin menimpa database saat ini dengan file backup yang diunggah?\n" +
        "Seluruh transaksi yang terjadi setelah waktu backup ini akan HILANG SELAMANYA.\n" +
        "Aksi ini SANGAT FATAL dan TIDAK DAPAT DIBATALKAN.",
    );

    if (!isConfirmed) return;

    setIsRestoring(true);
    setRestoreProgress(10);

    try {
      /* =========================================================================
         LOGIKA MENGUNGGAH FILE (FORM DATA) KE BACKEND DI APLIKASI WEB
         =========================================================================
         Aplikasi Web menggunakan FormData untuk mengirim objek File ke backend.
         
         Contoh Implementasi Axios yang Nyata:
         
         const formData = new FormData();
         formData.append('backup_file', selectedFile);
         
         const response = await axiosClient.post('/api/system/restore', formData, {
           headers: { 'Content-Type': 'multipart/form-data' },
           onUploadProgress: (progressEvent) => {
             const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
             setRestoreProgress(percentCompleted);
           }
         });
      ========================================================================== */

      // Simulasi progress
      const interval = setInterval(() => {
        setRestoreProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 15;
        });
      }, 500);

      // Simulasi delay pemulihan sistem backend
      await new Promise((resolve) => setTimeout(resolve, 3500));

      clearInterval(interval);
      setRestoreProgress(100);

      toast.success("Database berhasil dipulihkan dari file backup!");
      setSelectedFile(null);

      setTimeout(() => {
        toast.success(
          "Sistem akan di-restart dan memutus koneksi semua pengguna (logout paksa) untuk menerapkan perubahan. Harap login kembali.",
          { duration: 5000 },
        );
        setTimeout(() => window.location.reload(), 2000);
      }, 1000);
    } catch (err) {
      toast.error("Gagal melakukan restore data. Hubungi tim teknis.");
    } finally {
      setIsRestoring(false);
      setRestoreProgress(0);
    }
  };

  // Helper untuk format ukuran file
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="flex flex-col w-full h-full bg-white font-sans text-slate-800">
      {/* Header Banner (Full Bleed) */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
            Restore Data
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Pulihkan database sistem dari file salinan backup
          </p>
        </div>
      </div>

      <div className="p-8 flex-1 overflow-y-auto bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          {/* Critical Warning Alert */}
          <div className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-md shadow-sm mb-8 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-red-800 mb-1">
                PERINGATAN KRITIKAL
              </h3>
              <p className="text-sm text-red-700 leading-relaxed font-medium">
                Melakukan Restore akan <strong>MENGHAPUS dan MENIMPA</strong>{" "}
                seluruh data sistem saat ini dengan data dari file backup.
                Pastikan file yang Anda unggah benar dan valid. Tindakan ini{" "}
                <u>tidak dapat dibatalkan</u> dan pengguna lain akan ter-logout
                otomatis!
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-10">
            <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Unggah File Backup
            </h2>

            {/* Hidden Input File */}
            <input
              type="file"
              accept=".sql,.zip"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isRestoring}
            />

            {!selectedFile ? (
              /* State 1: Kosong - Area Drag & Drop */
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-400 p-12 text-center rounded-lg cursor-pointer transition-colors group"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-base font-bold text-gray-700 mb-2">
                  Klik atau Drag & Drop file backup di sini
                </h3>
                <p className="text-sm text-gray-500">
                  Mendukung format file terkompresi .sql atau .zip
                </p>
              </div>
            ) : (
              /* State 2: File Dipilih - Tampilkan Detail File */
              <div className="border border-green-200 bg-green-50 p-6 rounded-lg text-center relative transition-all">
                {!isRestoring && (
                  <button
                    onClick={removeFile}
                    className="absolute top-4 right-4 p-1.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shadow-sm"
                    title="Hapus file"
                  >
                    <X size={16} />
                  </button>
                )}

                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-green-100">
                  <FileUp className="w-8 h-8 text-green-600" />
                </div>

                <h3
                  className="text-base font-bold text-green-800 mb-1 line-clamp-1"
                  title={selectedFile.name}
                >
                  {selectedFile.name}
                </h3>
                <p className="text-sm text-green-600 font-semibold mb-8">
                  Ukuran: {formatBytes(selectedFile.size)}
                </p>

                {isRestoring ? (
                  <div className="w-full max-w-sm mx-auto">
                    <div className="flex justify-between items-center mb-2 text-sm font-semibold text-green-800">
                      <span>Memulihkan Sistem...</span>
                      <span>{restoreProgress}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3 mb-2 overflow-hidden">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${restoreProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      Mohon tunggu, jangan tutup halaman ini.
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleRestore}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md shadow-lg shadow-red-600/30 flex items-center gap-2 mx-auto transition-colors animate-pulse hover:animate-none"
                  >
                    <AlertTriangle size={18} />
                    MULAI RESTORE DATABASE
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" /> Standar
                Keamanan Restore Web:
              </h4>
              <ul className="text-xs text-gray-500 space-y-2 list-disc list-inside ml-1">
                <li>
                  Sistem hanya menerima file enkripsi terkompresi dari panel
                  Backup resmi aplikasi ini.
                </li>
                <li>
                  Semua sesi pengguna lain akan dihentikan paksa (force logout)
                  saat proses berjalan.
                </li>
                <li>
                  Koneksi backend akan di-*restart* secara instan setelah file
                  sukses terurai di dalam server.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoreData;
