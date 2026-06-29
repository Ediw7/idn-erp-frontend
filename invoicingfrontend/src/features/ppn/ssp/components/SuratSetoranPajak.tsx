import React from 'react';
import { useSuratSetoranPajakLogic } from './useSuratSetoranPajakLogic';
import { SuratSetoranPajakListView } from './SuratSetoranPajakListView';
import { SuratSetoranPajakFormView } from './SuratSetoranPajakFormView';

const SuratSetoranPajak: React.FC = () => {
  const logic = useSuratSetoranPajakLogic();

  return (
    <>
      {logic.viewMode === 'list' ? (
        <SuratSetoranPajakListView
          dataList={logic.dataList}
          loadingData={logic.loadingList}
          onOpenForm={logic.handleNewClick}
          onEdit={logic.handleEditClick}
          onDelete={logic.handleDeleteById}
        />
      ) : (
        <SuratSetoranPajakFormView
          form={logic.form}
          setForm={logic.setForm}
          isNew={logic.isNew}
          onSave={logic.handleSave}
          onDelete={() => {
             if (logic.form.id) logic.handleDeleteById(logic.form.id);
          }}
          onClose={() => logic.setViewMode('list')}
        />
      )}
    </>
  );
};

export default SuratSetoranPajak;
