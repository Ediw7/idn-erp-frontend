import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/contexts/AuthContext';
import { LogOut } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isPpnOpen, setIsPpnOpen] = useState(false);
  const [isPemeliharaanOpen, setIsPemeliharaanOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu List mirroring EDI Accounting System
  const menuItemsTop = [
    { label: 'Saldo Awal Piutang', path: '/saldo-awal-piutang' },
    { label: 'Sales Order', path: '/sales-order' },
    { label: 'Surat Jalan', path: '/surat-jalan' },
    { label: 'Invoice', path: '/invoice' },
    { label: 'Cek History Harga Jual', path: '/history-harga' },
    { label: 'Kwitansi', path: '/kwitansi' },
    { label: 'Pembayaran Invoice', path: '/pembayaran' },
    { label: 'Nota Kredit', path: '/nota-kredit' },
  ];

  const menuItemsBottom = [
    { label: 'Kartu Piutang', path: '/kartu-piutang' },
    { label: 'Daftar Outstanding Invoice', path: '/outstanding-invoice' },
    { label: 'Rangkuman Data Penjualan', path: '/rangkuman-penjualan' },
    { label: 'Laporan', path: '/laporan' },
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
    { label: 'Setup Group Barang', path: '/setup/group-barang' },
    { label: 'Setup Item', path: '/setup/item' },
    { label: 'Setup Cara Pembayaran', path: '/setup/pembayaran' },
    { label: 'Setup Pelanggan', path: '/setup/pelanggan' },
    { label: 'Setup Supplier', path: '/setup/supplier' },
    { label: 'Setup Proyek', path: '/setup/proyek' },
    { label: 'Setup Salesman', path: '/setup/salesman' },
    { label: 'Setup Nomor Seri Faktur Pajak', path: '/setup/faktur-pajak' },
    { label: 'Setup Jenis Potongan', path: '/setup/jenis-potongan' },
    { label: 'Setup Format No Bukti', path: '/setup/format-bukti' },
    { label: 'Setup Kode Jenis Pajak', path: '/setup/jenis-pajak' },
    { label: 'Setup Kode Jenis Setoran', path: '/setup/jenis-setoran' },
    { label: 'Setup Bahasa', path: '/setup/bahasa' },
  ];

  // Submenus for Inventory
  const inventoryItems = [
    { label: 'Daftar Gudang', path: '/inventory/gudang' },
    { label: 'Daftar Barang', path: '/inventory/barang' },
    { label: 'Saldo Awal Inventory', path: '/inventory/saldo-awal' },
    { label: 'Penerimaan Barang', path: '/inventory/penerimaan' },
    { label: 'Surat Jalan', path: '/surat-jalan' },
    { label: 'Nota Retur Penjualan', path: '/inventory/retur-penjualan' },
    { label: 'Nota Retur Pembelian', path: '/inventory/retur-pembelian' },
    { label: 'Adjustment Inventory', path: '/inventory/adjustment' },
    { label: 'Transfer Barang', path: '/inventory/transfer' },
    { label: 'Proses HPP Barang', path: '/inventory/proses-hpp' },
    { label: 'Kartu Stock Barang', path: '/inventory/kartu-stock' },
    { label: 'Kartu HPP Barang', path: '/inventory/kartu-hpp' },
    { label: 'Rekap Stok Barang', path: '/inventory/rekap-stok' },
  ];

  // Submenus for PPN
  const ppnItems = [
    { label: 'Faktur Pajak', path: '/faktur-pajak' },
    { label: 'Nota Retur Penjualan', path: '/ppn/retur-penjualan' },
    { label: 'Nota Retur Pembelian', path: '/ppn/retur-pembelian' },
    { label: 'SPT Masa PPN 1111', path: '/ppn/spt' },
    { label: 'Surat Setoran Pajak', path: '/ppn/ssp' },
    { label: 'Transfer ke Program e-SPT', path: '/ppn/transfer-espt' },
    { label: 'Transfer ke Program e-Faktur', path: '/ppn/transfer-efaktur' },
  ];

  const pemeliharaanItems = [
    { label: 'Migrasi Data', path: '/pemeliharaan/migrasi' },
    { label: 'Ganti Password', path: '/pemeliharaan/ganti-password' },
    { label: 'Hapus Data', path: '/pemeliharaan/hapus' },
    { label: 'Perbaikan Saldo Piutang', path: '/pemeliharaan/perbaikan-saldo' },
    { label: 'About Krishand Invoicing', path: '/pemeliharaan/about' },
  ];

  // Check if current route starts with a specific path to highlight active state
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar - Corporate Slate Theme */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-md z-10 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700 bg-slate-950 flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">EDI Accounting</h1>
            <p className="text-xs text-blue-300">Invoicing Modern Accounting</p>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto pt-4 pb-32 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link 
                to="/"
                className={`block px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${location.pathname === '/' ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:text-white'}`}
              >
                Dashboard
              </Link>
            </li>

            {/* Setup Awal - Dropdown Menu */}
            <li>
              <button 
                onClick={() => setIsSetupOpen(!isSetupOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-slate-800 hover:text-white transition-colors ${isActive('/setup') ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent'}`}
              >
                <div className="flex items-center gap-2">
                  <span>Setup Awal</span>
                </div>
                <svg className={`w-3 h-3 transition-transform duration-200 ${isSetupOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {/* Animated Expandable Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSetupOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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

            {/* Top Menu Items */}
            {menuItemsTop.map((item, idx) => (
              <li key={`top-${idx}`}>
                <Link 
                  to={item.path}
                  className={`block px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${location.pathname === item.path ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* PPN Accordion */}
            <li>
              <button 
                onClick={() => setIsPpnOpen(!isPpnOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${isPpnOpen || location.pathname.startsWith('/faktur-pajak') || location.pathname.startsWith('/ppn') ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <span>PPN</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isPpnOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPpnOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="bg-slate-950 py-2">
                  {ppnItems.map((item, idx) => (
                    <li key={`ppn-${idx}`}>
                      <Link 
                        to={item.path}
                        className={`block px-10 py-2 text-sm transition-colors ${location.pathname === item.path ? 'text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Inventory Accordion */}
            <li>
              <button 
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${isInventoryOpen || location.pathname.startsWith('/inventory') ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <span>Inventory</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isInventoryOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isInventoryOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="bg-slate-950 py-2">
                  {inventoryItems.map((item, idx) => (
                    <li key={`inv-${idx}`}>
                      <Link 
                        to={item.path}
                        className={`block px-10 py-2 text-sm transition-colors ${location.pathname === item.path ? 'text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Bottom Menu Items */}
            {menuItemsBottom.map((item, idx) => (
              <li key={`bot-${idx}`}>
                <Link 
                  to={item.path}
                  className={`block px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${location.pathname === item.path ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:text-white'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Pemeliharaan Sistem Accordion */}
            <li>
              <button 
                onClick={() => setIsPemeliharaanOpen(!isPemeliharaanOpen)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${isPemeliharaanOpen || location.pathname.startsWith('/pemeliharaan') ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <span>Pemeliharaan Sistem</span>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isPemeliharaanOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isPemeliharaanOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="bg-slate-950 py-2">
                  {pemeliharaanItems.map((item, idx) => (
                    <li key={`pm-${idx}`}>
                      <Link 
                        to={item.path}
                        className={`block px-10 py-2 text-sm transition-colors ${location.pathname === item.path ? 'text-blue-400 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Setup Data Baru Link */}
            <li>
              <Link 
                to="/setup-data-baru"
                className={`block px-4 py-2 text-sm hover:bg-slate-800 transition-colors ${location.pathname === '/setup-data-baru' ? 'bg-slate-800 border-l-4 border-slate-400 font-medium text-white' : 'border-l-4 border-transparent text-slate-300 hover:text-white'}`}
              >
                <span className={location.pathname === '/setup-data-baru' ? 'text-white' : 'text-yellow-400'}>Setup Data Baru</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {user?.is_admin && (
          <div className="p-4 border-t border-slate-700 bg-slate-950">
            <button 
              onClick={() => navigate('/admin')}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors flex justify-center items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Masuk Portal Admin
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f4f6f8]">
        {/* Top Header */}
        <header className="h-14 bg-white shadow-sm border-b px-6 flex items-center justify-between z-0">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/').pop()?.replace(/-/g, ' ')}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-700">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-500">{user?.email || 'PT. EDI Accounting System'}</p>
            </div>
            <div className="h-6 w-px bg-slate-300 mx-1"></div>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
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
