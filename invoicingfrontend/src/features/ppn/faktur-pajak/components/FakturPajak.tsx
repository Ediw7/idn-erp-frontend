import React from 'react';
import { useFakturPajakLogic } from './useFakturPajakLogic';
import { FakturPajakListView } from './FakturPajakListView';
import { FakturPajakFormView } from './FakturPajakFormView';
import { PenjatahanNSFPModal } from '../../../setup/components/PenjatahanNSFPModal';
import { SetupPelangganModal } from '../../../setup/components/SetupPelangganModal';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const FakturPajak: React.FC = () => {
  const logic = useFakturPajakLogic();

  // Helper for eFaktur Download
  const handleDownloadEFaktur = () => {
    // Generate dummy CSV
    const csvContent = `"FK","KD_JENIS_TRANSAKSI","FG_PENGGANTI","NOMOR_FAKTUR","MASA_PAJAK","TAHUN_PAJAK","TANGGAL_FAKTUR","NPWP","NAMA","ALAMAT_LENGKAP","JUMLAH_DPP","JUMLAH_PPN","JUMLAH_PPNBM","ID_KETERANGAN_TAMBAHAN","FG_UANG_MUKA","UANG_MUKA_DPP","UANG_MUKA_PPN","UANG_MUKA_PPNBM","REFERENSI"\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pajak_Keluaran.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`File e-Faktur berhasil diunduh!`);
    logic.setShowEFakturModal(false);
  };

  return (
    <>
      {logic.viewMode === 'list' ? (
        <FakturPajakListView
          dataList={logic.dataList}
          loadingData={logic.loadingData}
          filterTglMulai={logic.filterTglMulai}
          setFilterTglMulai={logic.setFilterTglMulai}
          filterTglAkhir={logic.filterTglAkhir}
          setFilterTglAkhir={logic.setFilterTglAkhir}
          filterNoFaktur={logic.filterNoFaktur}
          setFilterNoFaktur={logic.setFilterNoFaktur}
          filterMataUang={logic.filterMataUang}
          setFilterMataUang={logic.setFilterMataUang}
          filterNamaPembeli={logic.filterNamaPembeli}
          setFilterNamaPembeli={logic.setFilterNamaPembeli}
          filterNoInvoice={logic.filterNoInvoice}
          setFilterNoInvoice={logic.setFilterNoInvoice}
          onFilter={logic.handleFilter}
          onShowAll={logic.handleShowAll}
          onOpenForm={logic.handleNewClick}
          onEdit={(item, idx) => {
            logic.setCurrentIndex(idx);
            logic.setForm(item);
            logic.setIsNew(false);
            logic.setViewMode('form');
          }}
          onDelete={(id) => logic.handleDeleteById(id)}
        />
      ) : (
        <FakturPajakFormView
          form={logic.form}
          setForm={logic.setForm}
          isNew={logic.isNew}
          pelanggans={logic.pelanggans}
          items={logic.items}
          fakturPajakSetups={logic.fakturPajakSetups}
          invoices={logic.invoices}
          onSave={logic.handleSave}
          onDelete={logic.handleDelete}
          onClose={() => logic.setViewMode('list')}
          onNew={logic.handleNewClick}
          handlePembeliChange={logic.handlePembeliChange}
          handleInvoiceChange={logic.handleInvoiceChange}
          handleAddLine={logic.handleAddLine}
          handleRemoveLine={logic.handleRemoveLine}
          handleUpdateLine={logic.handleUpdateLine}
          setShowNsfpModal={logic.setShowNsfpModal}
          setShowPelangganModal={logic.setShowPelangganModal}
          setShowPenggantiModal={logic.setShowPenggantiModal}
          setShowEFakturModal={logic.setShowEFakturModal}
          totals={logic.calculateTotal()}
        />
      )}

      {/* Modal Ekspor e-Faktur */}
      {logic.showEFakturModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white w-full max-w-lg flex flex-col border border-slate-300 shadow-xl rounded-sm overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white border-b border-slate-700">
              <h3 className="font-bold text-sm">Ekspor Data ke Program e-Faktur</h3>
              <button onClick={() => logic.setShowEFakturModal(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4 flex justify-end gap-2 border-t border-slate-200 mt-16 bg-slate-50">
              <button onClick={() => logic.setShowEFakturModal(false)} className="px-4 py-2 text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 rounded-sm">BATAL</button>
              <button onClick={handleDownloadEFaktur} className="px-4 py-2 text-xs font-bold border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 rounded-sm">PROSES & UNDUH</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat FP Pengganti */}
      {logic.showPenggantiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white w-full max-w-md flex flex-col border border-slate-300 shadow-xl rounded-sm overflow-hidden">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white border-b border-slate-700">
              <h3 className="font-bold text-sm">Buat Faktur Pajak Pengganti</h3>
              <button onClick={() => logic.setShowPenggantiModal(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="p-4 flex justify-end gap-2 border-t border-slate-200 mt-16 bg-slate-50">
              <button onClick={() => logic.setShowPenggantiModal(false)} className="px-4 py-2 text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 rounded-sm">BATAL</button>
              <button onClick={() => {
                logic.setShowPenggantiModal(false);
                toast.success('Faktur Pajak Pengganti dibuat');
              }} className="px-4 py-2 text-xs font-bold border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 rounded-sm">BUAT BARU</button>
            </div>
          </div>
        </div>
      )}

      <PenjatahanNSFPModal
        isOpen={logic.showNsfpModal}
        onClose={() => logic.setShowNsfpModal(false)}
        onSaved={logic.fetchInitialData}
      />

      <SetupPelangganModal
        isOpen={logic.showPelangganModal}
        onClose={() => logic.setShowPelangganModal(false)}
        onSaved={logic.fetchInitialData}
      />
    </>
  );
};

export default FakturPajak;
