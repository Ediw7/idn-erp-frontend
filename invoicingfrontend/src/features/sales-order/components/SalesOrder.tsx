import React from 'react';
import { useSalesOrderLogic } from './useSalesOrderLogic';
import { SalesOrderListView } from './SalesOrderListView';
import { SalesOrderFormView } from './SalesOrderFormView';
import { SalesOrderSjModal } from './SalesOrderSjModal';
import { SalesOrderNewModal } from './SalesOrderNewModal';
import { SalesOrderLineModal } from './SalesOrderLineModal';
import { SetupPelangganModal } from '../../setup/components/SetupPelangganModal';

const SalesOrder: React.FC = () => {
  const {
    navigate, dataList, pelanggans, mataUangs, pembayarans, salesmans,
    items, gudangs, wajibPpnbm, loadingData, periode, setPeriode, activeTab, setActiveTab,
    showSjModal, setShowSjModal, sjForm, setSjForm, showNewSoModal, setShowNewSoModal,
    showPelangganModal, setShowPelangganModal, newSoForm, setNewSoForm, form, setForm,
    isLineModalOpen, setIsLineModalOpen, editLineIndex, lineForm, setLineForm, viewMode, setViewMode,
    isNew, setIsNew, setCurrentIndex, fetchInitialData, handleNewClick, handleCreateNewSo,
    handleCetak, handleVoid, handleBuatSJClick, handleSave, handleDeleteSO, handleDelete,
    subtotal, ppnAmount, ppnbmAmount, total, isSaving,
    handlePelangganChange, handleOpenAddLine, handleOpenEditLine, handleSaveLine, removeLine
  } = useSalesOrderLogic();

  const isReadOnly = !!(form.is_closed || form.is_void);
  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors";
  const labelClass = "w-36 text-xs font-semibold text-slate-700 shrink-0 mt-2";
  const dpp = subtotal - (form.potongan_harga || 0);

  return (
    <>
      {/* === LIST VIEW === */}
      {viewMode === 'list' && (
        <SalesOrderListView
          dataList={dataList}
          loadingData={loadingData}
          pelanggans={pelanggans}
          mataUangs={mataUangs}
          salesmans={salesmans}
          wajibPpnbm={wajibPpnbm}
          periode={periode}
          setPeriode={setPeriode}
          onEdit={(item, idx) => {
            setForm(item);
            setCurrentIndex(idx);
            setIsNew(false);
            setViewMode('form');
          }}
          onDelete={(id) => handleDeleteSO(id)}
          onOpenForm={() => {
            setForm({
              no_so: '', tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
              no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
              tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
              potongan_harga: 0, ppn_persen: 10, ppnbm_persen: 0, ongkos_angkut: 0,
              lines: []
            });
            setIsNew(true);
            setViewMode('form');
          }}
        />
      )}

      {/* === FORM VIEW === */}
      {viewMode === 'form' && (
        <SalesOrderFormView
          form={form}
          setForm={setForm}
          isReadOnly={isReadOnly}
          inputClass={inputClass}
          labelClass={labelClass}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          periode={periode}
          setPeriode={setPeriode}
          pelanggans={pelanggans}
          mataUangs={mataUangs}
          pembayarans={pembayarans}
          salesmans={salesmans}
          items={items}
          gudangs={gudangs}
          dataList={dataList}
          wajibPpnbm={wajibPpnbm}
          loadingData={loadingData}
          subtotal={subtotal}
          dpp={dpp}
          ppnAmount={ppnAmount}
          ppnbmAmount={ppnbmAmount}
          total={total}
          handleNewClick={handleNewClick}
          handleCetak={handleCetak}
          handleBuatSJClick={handleBuatSJClick}
          handleSave={handleSave}
          isSaving={isSaving}
          handleDelete={handleDelete}
          handleVoid={handleVoid}
          handlePelangganChange={handlePelangganChange}
          handleOpenAddLine={handleOpenAddLine}
          handleOpenEditLine={handleOpenEditLine}
          removeLine={removeLine}
          setShowPelangganModal={setShowPelangganModal}
          setViewMode={setViewMode}
          onSelectSO={(so) => {
            setForm(so);
            const idx = dataList.findIndex(s => s.id === so.id);
            if (idx >= 0) setCurrentIndex(idx);
            setIsNew(false);
          }}
        />
      )}

      {/* === MODALS === */}
      {showSjModal && (
        <SalesOrderSjModal
          sjForm={sjForm}
          setSjForm={setSjForm}
          pelanggans={pelanggans}
          gudangs={gudangs}
          dataList={dataList}
          onClose={() => setShowSjModal(false)}
          onSubmit={() => {
            navigate(`/surat-jalan?so=${sjForm.no_so}&pelanggan=${sjForm.pelanggan_id}&gudang=${sjForm.gudang_id}&tgl=${sjForm.tanggal}`);
          }}
        />
      )}

      {showNewSoModal && (
        <SalesOrderNewModal
          newSoForm={newSoForm}
          setNewSoForm={setNewSoForm}
          pelanggans={pelanggans}
          mataUangs={mataUangs}
          pembayarans={pembayarans}
          salesmans={salesmans}
          inputClass={inputClass}
          onClose={() => setShowNewSoModal(false)}
          onSubmit={handleCreateNewSo}
        />
      )}

      {isLineModalOpen && (
        <SalesOrderLineModal
          editLineIndex={editLineIndex}
          lineForm={lineForm}
          setLineForm={setLineForm}
          items={items}
          onClose={() => setIsLineModalOpen(false)}
          onSave={handleSaveLine}
        />
      )}

      <SetupPelangganModal
        isOpen={showPelangganModal}
        onClose={() => setShowPelangganModal(false)}
        onSaved={fetchInitialData}
      />
    </>
  );
};

export default SalesOrder;
