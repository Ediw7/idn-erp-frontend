import axiosClient from '../lib/axiosClient';

// --- INVOICE ---
export const getInvoices = async () => {
  const response = await axiosClient.get('/api/invoice/get');
  return response.data?.data || [];
};

export const saveInvoice = async (data: any) => {
  const response = await axiosClient.post('/api/invoice/save', data);
  return response.data;
};

// --- SURAT JALAN ---
export const getSuratJalan = async () => {
  const response = await axiosClient.get('/api/surat_jalan/get');
  return response.data?.data || [];
};

export const saveSuratJalan = async (data: any) => {
  const response = await axiosClient.post('/api/surat_jalan/save', data);
  return response.data;
};

// --- KWITANSI ---
export const getKwitansi = async () => {
  const response = await axiosClient.get('/api/kwitansi/get');
  return response.data?.data || [];
};

export const saveKwitansi = async (data: any) => {
  const response = await axiosClient.post('/api/kwitansi/save', data);
  return response.data;
};

// --- PEMBAYARAN PIUTANG ---
export const getPembayaran = async () => {
  const response = await axiosClient.get('/api/pembayaran/get');
  return response.data?.data || [];
};

export const savePembayaran = async (data: any) => {
  const response = await axiosClient.post('/api/pembayaran/save', data);
  return response.data;
};

// --- OUTSTANDING ---
export const getOutstanding = async (pelangganId?: number) => {
  const url = pelangganId ? `/api/outstanding/get?pelanggan_id=${pelangganId}` : '/api/outstanding/get';
  const response = await axiosClient.get(url);
  return response.data?.data || [];
};
