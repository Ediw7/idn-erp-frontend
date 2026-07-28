import axiosClient from "../../../lib/axiosClient";

export const getFakturPajak = async (params: any = {}) => {
  const res = await axiosClient.get("/api/faktur_pajak", { params });
  return res.data;
};

export const getFakturPajakById = async (id: number) => {
  const res = await axiosClient.get(`/api/faktur_pajak/${id}`);
  return res.data;
};

export const createFakturPajak = async (data: any) => {
  const res = await axiosClient.post("/api/faktur_pajak", data);
  return res.data;
};

export const updateFakturPajak = async (id: number, data: any) => {
  const res = await axiosClient.put(`/api/faktur_pajak/${id}`, data);
  return res.data;
};

export const deleteFakturPajak = async (id: number) => {
  const res = await axiosClient.delete(`/api/faktur_pajak/${id}`);
  return res.data;
};

export const autoNoFp = async (
  penomoran: string,
  kode_transaksi: string,
  kode_status: string,
) => {
  const res = await axiosClient.post("/api/faktur_pajak/auto-no", {
    penomoran,
    kode_transaksi,
    kode_status,
  });
  return res.data;
};
