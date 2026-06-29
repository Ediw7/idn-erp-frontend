import axiosClient from '../../../lib/axiosClient';

export interface NotaReturPembelianLine {
  id?: number;
  item_id: number | null;
  kode_barang?: string;
  nama_barang?: string;
  satuan?: string;
  kuantum: number;
  harga_satuan: number;
  harga_jual: number;
}

export interface NotaReturPembelianData {
  id?: number;
  no_nota: string;
  tgl_nota: string;
  supplier_id: number | null;
  supplier_nama?: string;
  alamat_penjual: string;
  jenis_retur: string;
  gudang_id: string;
  atas_no_fp: string;
  tgl_fp: string;
  mata_uang_id: number | null;
  mata_uang_kode?: string;
  kurs_pajak: number;
  tarif_ppn: number;
  jenis_transaksi: string;
  status: string;
  tanda_tangan: string;
  jabatan: string;
  lines: NotaReturPembelianLine[];
}

export const notaReturPembelianApi = {
  getAll: async () => {
    const response = await axiosClient.post('/api/nota-retur-pembelian/get', { jsonrpc: '2.0', params: {} });
    return (response.data.result?.data || []) as NotaReturPembelianData[];
  },
  
  save: async (data: NotaReturPembelianData) => {
    const response = await axiosClient.post('/api/nota-retur-pembelian/create', { jsonrpc: '2.0', params: data });
    return response.data.result;
  },
  
  delete: async (id: number) => {
    const response = await axiosClient.post('/api/nota-retur-pembelian/delete', { jsonrpc: '2.0', params: { id } });
    return response.data.result;
  },

  autoNo: async () => {
    const response = await axiosClient.post('/api/nota-retur-pembelian/autono', { jsonrpc: '2.0', params: {} });
    return response.data.result;
  }
};
