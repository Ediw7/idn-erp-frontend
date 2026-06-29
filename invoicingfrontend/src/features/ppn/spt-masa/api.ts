import axiosClient from '../../../lib/axiosClient';

export interface SptMasa1111Data {
  id?: number;
  tahun: string;
  masa_awal: string;
  masa_akhir: string;
  pembetulan_ke: number;
  tanggal_spt: string;
  is_locked: boolean;

  dpp_ekspor: number;
  ppn_ekspor: number;
  dpp_dipungut_sendiri: number;
  ppn_dipungut_sendiri: number;
  dpp_dipungut_pemungut: number;
  ppn_dipungut_pemungut: number;
  dpp_tidak_dipungut: number;
  ppn_tidak_dipungut: number;
  dpp_dibebaskan: number;
  ppn_dibebaskan: number;

  dpp_tidak_terutang: number;

  ppn_disetor_dimuka: number;
  pajak_masukan_diperhitungkan: number;
  ppn_spt_dibetulkan: number;

  tgl_lunas_kurang_bayar: string;
  ntpn_kurang_bayar: string;

  lebih_bayar_pada: string;
  lebih_bayar_oleh: string;
  lebih_bayar_diminta_untuk: string;

  kompensasi_masa: string;
  kompensasi_tahun: string;

  restitusi_pasal_17c: string;
  restitusi_pasal_17d: string;
  restitusi_pasal_9_4c: boolean;

  membangun_dpp: number;
  membangun_ppn: number;
}

export const sptMasaApi = {
  getAll: async () => {
    const response = await axiosClient.post('/api/spt-masa/get', { jsonrpc: '2.0', params: {} });
    return (response.data.result?.data || []) as SptMasa1111Data[];
  },
  
  save: async (data: SptMasa1111Data) => {
    const response = await axiosClient.post('/api/spt-masa/create', { jsonrpc: '2.0', params: data });
    return response.data.result;
  },
  
  delete: async (id: number) => {
    const response = await axiosClient.post('/api/spt-masa/delete', { jsonrpc: '2.0', params: { id } });
    return response.data.result;
  }
};
