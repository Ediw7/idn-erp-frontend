import React from "react";
import { useHistoryHargaJualLogic } from "./useHistoryHargaJualLogic";
import { HistoryHargaJualListView } from "./HistoryHargaJualListView";
import { HistoryHargaJualFormView } from "./HistoryHargaJualFormView";

const HistoryHargaJual: React.FC = () => {
  const logic = useHistoryHargaJualLogic();

  return (
    <>
      {/* === LIST VIEW === */}
      {logic.viewMode === "list" && (
        <HistoryHargaJualListView logic={logic} />
      )}

      {/* === FORM VIEW === */}
      {logic.viewMode === "form" && (
        <HistoryHargaJualFormView logic={logic} />
      )}
    </>
  );
};

export default HistoryHargaJual;
