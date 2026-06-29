import axiosClient from '../../../lib/axiosClient';

export interface SuratSetoranPajakData {
  id?: number;
  kpp: string;
  nama_wp: string;
  npwp: string;
  alamat: string;
  kode_pos: string;
  tahun: string;
  bulan: string;
  kode_jenis_pajak: string;
  kode_jenis_pajak_desc: string;
  kode_jenis_setoran: string;
  kode_jenis_setoran_desc: string;
  uraian_pembayaran: string;
  no_ketetapan: string;
  ntpp: string;
  jumlah: number;
  tanggal: string;
  tanda_tangan: string;
  keterangan: string;
  ssp_pemungut: boolean;
}

export const sspApi = {
  getAll: async () => {
    const response = await axiosClient.post('/api/ssp/get', { jsonrpc: '2.0', params: {} });
    return (response.data.result?.data || []) as SuratSetoranPajakData[];
  },
  
  save: async (data: SuratSetoranPajakData) => {
    const response = await axiosClient.post('/api/ssp/create', { jsonrpc: '2.0', params: data });
    return response.data.result;
  },
  
  delete: async (id: number) => {
    const response = await axiosClient.post('/api/ssp/delete', { jsonrpc: '2.0', params: { id } });
    return response.data.result;
  }
};
