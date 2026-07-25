import axiosClient from "../../lib/axiosClient";

export const getNotaKredit = async (params: any = {}) => {
  const res = await axiosClient.get("/api/nota-kredit", { params });
  return res.data;
};

export const getNotaKreditById = async (id: number) => {
  const res = await axiosClient.get(`/api/nota-kredit/${id}`);
  return res.data;
};

export const createNotaKredit = async (data: any) => {
  const res = await axiosClient.post("/api/nota-kredit", data);
  return res.data;
};

export const updateNotaKredit = async (id: number, data: any) => {
  const res = await axiosClient.put(`/api/nota-kredit/${id}`, data);
  return res.data;
};

export const deleteNotaKredit = async (id: number) => {
  const res = await axiosClient.delete(`/api/nota-kredit/${id}`);
  return res.data;
};

export const getAutoNo = async (periode?: string) => {
  const res = await axiosClient.get("/api/nota-kredit/auto-no", { params: { periode } });
  return res.data;
};
