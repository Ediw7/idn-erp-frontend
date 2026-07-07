import React from 'react';
import { useLocation } from 'react-router-dom';
import { useInvoiceLogic, emptyForm } from './useInvoiceLogic';
import { InvoiceListView } from './InvoiceListView';
import { InvoiceFormView } from './InvoiceFormView';
import { InvoiceNewModal } from './InvoiceNewModal';
import { InvoiceFpModal } from './InvoiceFpModal';
import { InvoiceLineModal } from './InvoiceLineModal';
import { SetupPelangganModal } from '../../setup/components/SetupPelangganModal';

const Invoice: React.FC = () => {
  const location = useLocation();
  const logic = useInvoiceLogic(location.search);

  return (
    <>
      {logic.viewMode === 'list' && (
        <InvoiceListView 
          dataList={logic.dataList} 
          setForm={logic.setForm} 
          setModalForm={logic.setModalForm} 
          emptyForm={emptyForm} 
          setViewMode={logic.setViewMode} 
          handleDeleteInvoice={logic.handleDeleteInvoice} 
          pelanggans={logic.pelanggans} 
          salesmans={logic.salesmans} 
          mataUangs={logic.mataUangs} 
          proyeks={logic.proyeks} 
        />
      )}

      {logic.viewMode === 'form' && (
        <InvoiceFormView 
          form={logic.form} 
          setForm={logic.setForm} 
          emptyForm={emptyForm} 
          dataList={logic.dataList} 
          pelanggans={logic.pelanggans} 
          proyeks={logic.proyeks} 
          mataUangs={logic.mataUangs} 
          salesOrders={logic.salesOrders} 
          pembayarans={logic.pembayarans} 
          salesmans={logic.salesmans} 
          gudangs={logic.gudangs} 
          items={logic.items} 
          suratJalans={logic.suratJalans}
          loadingData={logic.loadingData} 
          activeTab={logic.activeTab} 
          setActiveTab={logic.setActiveTab} 
          setViewMode={logic.setViewMode} 
          setModalForm={logic.setModalForm} 
          setShowNewInvoiceModal={logic.setShowNewInvoiceModal} 
          setShowPelangganModal={logic.setShowPelangganModal} 
          setShowFpModal={logic.setShowFpModal} 
          handlePembeliChange={logic.handlePembeliChange} 
          handleOpenAddLine={logic.handleOpenAddLine} 
          handleOpenEditLine={logic.handleOpenEditLine} 
          removeLine={logic.removeLine} 
          handleSaveAll={logic.handleSaveAll} 
          signatureData={logic.signatureData} 
          user={logic.user} 
          confirm={logic.confirm} 
        />
      )}

      {logic.showLineModal && (
        <InvoiceLineModal 
          editLineIndex={logic.editLineIndex}
          lineForm={logic.lineForm}
          setLineForm={logic.setLineForm}
          items={logic.items}
          onClose={() => logic.setShowLineModal(false)}
          onSave={logic.handleSaveLine}
        />
      )}

      {logic.showNewInvoiceModal && (
        <InvoiceNewModal 
          modalForm={logic.modalForm} 
          setModalForm={logic.setModalForm} 
          setShowNewInvoiceModal={logic.setShowNewInvoiceModal} 
          handleCreateInvoiceHeader={logic.handleCreateInvoiceHeader} 
          pelanggans={logic.pelanggans} 
          salesOrders={logic.salesOrders} 
          loadingData={logic.loadingData} 
          handlePembeliChange={logic.handlePembeliChange} 
        />
      )}

      {logic.showFpModal && (
        <InvoiceFpModal 
          form={logic.form} 
          setShowFpModal={logic.setShowFpModal} 
        />
      )}

      <SetupPelangganModal 
        isOpen={logic.showPelangganModal} 
        onClose={() => logic.setShowPelangganModal(false)} 
        onSaved={logic.fetchTtd} 
      />
    </>
  );
};

export default Invoice;
