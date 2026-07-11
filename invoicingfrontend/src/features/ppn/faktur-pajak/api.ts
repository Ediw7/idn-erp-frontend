import axiosClient from "../../../lib/axiosClient";

export interface FakturPajakLine {
  id?: number;
  item_id: number | null;
  kode_barang?: string;
  nama_barang?: string;
  satuan?: string;
  kuantum: number;
  harga_satuan: number;
  harga_jual: number;
}

export interface FakturPajakData {
  id?: number;
  penomoran: string; // ID for setup NSFP
  no_fp: string;
  tgl_fp: string;
  pembeli_id: number | null;
  pembeli_nama?: string;
  pembeli_npwp?: string;
  alamat?: string;
  npwp?: string;
  fp_diganti?: string;
  tgl_fp_diganti?: string;
  jenis_transaksi: string;
  jenis_status: string; // Normal or Pengganti
  no_invoice?: string;
  tarif_ppn: number;
  mata_uang: string; // IDR, USD
  kurs_pajak: number;
  penandatangan: string;
  jabatan: string;
  ket_tambahan: string;

  potongan: number;
  uang_muka: number;

  dpp?: number;
  dpp_rp?: number;
  ppn_rp?: number;

  create_date?: string;
  create_uid_name?: string;
  write_date?: string;
  write_uid_name?: string;

  lines?: FakturPajakLine[];
}

export const fakturPajakApi = {
  getAll: async (params?: any): Promise<FakturPajakData[]> => {
    const response = await axiosClient.post(
      "/api/faktur_pajak/get",
      params || {},
    );
    return response.data?.data || [];
  },

  save: async (data: FakturPajakData): Promise<{ id: number }> => {
    const response = await axiosClient.post("/api/faktur_pajak/save", data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosClient.post("/api/faktur_pajak/delete", { id });
  },
};
