import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { Toaster } from 'react-hot-toast';
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
import FakturPajak from './features/ppn/faktur-pajak/components/FakturPajak';
import Kwitansi from './features/kwitansi/components/Kwitansi';
import HistoryHargaJual from './features/history-harga/components/HistoryHargaJual';
import Pembayaran from './features/pembayaran/components/Pembayaran';
import NotaKredit from './features/nota-kredit/components/NotaKredit';
import KartuPiutang from './features/kartu-piutang/components/KartuPiutang';
import OutstandingInvoice from './features/outstanding-invoice/components/OutstandingInvoice';
import RangkumanPenjualan from './features/rangkuman-penjualan/components/RangkumanPenjualan';
import SetupDataBaru from './features/setup-data-baru/components/SetupDataBaru';
import NotaReturPenjualan from './features/ppn/nota-retur-penjualan/components/NotaReturPenjualan';
import NotaReturPembelian from './features/ppn/nota-retur-pembelian/components/NotaReturPembelian';
import SptMasa1111 from './features/ppn/spt-masa/components/SptMasa1111';
import SuratSetoranPajak from './features/ppn/ssp/components/SuratSetoranPajak';
import SaldoAwalInventory from './features/inventory/components/SaldoAwalInventory';
import PenerimaanBarang from './features/inventory/components/PenerimaanBarang';
import AdjustmentInventory from './features/inventory/components/AdjustmentInventory';
import TransferBarang from './features/inventory/components/TransferBarang';
import ProsesHPP from './features/inventory/components/ProsesHPP';
import KartuStock from './features/inventory/components/KartuStock';
import RekapStock from './features/inventory/components/RekapStock';
import TransferEFaktur from './features/ppn/faktur-pajak/components/TransferEFaktur';
import GantiPassword from './features/pemeliharaan/components/GantiPassword';
import MigrasiData from './features/pemeliharaan/components/MigrasiData';
import SetupUser from './features/admin/components/SetupUser';
import SetupUserPermission from './features/admin/components/SetupUserPermission';
import DatabaseConnection from './features/admin/components/DatabaseConnection';
import BackupData from './features/admin/components/BackupData';
import RestoreData from './features/admin/components/RestoreData';
import PreviewLaporan from './features/report/components/PreviewLaporan';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent excessive refetching
      retry: 1, // Only retry failed requests once
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <AuthProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'text-sm font-semibold rounded-sm shadow-md border border-slate-200',
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0'
                },
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#fff'
                }
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca'
                },
                iconTheme: {
                  primary: '#dc2626',
                  secondary: '#fff'
                }
              }
            }}
          />
          <BrowserRouter>
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

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
                <Route path="preview-laporan" element={<PreviewLaporan />} />
                <Route path="setup-data-baru" element={<SetupDataBaru />} />
                <Route path="inventory/retur-penjualan" element={<NotaReturPenjualan />} />
                <Route path="ppn/retur-penjualan" element={<NotaReturPenjualan />} />
                <Route path="inventory/retur-pembelian" element={<NotaReturPembelian />} />
                <Route path="inventory/gudang" element={<SetupGudang />} />
                <Route path="inventory/barang" element={<SetupItem />} />
                <Route path="inventory/saldo-awal" element={<SaldoAwalInventory />} />
                <Route path="inventory/penerimaan" element={<PenerimaanBarang />} />
                <Route path="inventory/adjustment" element={<AdjustmentInventory />} />
                <Route path="inventory/transfer" element={<TransferBarang />} />
                <Route path="inventory/proses-hpp" element={<ProsesHPP />} />
                <Route path="inventory/kartu-stock" element={<KartuStock />} />
                <Route path="inventory/rekap-stok" element={<RekapStock />} />
                <Route path="ppn/retur-pembelian" element={<NotaReturPembelian />} />
                <Route path="ppn/spt" element={<SptMasa1111 />} />
                <Route path="ppn/ssp" element={<SuratSetoranPajak />} />
                <Route path="ppn/transfer-efaktur" element={<TransferEFaktur />} />
                <Route path="pemeliharaan/ganti-password" element={<GantiPassword />} />
                <Route path="pemeliharaan/migrasi" element={<MigrasiData />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUserManagement />} />
                <Route path="setup-user" element={<SetupUser />} />
                <Route path="setup-permission" element={<SetupUserPermission />} />
                <Route path="database" element={<DatabaseConnection />} />
                <Route path="backup" element={<BackupData />} />
                <Route path="restore" element={<RestoreData />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfirmProvider>
    </QueryClientProvider>
  );
}

export default App;
