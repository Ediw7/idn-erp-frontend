import React from "react";
import { useNavigate } from "react-router-dom";

const MainDashboard: React.FC = () => {
  const navigate = useNavigate();
  // Get current date formatted
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Welcome Banner */}
      <div className="bg-slate-800 px-8 py-10 shrink-0 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-2">
            Selamat Datang di EDI Accounting
          </h1>
          <p className="text-slate-300 text-sm font-medium">
            Dashboard Utama Invoicing & Penjualan • {today}
          </p>
        </div>
      </div>

      <div className="p-8 -mt-8 relative z-20 max-w-7xl mx-auto w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Piutang
            </p>
            <h3 className="text-2xl font-black text-slate-800">Rp 0.00</h3>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Invoice Bulan Ini
            </p>
            <h3 className="text-2xl font-black text-slate-800">0</h3>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Outstanding
            </p>
            <h3 className="text-2xl font-black text-slate-800">0</h3>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Total Pelanggan
            </p>
            <h3 className="text-2xl font-black text-slate-800">0</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
              Aksi Cepat
            </h2>

            <button
              onClick={() => navigate("/invoice")}
              className="w-full bg-white p-4 rounded-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-left flex flex-col"
            >
              <h4 className="font-bold text-slate-800 text-sm">
                Buat Invoice Baru
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Catat transaksi penjualan
              </p>
            </button>

            <button
              onClick={() => navigate("/pembayaran-invoice")}
              className="w-full bg-white p-4 rounded-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-left flex flex-col"
            >
              <h4 className="font-bold text-slate-800 text-sm">
                Terima Pembayaran
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Catat pelunasan piutang
              </p>
            </button>

            <button
              onClick={() => navigate("/outstanding-invoice")}
              className="w-full bg-white p-4 rounded-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-left flex flex-col"
            >
              <h4 className="font-bold text-slate-800 text-sm">
                Cek Outstanding
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Lihat tagihan belum lunas
              </p>
            </button>

            <button
              onClick={() => navigate("/rangkuman-penjualan")}
              className="w-full bg-white p-4 rounded-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-left flex flex-col"
            >
              <h4 className="font-bold text-slate-800 text-sm">
                Rangkuman Penjualan
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Lihat laporan statistik
              </p>
            </button>
          </div>

          {/* Recent Activity Table */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
              Aktivitas Terakhir
            </h2>
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                <h3 className="text-xs font-bold text-slate-700 uppercase">
                  Dokumen Terbaru
                </h3>
                <button
                  onClick={() => navigate("/invoice")}
                  className="text-xs font-bold text-slate-600 hover:text-slate-800"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center bg-white">
                <h3 className="text-slate-800 font-bold mb-1">
                  Belum Ada Aktivitas
                </h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Sistem sedang menunggu data transaksi baru. Mulai buat invoice
                  atau surat jalan melalui menu navigasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
