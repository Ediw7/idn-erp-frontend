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

export interface GudangData {
  id?: number;
  kode_gudang: string;
  nama_gudang: string;
  lokasi: string;
  is_default: boolean;
}

export interface GroupBarangData {
  id?: number;
  nama: string;
}

export interface ItemData {
  id?: number;
  kode: string;
  nama: string;
  group_barang_id?: number | null;
  group_barang_nama?: string;
  satuan: string;
  harga_jual_1: number;
  harga_jual_2: number;
  harga_jual_3: number;
  supplier_utama: string;
  perk_penjualan_id?: number | null;
  perk_penjualan_nama?: string;
  perk_hpp_id?: number | null;
  perk_hpp_nama?: string;
  is_inventory: boolean;
}

export interface PembayaranData {
  id?: number;
  kode: string;
  nama: string;
  hari_jatuh_tempo: number;
}

export interface PelangganData {
  [key: string]: any;
  id?: number;
  kode: string;
  is_ekspor?: boolean;
  nama: string;
  alamat?: string;
  telepon?: string;
  fax?: string;
  alamat_kirim?: string;
  telepon_kirim?: string;
  fax_kirim?: string;
  nama_wp?: string;
  npwp?: string;
  nik?: string;
  alamat_wp?: string;
  jenis_transaksi?: string;
  ket_tambahan?: string;
  email?: string;
  contact_person?: string;
  no_hp?: string;
  jabatan?: string;
  pembayaran_id?: number | null;
  pembayaran_nama?: string;
  tingkat_harga?: string;
  diskon?: number;
  perk_piutang_id?: number | null;
  perk_piutang_nama?: string;
  keterangan?: string;
}

export interface SupplierData {
  id?: number;
  kode: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  fax?: string;
  email?: string;
  contact_person?: string;
  no_hp?: string;
  nama_wp?: string;
  alamat_wp?: string;
  npwp?: string;
  tgl_pengukuhan?: string;
  no_seri_fp_masukan?: string;
  is_pkp: boolean;
  jenis_transaksi?: string;
  pembayaran_id?: number | null;
  pembayaran_nama?: string;
  keterangan?: string;
}

export interface ProyekData {
  id?: number;
  kode: string;
  nama: string;
}

export interface SalesmanData {
  id?: number;
  kode: string;
  nama: string;
}

export interface JenisPotonganData {
  id?: number;
  kode: string;
  nama: string;
  perkiraan_id?: number | null;
  perkiraan_nama?: string;
}

export interface FormatBuktiData {
  id?: number;
  periode: string;
  inv_vat_prefiks?: string; inv_vat_digit?: string; inv_vat_sufiks?: string;
  inv_non_vat_prefiks?: string; inv_non_vat_digit?: string; inv_non_vat_sufiks?: string;
  kwi_vat_prefiks?: string; kwi_vat_digit?: string; kwi_vat_sufiks?: string;
  kwi_non_vat_prefiks?: string; kwi_non_vat_digit?: string; kwi_non_vat_sufiks?: string;
  pem_inv_prefiks?: string; pem_inv_digit?: string; pem_inv_sufiks?: string;
  nota_kredit_prefiks?: string; nota_kredit_digit?: string; nota_kredit_sufiks?: string;
  so_prefiks?: string; so_digit?: string; so_sufiks?: string;
  sj_prefiks?: string; sj_digit?: string; sj_sufiks?: string;
  retur_jual_prefiks?: string; retur_jual_digit?: string; retur_jual_sufiks?: string;
  retur_beli_prefiks?: string; retur_beli_digit?: string; retur_beli_sufiks?: string;
  terima_brg_prefiks?: string; terima_brg_digit?: string; terima_brg_sufiks?: string;
  adj_inv_prefiks?: string; adj_inv_digit?: string; adj_inv_sufiks?: string;
  tf_brg_prefiks?: string; tf_brg_digit?: string; tf_brg_sufiks?: string;
}

export interface FakturPajakData {
  id?: number;
  no_surat: string;
  tgl_surat: string;
  tgl_awal: string;
  tgl_akhir: string;
  no_seri_awal: string;
  no_seri_akhir: string;
}

export interface JenisPajakData {
  id?: number;
  kode: string;
  nama: string;
}

export interface JenisSetoranData {
  id?: number;
  jenis_pajak_id?: number | null;
  jenis_pajak_kode?: string;
  jenis_pajak_nama?: string;
  kode: string;
  nama: string;
}

export interface BahasaData {
  id?: number;
  jenis_objek: string;
  nama_objek: string;
  default_sistem: string;
  judul_kustom: string;
}

