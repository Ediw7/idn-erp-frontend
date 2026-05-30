import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const location = useLocation();

  // Menu List mirroring Krishand Invoicing
  const menuItems = [
    { label: 'Saldo Awal Piutang', path: '/saldo-awal-piutang' },
    { label: 'Sales Order', path: '/sales-order' },
    { label: 'Surat Jalan', path: '/surat-jalan' },
    { label: 'Invoice', path: '/invoice' },
    { label: 'Cek History Harga Jual', path: '/history-harga' },
    { label: 'Kwitansi', path: '/kwitansi' },
    { label: 'Pembayaran Invoice', path: '/pembayaran' },
    { label: 'Nota Kredit', path: '/nota-kredit' },
    { label: 'PPN', path: '/ppn' },
    { label: 'Inventory', path: '/inventory' },
    { label: 'Kartu Piutang', path: '/kartu-piutang' },
    { label: 'Laporan', path: '/laporan' },
    { label: 'Pemeliharaan Sistem', path: '/pemeliharaan' },
  ];

  // Submenus for Setup Awal
  const setupItems = [
    { label: 'Setup Perusahaan', path: '/setup/perusahaan' },
    { label: 'Setup Preferensi', path: '/setup/preferensi' },
    { label: 'Setup Perkiraan', path: '/setup/perkiraan' },
    { label: 'Setup Mata Uang', path: '/setup/mata-uang' },
    { label: 'Setup Kurs Pajak', path: '/setup/kurs-pajak' },
    { label: 'Setup Tanda Tangan', path: '/setup/tanda-tangan' },
    { label: 'Setup Gudang', path: '/setup/gudang' },
    { label: 'Setup Item', path: '/setup/item' },
    { label: 'Setup Cara Pembayaran', path: '/setup/pembayaran' },
    { label: 'Setup Pelanggan', path: '/setup/pelanggan' },
    { label: 'Setup Proyek', path: '/setup/proyek' },
    { label: 'Setup Salesman', path: '/setup/salesman' },
    { label: 'Setup Nomor Seri Faktur Pajak', path: '/setup/faktur-pajak' },
  ];

  // Check if current route starts with a specific path to highlight active state
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar - Corporate Slate Theme */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-md z-10 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700 bg-slate-950 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 border border-slate-600 text-white flex items-center justify-center font-bold text-lg">IE</div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">IDN ERP</h1>
            <p className="text-xs text-blue-300">Invoicing Modern ERP</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1">
            {/* Setup Awal - Dropdown Menu */}
            <li>
              <button 
                onClick={() => setIsSetupOpen(!isSetupOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-800 hover:text-white transition-colors ${isActive('/setup') ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent'}`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span>Setup Awal</span>
                </div>
                <svg className={`w-3 h-3 transition-transform duration-200 ${isSetupOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Animated Expandable Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSetupOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="bg-slate-950 py-1">
                  {setupItems.map((item, idx) => (
                    <li key={idx}>
                      <Link 
                        to={item.path}
                        className={`block px-10 py-1.5 text-[13px] transition-colors ${location.pathname === item.path ? 'text-white font-medium bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* General Menu Items */}
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <Link 
                  to={item.path}
                  className={`block px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${location.pathname === item.path ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f4f6f8]">
        {/* Top Header */}
        <header className="h-14 bg-white shadow-sm border-b px-6 flex items-center justify-between z-0">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">Administrator</p>
              <p className="text-[11px] text-slate-500">PT. IDN ERP System</p>
            </div>
            <div className="w-8 h-8 bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-300">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content injected by React Router Outlet */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
