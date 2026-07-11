import React from "react";
import { useSuratJalanLogic } from "./useSuratJalanLogic";
import { SuratJalanListView } from "./SuratJalanListView";
import { SuratJalanFormView } from "./SuratJalanFormView";
import { SuratJalanNewModal } from "./SuratJalanNewModal";
import { SuratJalanInvoiceModal } from "./SuratJalanInvoiceModal";
import { SuratJalanLineModal } from "./SuratJalanLineModal";

const SuratJalan: React.FC = () => {
  const {
    navigate,
    user,
    pelanggans,
    gudangs,
    items,
    salesOrders,
    periode,
    setPeriode,
    showNewSjModal,
    setShowNewSjModal,
    showInvoiceModal,
    setShowInvoiceModal,
    activeTab,
    setActiveTab,
    isLineModalOpen,
    setIsLineModalOpen,
    editLineIndex,
    setEditLineIndex,
    lineForm,
    setLineForm,
    viewMode,
    setViewMode,
    dataList,
    setDataList,
    emptyForm,
    form,
    setForm,
    modalForm,
    setModalForm,
    handlePelangganChange,
    handleSOChange,
    handleCreateSJ,
    handleSaveAll,
    calculateTotalQty,
    handleOpenAddLine,
    handleOpenEditLine,
    handleSaveLine,
    removeLine,
    handleDeleteSJ,
    isSaving,
  } = useSuratJalanLogic();

  return (
    <>
      {viewMode === "list" && (
        <SuratJalanListView
          dataList={dataList}
          pelanggans={pelanggans}
          gudangs={gudangs}
          periode={periode}
          setPeriode={setPeriode}
          onOpenForm={() => {
            setForm(emptyForm);
            setViewMode("form");
          }}
          onEdit={(item) => {
            setForm(item);
            setViewMode("form");
          }}
          onDelete={handleDeleteSJ}
        />
      )}

      {viewMode === "form" && (
        <SuratJalanFormView
          form={form}
          setForm={setForm}
          emptyForm={emptyForm}
          modalForm={modalForm}
          setModalForm={setModalForm}
          pelanggans={pelanggans}
          gudangs={gudangs}
          salesOrders={salesOrders}
          periode={periode}
          setPeriode={setPeriode}
          user={user}
          handlePelangganChange={handlePelangganChange}
          handleSOChange={handleSOChange}
          handleSaveAll={handleSaveAll}
          calculateTotalQty={calculateTotalQty}
          handleOpenAddLine={handleOpenAddLine}
          handleOpenEditLine={handleOpenEditLine}
          removeLine={removeLine}
          setViewMode={setViewMode}
          setShowNewSjModal={setShowNewSjModal}
          setShowInvoiceModal={setShowInvoiceModal}
          navigate={navigate}
          isSaving={isSaving}
        />
      )}

      {/* Modals */}
      {showNewSjModal && (
        <SuratJalanNewModal
          modalForm={modalForm}
          setModalForm={setModalForm}
          pelanggans={pelanggans}
          gudangs={gudangs}
          salesOrders={salesOrders}
          handlePelangganChange={handlePelangganChange}
          handleSOChange={handleSOChange}
          handleCreateSJ={handleCreateSJ}
          onClose={() => setShowNewSjModal(false)}
        />
      )}

      {showInvoiceModal && (
        <SuratJalanInvoiceModal
          form={form}
          pelanggans={pelanggans}
          onClose={() => setShowInvoiceModal(false)}
          navigate={navigate}
        />
      )}

      {isLineModalOpen && (
        <SuratJalanLineModal
          editLineIndex={editLineIndex}
          lineForm={lineForm}
          setLineForm={setLineForm}
          items={items}
          onClose={() => setIsLineModalOpen(false)}
          handleSaveLine={handleSaveLine}
        />
      )}
    </>
  );
};

export default SuratJalan;
