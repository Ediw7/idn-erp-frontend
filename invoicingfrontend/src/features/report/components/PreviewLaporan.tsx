import React, { useEffect, useState } from 'react';
import { setupApi } from '../../setup/api';
// Sesuaikan import useAuth dengan state management yang digunakan (Redux/Context)
// import { useAuth } from '../../../hooks/useAuth'; 

// Mock useAuth untuk keperluan demonstrasi
const useAuth = () => {
  // Dalam production, ini akan mengambil session user yang sedang login
  return { user: { name: 'Edi Wicoro', role: 'Staff Finance' } }; 
};

interface CompanyProfile {
  managerName?: string;
  namaPencetak?: string;
  [key: string]: any;
}

const PreviewLaporan: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<CompanyProfile>({});

  useEffect(() => {
    // Menarik data profil perusahaan (opsional, jika ingin mengambil nama Manager)
    const fetchCompanyData = async () => {
      try {
        const preferensi = await setupApi.getPreferensi();
        setCompany({
          managerName: preferensi.namaPencetak || ''
        });
      } catch (error) {
        console.error('Gagal mengambil data perusahaan', error);
      }
    };
    fetchCompanyData();
  }, []);

  return (
    <div className="w-full h-full bg-slate-100 p-8 flex justify-center overflow-y-auto">
      {/* Kertas A4 Preview */}
      <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg p-12 flex flex-col">
        
        {/* Header Dokumen (Dummy) */}
        <div className="border-b-2 border-slate-800 pb-4 mb-8 text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Surat Jalan / Laporan</h1>
          <p className="text-sm text-slate-500">PT. IDN ERP Nusantara</p>
        </div>

        {/* Konten Laporan (Isi Tabel dsb diletakkan di sini) */}
        <div className="flex-1">
          <div className="w-full h-64 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-semibold mb-8 rounded-sm">
            [ Area Konten Tabel Laporan ]
          </div>
        </div>

        {/* 
          =========================================
          REVISI: SIGNATURE BLOCK (TANDA TANGAN) 
          ========================================= 
        */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex justify-between items-start text-sm text-slate-800">
            
            {/* Sisi Kiri: Dibuat Oleh (Dinamis sesuai User Login) */}
            <div className="flex flex-col items-center w-48 text-center">
              <span className="font-semibold mb-2">Dibuat Oleh,</span>
              
              {/* Spacing luas untuk tanda tangan basah & stempel */}
              <div className="mt-24 w-full">
                {/* Nama ditarik dari useAuth() dengan optional chaining */}
                <p className="font-bold underline underline-offset-4 decoration-slate-400">
                  {user?.name || 'User Tidak Dikenal'}
                </p>
                <p className="text-xs text-slate-500 mt-1">{user?.role || 'Staff'}</p>
              </div>
            </div>

            {/* Sisi Kanan: Disetujui Oleh (Dinamis dari API atau Garis Kosong) */}
            <div className="flex flex-col items-center w-48 text-center">
              <span className="font-semibold mb-2">Disetujui Oleh,</span>
              
              {/* Spacing luas untuk tanda tangan basah & stempel */}
              <div className="mt-24 w-full">
                {company.managerName ? (
                  <>
                    <p className="font-bold underline underline-offset-4 decoration-slate-400">
                      {company.managerName}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Manager</p>
                  </>
                ) : (
                  // Garis kosong jika data manager tidak tersedia di API
                  <div className="w-full border-b border-slate-800 pt-5"></div>
                )}
              </div>
            </div>

          </div>
        </div>
        {/* ========================================= */}

      </div>
    </div>
  );
};

export default PreviewLaporan;
