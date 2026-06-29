import React from 'react';
import { useSptMasaLogic } from './useSptMasaLogic';
import { SptMasaListView } from './SptMasaListView';
import { SptMasaFormView } from './SptMasaFormView';

const SptMasa1111: React.FC = () => {
  const logic = useSptMasaLogic();

  return (
    <>
      {logic.viewMode === 'list' ? (
        <SptMasaListView
          dataList={logic.dataList}
          loadingData={logic.loadingList}
          onOpenForm={logic.handleNewClick}
          onEdit={logic.handleEditClick}
          onDelete={logic.handleDeleteById}
        />
      ) : (
        <SptMasaFormView
          form={logic.form}
          setForm={logic.setForm}
          isNew={logic.isNew}
          calculated={logic.calculated}
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

export default SptMasa1111;
