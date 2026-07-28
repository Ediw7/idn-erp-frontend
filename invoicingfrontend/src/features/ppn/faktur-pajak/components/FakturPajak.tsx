import React from "react";
import { useFakturPajakLogic } from "./useFakturPajakLogic";
import { FakturPajakListView } from "./FakturPajakListView";
import { FakturPajakFormView } from "./FakturPajakFormView";
import { FakturPajakNewModal } from "./FakturPajakNewModal";
import { PenjatahanNsfpModal } from "./PenjatahanNsfpModal";
import { CariFakturPajakModal } from "./CariFakturPajakModal";

const FakturPajak: React.FC = () => {
  const logic = useFakturPajakLogic();

  return (
    <>
      <div className="flex-1 flex flex-col min-h-0 bg-[#f4f6f8]">
        {logic.viewMode === "list" ? (
          <FakturPajakListView
            dataList={logic.dataList}
            pelanggans={logic.pelanggans}
            periode={logic.periode}
            setPeriode={logic.setPeriode}
            onOpenForm={logic.handleOpenForm}
            onEdit={logic.loadForm}
            onDelete={logic.handleDelete}
            pagination={logic.pagination}
            onPageChange={(page) => logic.fetchData(page)}
          />
        ) : (
          <FakturPajakFormView
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
            items={logic.items}
            penjatahans={logic.penjatahans}
            tandaTangans={logic.tandaTangans}
            onAddLine={logic.addLine}
            onUpdateLine={logic.updateLine}
            onRemoveLine={logic.removeLine}
            onNew={logic.handleNewClick}
            onDelete={() => {
              if (logic.form.id) {
                logic.handleDelete(logic.form.id);
              }
            }}
            onOpenPenjatahan={() => logic.setShowPenjatahanModal(true)}
            onOpenFpPenggantiModal={() => logic.setShowCariFpModal(true)}
            onAutoGenerate={async () => {
              if (logic.form.penomoran) {
                const no = await logic.handleAutoNoFp(logic.form.penomoran);
                if (no) {
                  logic.setForm((prev: any) => ({ ...prev, no_fp: no }));
                }
              }
            }}
          />
        )}
      </div>

      {logic.showNewModal && (
        <FakturPajakNewModal
          newForm={logic.newForm}
          setNewForm={logic.setNewForm}
          pelanggans={logic.pelanggans}
          mataUangs={logic.mataUangs}
          invoices={logic.invoices}
          tandaTangans={logic.tandaTangans}
          penjatahans={logic.penjatahans}
          inputClass="w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-sm text-sm disabled:bg-slate-100 disabled:text-slate-500 transition-colors"
          onClose={() => logic.setShowNewModal(false)}
          onSubmit={logic.handleCreateNew}
          onOpenPenjatahan={() => logic.setShowPenjatahanModal(true)}
          onAutoNoFp={logic.handleAutoNoFp}
          onAutoGenerate={async () => {
            if (logic.newForm.penomoran) {
              const no = await logic.handleAutoNoFp(logic.newForm.penomoran, undefined, undefined);
              if (no) {
                logic.setNewForm((prev: any) => ({ ...prev, no_fp: no }));
              }
            }
          }}
        />
      )}

      {logic.showPenjatahanModal && (
        <PenjatahanNsfpModal
          penjatahans={logic.penjatahans}
          onClose={() => logic.setShowPenjatahanModal(false)}
          onSave={logic.handleSavePenjatahan}
          onDelete={logic.handleDeletePenjatahan}
          onRefresh={logic.refreshPenjatahans}
        />
      )}

      {logic.showCariFpModal && (
        <CariFakturPajakModal
          dataList={logic.dataList}
          onClose={() => logic.setShowCariFpModal(false)}
          onSelect={(fp) => {
            logic.setForm((prev: any) => ({
              ...prev,
              fp_diganti: fp.no_fp,
              tgl_fp_diganti: fp.tgl_fp,
            }));
            logic.setShowCariFpModal(false);
          }}
        />
      )}
    </>
  );
};

export default FakturPajak;
