import axiosClient from "../../lib/axiosClient";

export interface HistoryHargaJualData {
  id: number;
  tgl: string;
  no_invoice: string;
  nama_pelanggan: string;
  terms: string;
  curr: string;
  kode_item: string;
  nama_item: string;
  qty: number;
  harga_satuan: number;
  harga_jual: number;
}

export const historyHargaJualApi = {
  getHistory: async (filters: {
    kode_barang?: string;
    nama_barang?: string;
    nama_pelanggan?: string;
    limit?: number;
  }) => {
    const response = await axiosClient.post("/api/history-harga-jual/get", {
      jsonrpc: "2.0",
      params: filters,
    });
    return (response.data.result?.data || []) as HistoryHargaJualData[];
  },
};
