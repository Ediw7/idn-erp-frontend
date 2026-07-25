import React from "react";
import { useNotaKreditLogic } from "./components/useNotaKreditLogic";
import { NotaKreditListView } from "./components/NotaKreditListView";
import { NotaKreditFormView } from "./components/NotaKreditFormView";

const NotaKredit: React.FC = () => {
  const logic = useNotaKreditLogic();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#f4f6f8]">
      {logic.viewMode === "list" ? (
        <NotaKreditListView
          dataList={logic.dataList}
          pelanggans={logic.pelanggans}
          periode={logic.periode}
          setPeriode={logic.setPeriode}
          onOpenForm={logic.handleOpenForm}
          onEdit={logic.loadForm}
          onDelete={logic.handleDelete}
          pagination={logic.pagination}
          onPageChange={(page) => logic.fetchData(page)}
          emptyForm={logic.emptyForm}
          setModalForm={logic.setModalForm}
          setShowNewModal={logic.setShowNewModal}
        />
      ) : (
        <NotaKreditFormView
          form={logic.form}
          setForm={logic.setForm}
          isSaving={logic.isSaving}
          onSave={logic.handleSaveAll}
          onCancel={() => {
            logic.setForm(logic.emptyForm);
            logic.setViewMode("list");
          }}
          pelanggans={logic.pelanggans}
          mataUangs={logic.mataUangs}
          invoices={logic.invoices}
          onAddLine={logic.addLine}
          onUpdateLine={logic.updateLine}
          onRemoveLine={logic.removeLine}
        />
      )}
    </div>
  );
};

export default NotaKredit;
