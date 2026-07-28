const BASE_URL = "http://localhost:8069/api/transfer-espt";

export const exportLampiran = (
  tahun: string,
  masa: string,
  pembetulan: string,
  jenisLampiran: string,
) => {
  const query = new URLSearchParams({
    tahun,
    masa,
    pembetulan,
    jenis_lampiran: jenisLampiran,
  }).toString();
  window.open(`${BASE_URL}/lampiran?${query}`, "_blank");
};

export const exportWajibPajak = () => {
  window.open(`${BASE_URL}/wp`, "_blank");
};

export const exportPPh22 = (
  tahun: string,
  masa: string,
  pembetulan: string,
) => {
  const query = new URLSearchParams({
    tahun,
    masa,
    pembetulan,
  }).toString();
  window.open(`${BASE_URL}/pph22?${query}`, "_blank");
};
