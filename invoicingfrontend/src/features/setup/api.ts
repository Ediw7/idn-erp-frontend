import axiosClient from '../../lib/axiosClient';

export interface CompanyData {
  id?: number;
  name: string;
  street: string;
  city?: string;
  zip?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  fax?: string;
  maks_pelanggan?: number;
  periode_serial?: string;
  no_serial?: string;
  npwp: string;
  nitku: string;
  nama_pkp?: string;
  kpp?: string;
  nppkp?: string;
  tgl_pengukuhan?: string;
  alamat_wp?: string;
  kota_wp?: string;
  kodepos_wp?: string;
  tahun_buku_start?: string;
  tahun_buku_end?: string;
  kode_klu?: string;
  wajib_ppnbm?: boolean;
}

export const setupApi = {
  getPerusahaan: async (): Promise<CompanyData> => {
    const response = await axiosClient.get<CompanyData>('/api/setup/perusahaan');
    return response.data;
  },

  updatePerusahaan: async (data: CompanyData): Promise<{ message: string; id: number }> => {
    const response = await axiosClient.post('/api/setup/perusahaan', data);
    return response.data;
  }
};
