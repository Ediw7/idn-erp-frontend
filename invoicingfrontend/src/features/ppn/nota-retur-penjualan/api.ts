import axiosClient from "../../../lib/axiosClient";

export interface NotaReturLine {
  id?: number;
  item_id: number | null;
  kode_barang?: string;
  nama_barang?: string;
  satuan?: string;
  kuantum: number;
  harga_satuan: number;
  harga_jual: number;
  hpp: number;
  total_hpp: number;
}

export interface NotaReturData {
  id?: number;
  no_nota: string;
  tgl_nota: string;
  pelanggan_id: number | null;
  pelanggan_nama?: string;
  alamat_pembeli: string;
  jenis_transaksi: string;
  gudang_id: string;
  jenis_retur: string;
  atas_no_fp: string;
  tgl_fp: string;
  atas_no_invoice: string;
  mata_uang_id: number | null;
  mata_uang_kode?: string;
  tarif_ppn: number;
  kurs_pajak: number;
  lokasi_pelaporan: string;
  tanda_tangan: string;
  jabatan: string;
  lines: NotaReturLine[];
}

export const notaReturApi = {
  getAll: async () => {
    const response = await axiosClient.post("/api/nota-retur/get", {
      jsonrpc: "2.0",
      params: {},
    });
    return (response.data.result?.data || []) as NotaReturData[];
  },

  save: async (data: NotaReturData) => {
    const response = await axiosClient.post("/api/nota-retur/create", {
      jsonrpc: "2.0",
      params: data,
    });
    return response.data.result;
  },

  delete: async (id: number) => {
    const response = await axiosClient.post("/api/nota-retur/delete", {
      jsonrpc: "2.0",
      params: { id },
    });
    return response.data.result;
  },

  autoNo: async () => {
    const response = await axiosClient.post("/api/nota-retur/autono", {
      jsonrpc: "2.0",
      params: {},
    });
    return response.data.result;
  },
};
