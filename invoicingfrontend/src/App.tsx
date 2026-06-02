import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import { AuthProvider, useAuth } from './features/auth/contexts/AuthContext';
import Login from './features/auth/components/Login';
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
import SetupPelanggan from './features/setup/components/SetupPelanggan';
import SetupSupplier from './features/setup/components/SetupSupplier';
import SetupProyek from './features/setup/components/SetupProyek';
import SetupSalesman from './features/setup/components/SetupSalesman';
import SetupJenisPotongan from './features/setup/components/SetupJenisPotongan';
import SetupFormatBukti from './features/setup/components/SetupFormatBukti';
import SetupFakturPajak from './features/setup/components/SetupFakturPajak';
import SetupJenisPajak from './features/setup/components/SetupJenisPajak';
import SetupJenisSetoran from './features/setup/components/SetupJenisSetoran';
import SetupBahasa from './features/setup/components/SetupBahasa';
import Register from './features/auth/components/Register';
import AdminLayout from './features/admin/components/AdminLayout';
import AdminDashboard from './features/admin/components/AdminDashboard';
import AdminUserManagement from './features/admin/components/UserManagement';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: JSX.Element, requireAdmin?: boolean }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Default redirect for dashboard */}
            <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Selamat Datang di IDN ERP</h1><p className="mt-2 text-gray-600">Pilih menu di sebelah kiri untuk memulai.</p></div>} />
            
            {/* Setup Routes */}
            <Route path="setup">
              <Route path="perusahaan" element={<SetupPerusahaan />} />
              <Route path="preferensi" element={<SetupPreferensi />} />
              <Route path="mata-uang" element={<SetupMataUang />} />
              <Route path="kurs-pajak" element={<SetupKursPajak />} />
              <Route path="tanda-tangan" element={<SetupTandaTangan />} />
              <Route path="perkiraan" element={<SetupPerkiraan />} />
              <Route path="gudang" element={<SetupGudang />} />
              <Route path="group-barang" element={<SetupGroupBarang />} />
              <Route path="item" element={<SetupItem />} />
              <Route path="pembayaran" element={<SetupPembayaran />} />
              <Route path="pelanggan" element={<SetupPelanggan />} />
              <Route path="supplier" element={<SetupSupplier />} />
              <Route path="proyek" element={<SetupProyek />} />
              <Route path="salesman" element={<SetupSalesman />} />
              <Route path="jenis-potongan" element={<SetupJenisPotongan />} />
              <Route path="format-bukti" element={<SetupFormatBukti />} />
              <Route path="faktur-pajak" element={<SetupFakturPajak />} />
              <Route path="jenis-pajak" element={<SetupJenisPajak />} />
              <Route path="jenis-setoran" element={<SetupJenisSetoran />} />
              <Route path="bahasa" element={<SetupBahasa />} />
              <Route index element={<Navigate to="perusahaan" replace />} />
            </Route>

            {/* Placeholder for other main menus */}
            <Route path="invoice" element={<div>Menu Invoice (Coming Soon)</div>} />
            <Route path="sales-order" element={<div>Menu Sales Order (Coming Soon)</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
