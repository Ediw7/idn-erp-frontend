import React from "react";
import { useNotaReturPembelianLogic } from "./useNotaReturPembelianLogic";
import { NotaReturPembelianListView } from "./NotaReturPembelianListView";
import { NotaReturPembelianFormView } from "./NotaReturPembelianFormView";

const NotaReturPembelian: React.FC = () => {
  const logic = useNotaReturPembelianLogic();

  return (
    <>
      {logic.viewMode === "list" ? (
        <NotaReturPembelianListView
          dataList={logic.dataList}
          loadingData={logic.loadingList}
          periode={logic.periode}
          setPeriode={logic.setPeriode}
          onOpenForm={logic.handleNewClick}
          onEdit={logic.handleEditClick}
          onDelete={logic.handleDeleteById}
        />
      ) : (
        <NotaReturPembelianFormView
          form={logic.form}
          setForm={logic.setForm}
          isNew={logic.isNew}
          suppliers={logic.suppliers}
          mataUangs={logic.mataUangs}
          items={logic.items}
          gudangs={logic.gudangs}
          dpp={logic.dpp}
          ppnAmount={logic.ppnAmount}
          onSave={logic.handleSave}
          onDelete={() => {
            if (logic.form.id) logic.handleDeleteById(logic.form.id);
          }}
          onClose={() => logic.setViewMode("list")}
          onNew={logic.handleNewClick}
          handleSupplierChange={logic.handleSupplierChange}
          addLine={logic.addLine}
          removeLine={logic.removeLine}
          updateLine={logic.updateLine}
        />
      )}
    </>
  );
};

export default NotaReturPembelian;
