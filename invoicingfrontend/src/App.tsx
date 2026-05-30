import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import SetupPerusahaan from './features/setup/components/SetupPerusahaan';
import SetupPreferensi from './features/setup/components/SetupPreferensi';
import SetupMataUang from './features/setup/components/SetupMataUang';
import SetupKursPajak from './features/setup/components/SetupKursPajak';
import SetupTandaTangan from './features/setup/components/SetupTandaTangan';
import SetupPerkiraan from './features/setup/components/SetupPerkiraan';
import SetupGudang from './features/setup/components/SetupGudang';
import SetupGroupBarang from './features/setup/components/SetupGroupBarang';
import SetupItem from './features/setup/components/SetupItem';
import SetupPembayaran from './features/setup/components/SetupPembayaran';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Default redirect for dashboard */}
          <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Selamat Datang di IDN ERP</h1><p className="mt-2 text-gray-600">Pilih menu di sebelah kiri untuk memulai.</p></div>} />
          
          {/* Setup Routes */}
          <Route path="setup">
            <Route path="perusahaan" element={<SetupPerusahaan />} />
            <Route path="preferensi" element={<SetupPreferensi />} />
            {/* Add other setup routes here later */}
            <Route path="mata-uang" element={<SetupMataUang />} />
            <Route path="kurs-pajak" element={<SetupKursPajak />} />
            <Route path="tanda-tangan" element={<SetupTandaTangan />} />
            <Route path="perkiraan" element={<SetupPerkiraan />} />
            <Route path="gudang" element={<SetupGudang />} />
            <Route path="group-barang" element={<SetupGroupBarang />} />
            <Route path="item" element={<SetupItem />} />
            <Route path="pembayaran" element={<SetupPembayaran />} />
            <Route path="pelanggan" element={<div>Setup Pelanggan (Coming Soon)</div>} />
            <Route index element={<Navigate to="perusahaan" replace />} />
          </Route>

          {/* Placeholder for other main menus */}
          <Route path="invoice" element={<div>Menu Invoice (Coming Soon)</div>} />
          <Route path="sales-order" element={<div>Menu Sales Order (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
