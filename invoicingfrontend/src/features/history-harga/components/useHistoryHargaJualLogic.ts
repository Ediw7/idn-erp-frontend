import { useState, useEffect } from 'react';
import { historyHargaJualApi, HistoryHargaJualData } from '../api';
import toast from 'react-hot-toast';

export const useHistoryHargaJualLogic = () => {
  const [dataList, setDataList] = useState<HistoryHargaJualData[]>([]);
  const [loading, setLoading] = useState(false);

  const [kodeBarang, setKodeBarang] = useState('');
  const [namaBarang, setNamaBarang] = useState('');
  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [limit, setLimit] = useState(25);

  const [showItemModal, setShowItemModal] = useState(false);

  useEffect(() => {
    handleFilter();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await historyHargaJualApi.getHistory({
        kode_barang: kodeBarang,
        nama_barang: namaBarang,
        nama_pelanggan: namaPelanggan,
        limit: limit
      });
      setDataList(res);
    } catch (error) {
      toast.error('Gagal memuat histori harga jual');
    } finally {
      setLoading(false);
    }
  };

  const handleShowAll = () => {
    setLimit(0);
    setTimeout(() => {
       handleFilter();
    }, 0);
  };

  return {
    dataList, loading,
    kodeBarang, setKodeBarang,
    namaBarang, setNamaBarang,
    namaPelanggan, setNamaPelanggan,
    limit, setLimit,
    showItemModal, setShowItemModal,
    handleFilter, handleShowAll
  };
};
