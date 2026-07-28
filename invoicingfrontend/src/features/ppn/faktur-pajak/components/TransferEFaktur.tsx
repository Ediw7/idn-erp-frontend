import React, { useState, useMemo } from "react";
import axiosClient from "../../../../lib/axiosClient";
import toast from "react-hot-toast";
import { PageLayout } from "../../../../components/layouts/PageLayout";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-100 text-red-900 border border-red-500 rounded">
          <h1 className="text-2xl font-bold">Terjadi Kesalahan Runtime!</h1>
          <pre className="mt-4 p-4 bg-white border border-red-200 overflow-auto">
            {this.state.error?.toString()}
            <br />
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const TransferEFakturForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    jenis_pajak: "Pajak Keluaran",
    tahun: currentYear,
    bulan: "01",
    pembetulan: 0,
    fp_awal: "",
    fp_akhir: "",
  });

  const bulanOptions = [
    { v: "01", l: "Januari" },
    { v: "02", l: "Februari" },
    { v: "03", l: "Maret" },
    { v: "04", l: "April" },
    { v: "05", l: "Mei" },
    { v: "06", l: "Juni" },
    { v: "07", l: "Juli" },
    { v: "08", l: "Agustus" },
    { v: "09", l: "September" },
    { v: "10", l: "Oktober" },
    { v: "11", l: "November" },
    { v: "12", l: "Desember" },
  ];

  const jenisPajakOptions = [
    "Pajak Keluaran",
    "Pajak Masukan",
    "Retur Pajak Keluaran",
    "Retur Pajak Masukan",
  ];

  // Auto-generate file name based on current form state
  const outputFileName = useMemo(() => {
    const formattedJenis = form.jenis_pajak.replace(/\s+/g, "_");
    return `${formattedJenis}_${form.tahun}${form.bulan}.csv`;
  }, [form.jenis_pajak, form.tahun, form.bulan]);

  const handleExport = async () => {
    setIsLoading(true);
    const toastId = toast.loading("Memproses ekspor file CSV...");

    try {
      const response = await axiosClient.get("/api/export-efaktur", {
        params: {
          jenis_pajak: form.jenis_pajak,
          tahun: form.tahun,
          bulan: form.bulan,
          pembetulan: form.pembetulan,
          fp_awal: form.fp_awal,
          fp_akhir: form.fp_akhir,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      let downloadFileName = outputFileName;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition && contentDisposition.includes("filename=")) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition,
        );
        if (matches != null && matches[1]) {
          downloadFileName = matches[1].replace(/['"]/g, "");
        }
      }

      link.setAttribute("download", downloadFileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("File e-Faktur berhasil diekspor", { id: toastId });
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Gagal mengekspor data e-Faktur. Periksa parameter Anda.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatal = () => {
    setForm({
      jenis_pajak: "Pajak Keluaran",
      tahun: currentYear,
      bulan: "01",
      pembetulan: 0,
      fp_awal: "",
      fp_akhir: "",
    });
  };

  const inputClass =
    "w-full px-3 py-2 border border-slate-300 bg-white rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors disabled:opacity-50";
  const labelClass =
    "col-span-12 md:col-span-4 text-sm font-semibold text-slate-700";

  return (
    <PageLayout
      title="Transfer Data ke Program e-Faktur"
      contentClassName="flex-1 p-8 overflow-y-auto bg-slate-50 flex justify-center items-start"
    >
      <div className="w-full max-w-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-xl overflow-hidden mt-4">
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Ekspor Data e-Faktur
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Ekspor data faktur pajak ke format CSV sesuai Skema Impor DJP
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatal}
              disabled={isLoading}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={handleExport}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              Mulai Ekspor
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>Jenis Pajak</label>
            <div className="col-span-12 md:col-span-8">
              <select
                className={inputClass}
                value={form.jenis_pajak}
                onChange={(e) =>
                  setForm({ ...form, jenis_pajak: e.target.value })
                }
                disabled={isLoading}
              >
                {jenisPajakOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>Tahun</label>
            <div className="col-span-12 md:col-span-8">
              <input
                type="number"
                className={inputClass}
                value={form.tahun}
                onChange={(e) =>
                  setForm({ ...form, tahun: Number(e.target.value) })
                }
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>Bulan</label>
            <div className="col-span-12 md:col-span-8">
              <select
                className={inputClass}
                value={form.bulan}
                onChange={(e) => setForm({ ...form, bulan: e.target.value })}
                disabled={isLoading}
              >
                {bulanOptions.map((b) => (
                  <option key={b.v} value={b.v}>
                    {b.l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>Pembetulan</label>
            <div className="col-span-12 md:col-span-8">
              <input
                type="number"
                className={inputClass}
                value={form.pembetulan}
                onChange={(e) =>
                  setForm({ ...form, pembetulan: Number(e.target.value) })
                }
                disabled={isLoading}
                min={0}
              />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-6"></div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>No FP Awal</label>
            <div className="col-span-12 md:col-span-8">
              <input
                type="text"
                className={`${inputClass} font-mono`}
                value={form.fp_awal}
                onChange={(e) => setForm({ ...form, fp_awal: e.target.value })}
                placeholder="13 digit terakhir"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>No FP Akhir</label>
            <div className="col-span-12 md:col-span-8">
              <input
                type="text"
                className={`${inputClass} font-mono`}
                value={form.fp_akhir}
                onChange={(e) => setForm({ ...form, fp_akhir: e.target.value })}
                placeholder="13 digit terakhir"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="w-full h-px bg-slate-100 my-6"></div>

          {/* Generated File Output Name (Read-Only) */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <label className={labelClass}>Nama File Output</label>
            <div className="col-span-12 md:col-span-8">
              <input
                type="text"
                readOnly
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-md text-sm font-semibold focus:outline-none font-mono"
                value={outputFileName}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const TransferEFaktur: React.FC = () => {
  return (
    <ErrorBoundary>
      <TransferEFakturForm />
    </ErrorBoundary>
  );
};

export default TransferEFaktur;
