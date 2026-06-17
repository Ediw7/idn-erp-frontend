import React, { useState } from 'react';
import { Database, Upload, AlertCircle } from 'lucide-react';

const MigrasiData: React.FC = () => {
  // TODO: Bungkus komponen ini dengan middleware/Higher Order Component pengecekan Role === 'ADMIN'.
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="w-full h-full rounded-none flex flex-col bg-slate-100">
      {/* Header Banner Gelap */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex flex-col justify-center shrink-0">
        <h1 className="text-2xl font-bold text-white tracking-wide">Migrasi Data</h1>
        <p className="text-sm text-slate-300 mt-1">Impor dan sinkronisasi data dari sistem legacy</p>
      </div>

      {/* Content Area */}
      <div className="bg-white w-full h-[calc(100vh-100px)] overflow-y-auto p-8">
        <div className="max-w-2xl space-y-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-sm flex items-start gap-3">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Instruksi Migrasi</h4>
              <p className="text-sm text-amber-800 mt-1">
                Gunakan fitur ini untuk melakukan migrasi dari database sistem lama (mis. file .mdb / Microsoft Access) atau format CSV. Pastikan file tidak sedang dibuka oleh program lain.
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-sm p-6 bg-slate-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih File Database/CSV</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-sm cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-slate-400" />
                      <p className="mb-1 text-sm text-slate-500">
                        <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                      </p>
                      <p className="text-xs text-slate-400">.MDB, .CSV (Maks. 50MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".mdb,.csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {file && (
                <div className="p-3 bg-white border border-slate-200 rounded-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button 
                  disabled={!file}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-sm shadow-sm transition-colors flex items-center gap-2"
                >
                  <Database size={16} />
                  Mulai Migrasi Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrasiData;
