import React from "react";
import { useSptMasaLogic } from "./useSptMasaLogic";
import { SptMasaFormView } from "./SptMasaFormView";

const SptMasa1111: React.FC = () => {
  const logic = useSptMasaLogic();

  return (
    <SptMasaFormView
      form={logic.form}
      setForm={logic.setForm}
      isNew={logic.isNew}
      calculated={logic.calculated}
      onSave={logic.handleSave}
      onDelete={() => {
        if (logic.form.id) logic.handleDeleteById(logic.form.id);
      }}
      onClose={() => {}}
    />
  );
};

export default SptMasa1111;
