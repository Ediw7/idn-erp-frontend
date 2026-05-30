import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import SetupPerusahaan from './features/setup/components/SetupPerusahaan';

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
            {/* Add other setup routes here later */}
            <Route path="mata-uang" element={<div>Setup Mata Uang (Coming Soon)</div>} />
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
