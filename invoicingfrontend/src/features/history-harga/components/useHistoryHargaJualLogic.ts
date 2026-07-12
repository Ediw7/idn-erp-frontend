import { useState, useEffect } from "react";
import { historyHargaJualApi, HistoryHargaJualData } from "../api";
import toast from "react-hot-toast";

export const useHistoryHargaJualLogic = () => {
  const [dataList, setDataList] = useState<HistoryHargaJualData[]>([]);
  const [loading, setLoading] = useState(false);

  // View mode switcher
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [selectedRecord, setSelectedRecord] =
    useState<HistoryHargaJualData | null>(null);

  // Filters
  const [kodeBarang, setKodeBarang] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [periode, setPeriode] = useState("2026-07");

  const [showItemModal, setShowItemModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilter();
    }, 500);

    return () => clearTimeout(timer);
  }, [kodeBarang, namaBarang, namaPelanggan, periode]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await historyHargaJualApi.getHistory({
        kode_barang: kodeBarang,
        nama_barang: namaBarang,
        nama_pelanggan: namaPelanggan,
        periode: periode,
      });
      setDataList(res);
    } catch (error) {
      toast.error("Gagal memuat histori harga jual");
    } finally {
      setLoading(false);
    }
  };

  return {
    dataList,
    loading,
    kodeBarang,
    setKodeBarang,
    namaBarang,
    setNamaBarang,
    namaPelanggan,
    setNamaPelanggan,
    periode,
    setPeriode,
    showItemModal,
    setShowItemModal,
    handleFilter,
    viewMode,
    setViewMode,
    selectedRecord,
    setSelectedRecord,
  };
};
