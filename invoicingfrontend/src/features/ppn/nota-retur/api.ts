import axiosClient from '../../../lib/axiosClient';

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
    const response = await axiosClient.post('/api/nota-retur/get', {});
    return response.data.data as NotaReturData[];
  },
  
  save: async (data: NotaReturData) => {
    const response = await axiosClient.post('/api/nota-retur/create', data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await axiosClient.post('/api/nota-retur/delete', { id });
    return response.data;
  },

  autoNo: async () => {
    const response = await axiosClient.post('/api/nota-retur/autono', {});
    return response.data;
  }
};
