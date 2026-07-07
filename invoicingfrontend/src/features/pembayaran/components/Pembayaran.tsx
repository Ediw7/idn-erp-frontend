import React from 'react';
import { usePembayaranLogic, emptyForm, emptyModalForm } from './usePembayaranLogic';
import { PembayaranListView } from './PembayaranListView';
import { PembayaranFormView } from './PembayaranFormView';
import { PembayaranLineModal } from './PembayaranLineModal';
import { PembayaranNewModal } from './PembayaranNewModal';

const Pembayaran: React.FC = () => {
  const logic = usePembayaranLogic();

  if (logic.loadingData) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Memuat data pembayaran...
      </div>
    );
  }

  return (
    <>
      {logic.viewMode === 'list' ? (
        <PembayaranListView 
          dataList={logic.dataList}
          setViewMode={logic.setViewMode}
          setForm={logic.setForm}
          emptyForm={emptyForm}
          handleDelete={logic.handleDelete}
          pelanggans={logic.pelanggans}
          setShowNewModal={logic.setShowNewModal}
          setModalForm={logic.setModalForm}
          emptyModalForm={emptyModalForm}
        />
      ) : (
        <PembayaranFormView 
          form={logic.form}
          setForm={logic.setForm}
          pelanggans={logic.pelanggans}
          handlePembeliChange={logic.handlePembeliChange}
          handleOpenAddLine={logic.handleOpenAddLine}
          handleOpenEditLine={logic.handleOpenEditLine}
          removeLine={logic.removeLine}
          handleSaveAll={logic.handleSaveAll}
          setViewMode={logic.setViewMode}
          setShowNewModal={logic.setShowNewModal}
          setModalForm={logic.setModalForm}
          emptyModalForm={emptyModalForm}
        />
      )}

      {logic.showLineModal && (
        <PembayaranLineModal 
          editLineIndex={logic.editLineIndex}
          lineForm={logic.lineForm}
          setLineForm={logic.setLineForm}
          availableInvoices={logic.availableInvoices}
          onClose={() => logic.setShowLineModal(false)}
          onSave={logic.handleSaveLine}
        />
      )}

      {logic.showNewModal && (
        <PembayaranNewModal 
          modalForm={logic.modalForm}
          setModalForm={logic.setModalForm}
          setShowNewModal={logic.setShowNewModal}
          handleCreateHeader={logic.handleCreateHeader}
          pelanggans={logic.pelanggans}
          loadingData={logic.loadingData}
          handlePembeliChange={logic.handlePembeliChange}
        />
      )}
    </>
  );
};

export default Pembayaran;
