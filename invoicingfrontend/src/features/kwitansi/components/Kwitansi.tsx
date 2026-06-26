import React from 'react';
import { useKwitansiLogic } from './useKwitansiLogic';
import { KwitansiListView } from './KwitansiListView';
import { KwitansiFormView } from './KwitansiFormView';

const Kwitansi: React.FC = () => {
  const {
    navigate, confirm,
    pelanggans, loadingData,
    viewMode, setViewMode,
    dataList, filteredData,
    filter, setFilter, handleResetFilter,
    emptyForm, form, setForm,
    showNewModal, setShowNewModal,
    signatureData,
    handleJumlahChange, handlePembeliChange, handleSave, handleDelete
  } = useKwitansiLogic();

  if (viewMode === 'list') {
    return (
      <KwitansiListView 
        dataList={dataList}
        filteredData={filteredData}
        pelanggans={pelanggans}
        filter={filter}
        setFilter={setFilter}
        handleResetFilter={handleResetFilter}
        onOpenForm={() => {
          setForm(emptyForm);
          setViewMode('form');
        }}
        onEdit={(no_kwitansi) => {
          const k = dataList.find(x => x.no_kwitansi === no_kwitansi);
          if (k) {
            setForm(k);
            setViewMode('form');
          }
        }}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <KwitansiFormView 
      form={form}
      setForm={setForm}
      pelanggans={pelanggans}
      loadingData={loadingData}
      signatureData={signatureData}
      handleJumlahChange={handleJumlahChange}
      handlePembeliChange={handlePembeliChange}
      handleSave={handleSave}
      handleDelete={handleDelete}
      onBack={() => setViewMode('list')}
      onPrint={(no_kwitansi) => {
        navigate(`/laporan?kwitansi_number=${encodeURIComponent(no_kwitansi)}&reportName=${encodeURIComponent('Kwitansi (1/2 Kwarto)')}`);
      }}
    />
  );
};

export default Kwitansi;
