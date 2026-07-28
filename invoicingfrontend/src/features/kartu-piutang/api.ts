import axiosClient from "../../lib/axiosClient";

export interface RiwayatPiutang {
  id: string;
  tanggal: string;
  no_invoice: string;
  no_ref: string;
  keterangan: string;
  debet: number;
  kredit: number;
}

export const kartuPiutangApi = {
  getRiwayat: async (
    pelanggan_id: number,
    mata_uang: string,
  ): Promise<RiwayatPiutang[]> => {
    const res = await axiosClient.get("/api/piutang/kartu", {
      params: { pelanggan_id, mata_uang },
    });
    return res.data.data;
  },
};
