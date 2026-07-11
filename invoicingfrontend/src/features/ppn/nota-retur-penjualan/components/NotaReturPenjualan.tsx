import React from "react";
import { useNotaReturPenjualanLogic } from "./useNotaReturPenjualanLogic";
import { NotaReturPenjualanListView } from "./NotaReturPenjualanListView";
import { NotaReturPenjualanFormView } from "./NotaReturPenjualanFormView";

const NotaReturPenjualan: React.FC = () => {
  const logic = useNotaReturPenjualanLogic();

  return (
    <>
      {logic.viewMode === "list" ? (
        <NotaReturPenjualanListView
          dataList={logic.dataList}
          loadingData={logic.loadingList}
          periode={logic.periode}
          setPeriode={logic.setPeriode}
          onOpenForm={logic.handleNewClick}
          onEdit={logic.handleEditClick}
          onDelete={logic.handleDeleteById}
        />
      ) : (
        <NotaReturPenjualanFormView
          form={logic.form}
          setForm={logic.setForm}
          isNew={logic.isNew}
          pelanggans={logic.pelanggans}
          mataUangs={logic.mataUangs}
          items={logic.items}
          gudangs={logic.gudangs}
          invoices={logic.invoices}
          dpp={logic.dpp}
          ppnAmount={logic.ppnAmount}
          onSave={logic.handleSave}
          onDelete={() => {
            if (logic.form.id) logic.handleDeleteById(logic.form.id);
          }}
          onClose={() => logic.setViewMode("list")}
          onNew={logic.handleNewClick}
          handlePelangganChange={logic.handlePelangganChange}
          addLine={logic.addLine}
          removeLine={logic.removeLine}
          updateLine={logic.updateLine}
        />
      )}
    </>
  );
};

export default NotaReturPenjualan;