export const setupApi = {
  getPerusahaan: async (): Promise<CompanyData> => {
    const response = await axiosClient.get('/api/setup/perusahaan/get');
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch perusahaan');
  },

  updatePerusahaan: async (data: CompanyData): Promise<{ message: string; id: number }> => {
    const response = await axiosClient.post('/api/setup/perusahaan/save', data);
    if (response.data.status === 'success') {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to PERBARUI perusahaan');
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
    throw new Error(response.data.result?.message || 'Failed to PERBARUI preferensi');
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
    throw new Error(response.data.result?.message || 'Failed to SIMPAN mata uang');
  },

  deleteMataUang: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/matauang/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS mata uang');
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
    throw new Error(response.data.result?.message || 'Failed to SIMPAN kurs pajak');
  },

  deleteKursPajak: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/kurspajak/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS kurs pajak');
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
    throw new Error(response.data.result?.message || 'Failed to SIMPAN tanda tangan');
  },

  deleteTandaTangan: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/tandatangan/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS tanda tangan');
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
    throw new Error(response.data.result?.message || 'Failed to SIMPAN perkiraan');
  },

  deletePerkiraan: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/perkiraan/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS perkiraan');
  },

  getGudang: async (): Promise<GudangData[]> => {
    const response = await axiosClient.post('/api/setup/gudang/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch gudang');
  },

  saveGudang: async (data: GudangData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/gudang/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN gudang');
  },

  deleteGudang: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/gudang/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS gudang');
  },

  getGroupBarang: async (): Promise<GroupBarangData[]> => {
    const response = await axiosClient.post('/api/setup/groupbarang/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch group barang');
  },

  saveGroupBarang: async (data: GroupBarangData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/groupbarang/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN group barang');
  },

  deleteGroupBarang: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/groupbarang/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS group barang');
  },

  getItem: async (filters?: { kode?: string; nama?: string; group_barang_id?: number | string }): Promise<ItemData[]> => {
    const response = await axiosClient.post('/api/setup/item/get', {
      jsonrpc: '2.0',
      params: filters || {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch item');
  },

  saveItem: async (data: ItemData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/item/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN item');
  },

  deleteItem: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/item/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS item');
  },

  getPembayaran: async (): Promise<PembayaranData[]> => {
    const response = await axiosClient.post('/api/setup/pembayaran/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch pembayaran');
  },

  savePembayaran: async (data: PembayaranData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/pembayaran/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN pembayaran');
  },

  deletePembayaran: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/pembayaran/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS pembayaran');
  },

  getPelanggan: async (): Promise<PelangganData[]> => {
    const response = await axiosClient.post('/api/setup/pelanggan/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch pelanggan');
  },

  savePelanggan: async (data: PelangganData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/pelanggan/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN pelanggan');
  },

  deletePelanggan: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/pelanggan/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS pelanggan');
  },

  importBatchPelanggan: async (items: Partial<PelangganData>[]): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/pelanggan/import_batch', {
      jsonrpc: '2.0',
      params: { items }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to import pelanggan');
  },

  getSupplier: async (): Promise<SupplierData[]> => {
    const response = await axiosClient.post('/api/setup/supplier/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch supplier');
  },

  saveSupplier: async (data: SupplierData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/supplier/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN supplier');
  },

  deleteSupplier: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/supplier/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS supplier');
  },

  getProyek: async (): Promise<ProyekData[]> => {
    const response = await axiosClient.post('/api/setup/proyek/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch proyek');
  },

  saveProyek: async (data: ProyekData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/proyek/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN proyek');
  },

  deleteProyek: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/proyek/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS proyek');
  },

  getSalesman: async (): Promise<SalesmanData[]> => {
    const response = await axiosClient.post('/api/setup/salesman/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch salesman');
  },

  saveSalesman: async (data: SalesmanData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/salesman/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN salesman');
  },

  deleteSalesman: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/salesman/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS salesman');
  },

  getJenisPotongan: async (): Promise<JenisPotonganData[]> => {
    const response = await axiosClient.post('/api/setup/jenis_potongan/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch jenis potongan');
  },

  saveJenisPotongan: async (data: JenisPotonganData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/jenis_potongan/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN jenis potongan');
  },

  deleteJenisPotongan: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/jenis_potongan/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS jenis potongan');
  },

  getFormatBukti: async (): Promise<FormatBuktiData[]> => {
    const response = await axiosClient.post('/api/setup/format_bukti/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch format bukti');
  },

  saveFormatBukti: async (data: FormatBuktiData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/format_bukti/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN format bukti');
  },

  deleteFormatBukti: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/format_bukti/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS format bukti');
  },

  getFakturPajak: async (): Promise<FakturPajakData[]> => {
    const response = await axiosClient.post('/api/setup/faktur_pajak/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch faktur pajak');
  },

  saveFakturPajak: async (data: FakturPajakData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/faktur_pajak/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN faktur pajak');
  },

  deleteFakturPajak: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/faktur_pajak/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS faktur pajak');
  },

  getJenisPajak: async (): Promise<JenisPajakData[]> => {
    const response = await axiosClient.post('/api/setup/jenis_pajak/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch jenis pajak');
  },

  saveJenisPajak: async (data: JenisPajakData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/jenis_pajak/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN jenis pajak');
  },

  deleteJenisPajak: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/jenis_pajak/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS jenis pajak');
  },

  getJenisSetoran: async (): Promise<JenisSetoranData[]> => {
    const response = await axiosClient.post('/api/setup/jenis_setoran/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch jenis setoran');
  },

  saveJenisSetoran: async (data: JenisSetoranData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/jenis_setoran/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN jenis setoran');
  },

  deleteJenisSetoran: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/jenis_setoran/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS jenis setoran');
  },

  getBahasa: async (): Promise<BahasaData[]> => {
    const response = await axiosClient.post('/api/setup/bahasa/get', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch setup bahasa');
  },

  saveBahasa: async (data: BahasaData): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/bahasa/save', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN setup bahasa');
  },

  deleteBahasa: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/setup/bahasa/delete', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to delete setup bahasa');
  }
};
