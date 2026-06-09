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
import MainDashboard from './features/dashboard/components/MainDashboard';
import AdminUserManagement from './features/admin/components/UserManagement';
import SaldoAwalPiutang from './features/saldo-awal/components/SaldoAwalPiutang';
import SalesOrder from './features/sales-order/components/SalesOrder';
import SuratJalan from './features/surat-jalan/components/SuratJalan';
import Invoice from './features/invoice/components/Invoice';
import Laporan from './features/report/components/Laporan';
import FakturPajak from './features/faktur-pajak/components/FakturPajak';
import Kwitansi from './features/kwitansi/components/Kwitansi';
import HistoryHargaJual from './features/history-harga/components/HistoryHargaJual';
import Pembayaran from './features/pembayaran/components/Pembayaran';
import NotaKredit from './features/nota-kredit/components/NotaKredit';
import KartuPiutang from './features/kartu-piutang/components/KartuPiutang';
import OutstandingInvoice from './features/outstanding-invoice/components/OutstandingInvoice';
import RangkumanPenjualan from './features/rangkuman-penjualan/components/RangkumanPenjualan';
import SetupDataBaru from './features/setup-data-baru/components/SetupDataBaru';

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
            <Route index element={<MainDashboard />} />
            
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

            {/* General Routes */}
            <Route path="saldo-awal-piutang" element={<SaldoAwalPiutang />} />

            {/* Main Application Routes */}
            <Route path="invoice" element={<Invoice />} />
            <Route path="surat-jalan" element={<SuratJalan />} />
            <Route path="sales-order" element={<SalesOrder />} />
            <Route path="faktur-pajak" element={<FakturPajak />} />
            <Route path="kwitansi" element={<Kwitansi />} />
            <Route path="history-harga" element={<HistoryHargaJual />} />
            <Route path="pembayaran" element={<Pembayaran />} />
            <Route path="nota-kredit" element={<NotaKredit />} />
            <Route path="kartu-piutang" element={<KartuPiutang />} />
            <Route path="outstanding-invoice" element={<OutstandingInvoice />} />
            <Route path="rangkuman-penjualan" element={<RangkumanPenjualan />} />
            <Route path="laporan" element={<Laporan />} />
            <Route path="setup-data-baru" element={<SetupDataBaru />} />
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
