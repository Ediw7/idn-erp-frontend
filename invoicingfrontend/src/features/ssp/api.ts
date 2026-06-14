import axiosClient from '../../lib/axiosClient';

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
    const response = await axiosClient.post('/api/ssp/get', {});
    return response.data.data as SuratSetoranPajakData[];
  },
  
  save: async (data: SuratSetoranPajakData) => {
    const response = await axiosClient.post('/api/ssp/create', data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await axiosClient.post('/api/ssp/delete', { id });
    return response.data;
  }
};
