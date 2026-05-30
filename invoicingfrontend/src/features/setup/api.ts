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

export interface PreferensiData {
  folderDatabase?: string;
  fileDatabase?: string;
  folderBackupData?: string;
  folderCsvFaktur?: string;
  namaFileLogo?: string;
  lebarLogo?: number;
  tinggiLogo?: number;
  dokumenPemotonganInventory?: string;
  validasiQtyMinusSj?: boolean;
  validasiQtyMinusSo?: boolean;
  tarifPpn?: number;
  tarifPph22?: number;
  kodeCabangFp?: string;
  selisihHariInvoiceFaktur?: number;
  notifSisaFakturKurangDari?: number;
  desimalKuantum?: number;
  desimalHargaSatuan?: number;
  desimalJumlah?: number;
  umurPiutang1Sd?: number;
  umurPiutang2Mulai?: number;
  umurPiutang2Sd?: number;
  umurPiutang3Mulai?: number;
  umurPiutang3Sd?: number;
  umurPiutang4Mulai?: number;
  umurPiutang4Sd?: number;
  umurPiutang5Mulai?: number;
  perkPiutang?: string;
  perkPenjualan?: string;
  perkUangMukaPenj?: string;
  perkDiscPenjualan?: string;
  perkPpn?: string;
  perkPph22?: string;
  ketLembar3Fp?: string;
  ketLembar4Fp?: string;
  footerInvoiceVat?: string;
  footerInvoiceNonVat?: string;
  footerKwitansiVat?: string;
  footerKwitansiNonVat?: string;
}

export interface MataUangData {
  id?: number;
  kode: string;
  nama: string;
  per: string;
}

export interface KursPajakData {
  id?: number;
  mata_uang_id: number;
  tgl_dari: string;
  tgl_sd: string;
  kurs: number | string;
  no_kmk: string;
  tgl_kmk: string;
}

export interface TandaTanganData {
  id?: number;
  jenis_formulir: string;
  nama: string;
  jabatan: string;
  lokasi: string;
  ttd_image?: string | null;
}

export interface PerkiraanData {
  id?: number;
  no_perkiraan: string;
  nama_perkiraan: string;
  kas_bank: boolean;
}

export const setupApi = {
  getPerusahaan: async (): Promise<CompanyData> => {
    const response = await axiosClient.post('/api/setup/perusahaan/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch perusahaan');
  },

  updatePerusahaan: async (data: CompanyData): Promise<{ message: string; id: number }> => {
    const response = await axiosClient.post('/api/setup/perusahaan/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to update perusahaan');
  },

  getPreferensi: async (): Promise<PreferensiData> => {
    const response = await axiosClient.post('/api/setup/preferensi/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch preferensi');
  },

  updatePreferensi: async (data: PreferensiData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/preferensi/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to update preferensi');
  },

  getMataUang: async (): Promise<MataUangData[]> => {
    const response = await axiosClient.post('/api/setup/matauang/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch mata uang');
  },

  saveMataUang: async (data: MataUangData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/matauang/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to save mata uang');
  },

  deleteMataUang: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/matauang/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to delete mata uang');
  },

  getKursPajak: async (mata_uang_id: number): Promise<KursPajakData[]> => {
    const response = await axiosClient.post('/api/setup/kurspajak/get', {
      jsonrpc: '2.0',
      params: { mata_uang_id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch kurs pajak');
  },

  saveKursPajak: async (data: KursPajakData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/kurspajak/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to save kurs pajak');
  },

  deleteKursPajak: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/kurspajak/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to delete kurs pajak');
  },

  getTandaTangan: async (): Promise<TandaTanganData[]> => {
    const response = await axiosClient.post('/api/setup/tandatangan/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch tanda tangan');
  },

  saveTandaTangan: async (data: TandaTanganData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/tandatangan/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to save tanda tangan');
  },

  deleteTandaTangan: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/tandatangan/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to delete tanda tangan');
  },

  getPerkiraan: async (filters?: { no_perkiraan?: string; nama_perkiraan?: string }): Promise<PerkiraanData[]> => {
    const response = await axiosClient.post('/api/setup/perkiraan/get', {
      jsonrpc: '2.0',
      params: filters || {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch perkiraan');
  },

  savePerkiraan: async (data: PerkiraanData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/perkiraan/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to save perkiraan');
  },

  deletePerkiraan: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/perkiraan/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to delete perkiraan');
  }
};
