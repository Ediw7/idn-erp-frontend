import axiosClient from '../../lib/axiosClient';

export interface SalesOrderLine {
  id?: number;
  item_id: number | null;
  kode_barang?: string;
  nama_barang?: string;
  satuan: string;
  kuantum: number;
  harga_satuan: number;
  disc_persen: number;
  disc_harga: number;
  harga_jual?: number;
  keterangan: string;
  qty_kirim?: number;
}

export interface SalesOrderData {
  id?: number;
  no_so: string;
  tgl_so: string;
  pelanggan_id: number | null;
  pelanggan_nama?: string;
  pelanggan_alamat_kirim?: string;
  alamat_kirim: string;
  no_po: string;
  penandatangan?: string;
  jabatan?: string;
  tgl_po: string;
  mata_uang_id: number | null;
  mata_uang_kode?: string;
  pembayaran_id: number | null;
  pembayaran_nama?: string;
  salesman_id: number | null;
  salesman_nama?: string;
  tgl_kirim: string;
  dipesan_oleh: string;
  is_closed: boolean;
  is_void: boolean;
  keterangan: string;
  subtotal?: number;
  potongan_harga: number;
  ppn_persen: number;
  ppn_amount?: number;
  ppnbm_persen?: number;
  ppnbm_amount?: number;
  ongkos_angkut: number;
  total?: number;
  create_date?: string;
  create_uid_name?: string;
  write_date?: string;
  write_uid_name?: string;
  lines: SalesOrderLine[];
  surat_jalans?: any[];
}

export const salesOrderApi = {
  getAll: async (filters?: { no_so?: string; pelanggan_id?: number; periode?: string }): Promise<SalesOrderData[]> => {
    const response = await axiosClient.post('/api/sales-order/get', {
      jsonrpc: '2.0',
      params: filters || {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result.data;
    }
    throw new Error(response.data.result?.message || 'Failed to fetch sales orders');
  },

  save: async (data: SalesOrderData): Promise<{ message: string; id: number }> => {
    const response = await axiosClient.post('/api/sales-order/SIMPAN', {
      jsonrpc: '2.0',
      params: data
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to SIMPAN sales order');
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await axiosClient.post('/api/sales-order/HAPUS', {
      jsonrpc: '2.0',
      params: { id }
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to HAPUS sales order');
  },

  autoNo: async (): Promise<{ no_so: string }> => {
    const response = await axiosClient.post('/api/sales-order/auto-no', {
      jsonrpc: '2.0',
      params: {}
    });
    if (response.data.result && response.data.result.status === 'success') {
      return response.data.result;
    }
    throw new Error(response.data.result?.message || 'Failed to generate auto number');
  }
};
