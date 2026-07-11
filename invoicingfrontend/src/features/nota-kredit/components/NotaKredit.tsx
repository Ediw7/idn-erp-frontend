import React, { useState, useEffect, useMemo } from "react";
import { Search, Save, FileText, X, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setupApi, TandaTanganData } from "../../setup/api";

interface DetailRow {
  id: string;
  keterangan: string;
  jumlahStr: string;
  noPerkiraan: string;
}

const dummyPelanggan = [
  {
    id: "CUST-001",
    nama: "PT Maju Bersama",
    alamat: "Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10220",
  },
  {
    id: "CUST-002",
    nama: "CV Sentosa",
    alamat: "Jl. Merdeka No. 45, Bandung, Jawa Barat 40111",
  },
];

const dummyInvoice = [
  { noInvoice: "INV-2025-001", pelangganId: "CUST-001" },
  { noInvoice: "INV-2025-002", pelangganId: "CUST-001" },
  { noInvoice: "INV-2026-001", pelangganId: "CUST-002" },
];

const dummyPerkiraan = [
  { id: "4101", nama: "Penjualan Barang" },
  { id: "4102", nama: "Potongan Penjualan" },
  { id: "4103", nama: "Retur Penjualan" },
];

const NotaKredit: React.FC = () => {
  const navigate = useNavigate();

  const [ttdList, setTtdList] = useState<TandaTanganData[]>([]);
  const [selectedTtdId, setSelectedTtdId] = useState<number | "">("");

  const [pelangganId, setPelangganId] = useState("");
  const [alamat, setAlamat] = useState("");
  const [invoiceId, setInvoiceId] = useState("");

  const [details, setDetails] = useState<DetailRow[]>([
    { id: "1", keterangan: "", jumlahStr: "", noPerkiraan: "" },
  ]);

  useEffect(() => {
    const fetchTtd = async () => {
      try {
        const data = await setupApi.getTandaTangan();
        const nkTtd = data.filter((d) => d.jenis_formulir === "Nota Kredit");
        setTtdList(nkTtd.length > 0 ? nkTtd : data);
        if (nkTtd.length > 0 && nkTtd[0].id) {
          setSelectedTtdId(nkTtd[0].id);
        } else if (data.length > 0 && data[0].id) {
          setSelectedTtdId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch tanda tangan:", error);
      }
    };
    fetchTtd();
  }, []);

  // Update Alamat when Pelanggan changes
  useEffect(() => {
    const cust = dummyPelanggan.find((c) => c.id === pelangganId);
    if (cust) {
      setAlamat(cust.alamat);
    } else {
      setAlamat("");
    }
    // Reset invoice if not belongs to customer
    setInvoiceId("");
  }, [pelangganId]);

  const availableInvoices = dummyInvoice.filter(
    (inv) => inv.pelangganId === pelangganId,
  );
  const selectedTtd = ttdList.find((t) => t.id === selectedTtdId);

  const formatCurrency = (num: number) => {
    if (isNaN(num)) return "0.00";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const parseCurrency = (str: string) => {
    const parsed = parseFloat(str.replace(/,/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  // Calculate total Nilai Nota Kredit dynamically based on details
  const totalNilai = useMemo(() => {
    return details.reduce(
      (sum, row) => sum + parseCurrency(row.jumlahStr || "0"),
      0,
    );
  }, [details]);

  const handleRowChange = (id: string, field: keyof DetailRow, value: any) => {
    setDetails((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const handleNumberChange = (id: string, val: string) => {
    let cleanVal = val.replace(/[^0-9.]/g, "");
    const parts = cleanVal.split(".");
    if (parts.length > 2) {
      cleanVal = parts[0] + "." + parts.slice(1).join("");
    }
    handleRowChange(id, "jumlahStr", cleanVal);
  };

  const handleNumberBlur = (id: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      handleRowChange(id, "jumlahStr", formatCurrency(num));
    } else {
      handleRowChange(id, "jumlahStr", "");
    }
  };

  const handleNumberFocus = (id: string, val: string) => {
    if (val) {
      handleRowChange(id, "jumlahStr", val.replace(/,/g, ""));
    }
  };

  const addRow = () => {
    setDetails([
      ...details,
      {
        id: Date.now().toString(),
        keterangan: "",
        jumlahStr: "",
        noPerkiraan: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    if (details.length > 1) {
      setDetails(details.filter((r) => r.id !== id));
    } else {
      // If last row, just clear it
      setDetails([
        {
          id: Date.now().toString(),
          keterangan: "",
          jumlahStr: "",
          noPerkiraan: "",
        },
      ]);
    }
  };

  const inputClass =
    "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const readOnlyClass =
    "w-full px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-300 focus:outline-none rounded-sm text-sm";
  const labelClass =
    "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-36";
  const btnPrimary =
    "px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-sm hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors";
  const btnSecondary =
    "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-bold rounded-sm hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 overflow-x-auto">
        <div className="flex items-center gap-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Nota Kredit</h2>
            <p className="text-xs text-slate-300 mt-1">
              Kelola data transaksi Nota Kredit pelanggan.
            </p>
          </div>
          <div className="h-8 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option></option>
            </select>
            <button className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600">
              +
            </button>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button
            onClick={() =>
              navigate("/laporan", {
                state: { initialReport: "Nota Kredit (1/2 Kwarto)" },
              })
            }
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap"
          >
            <FileText size={14} /> LAPORAN
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Header Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 mb-4 shrink-0">
          <div className="flex gap-12">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>No. Nota Kredit</label>
                <div className="flex gap-1 flex-1">
                  <input
                    type="text"
                    className={`${inputClass} font-semibold`}
                  />
                  <button className="px-2 bg-slate-100 border border-slate-300 rounded-sm hover:bg-slate-200">
                    <Search size={16} />
                  </button>
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">
                    Auto No
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tgl Nota Kredit</label>
                <input type="date" className={`${inputClass} w-40`} />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Nama Pelanggan</label>
                <select
                  className={inputClass}
                  value={pelangganId}
                  onChange={(e) => setPelangganId(e.target.value)}
                >
                  <option value="">- Pilih Pelanggan -</option>
                  {dummyPelanggan.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-start">
                <label className={labelClass}>Alamat</label>
                <textarea
                  className={`${readOnlyClass} h-16 resize-none`}
                  readOnly
                  value={alamat}
                />
              </div>

              <div className="flex items-center mt-2">
                <label className={labelClass}>Nilai Nota Kredit</label>
                <div className="flex gap-1 w-64 items-center">
                  <input
                    type="text"
                    className={`${readOnlyClass} w-16 text-center font-bold`}
                    value="IDR"
                    readOnly
                  />
                  <input
                    type="text"
                    className={`${readOnlyClass} flex-1 text-right font-bold`}
                    value={formatCurrency(totalNilai)}
                    readOnly
                  />
                </div>
              </div>

              {/* Record Info Box */}
              <div className="flex gap-4 mt-4">
                <div className="border border-slate-300 rounded-sm p-2 bg-slate-50 flex-1">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 border-b border-slate-200 pb-1">
                    Record Created
                  </div>
                  <div className="h-4 bg-white border border-slate-300 mb-1 px-1 text-[10px]"></div>
                  <div className="h-4 bg-white border border-slate-300 px-1 text-[10px]"></div>
                </div>
                <div className="border border-slate-300 rounded-sm p-2 bg-slate-50 flex-1">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1 border-b border-slate-200 pb-1">
                    Record Modified
                  </div>
                  <div className="h-4 bg-white border border-slate-300 mb-1 px-1 text-[10px]"></div>
                  <div className="h-4 bg-white border border-slate-300 px-1 text-[10px]"></div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>Atas No. Invoice</label>
                <div className="flex gap-1 flex-1">
                  <select
                    className={inputClass}
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                  >
                    <option value="">- Pilih Invoice -</option>
                    {availableInvoices.map((inv) => (
                      <option key={inv.noInvoice} value={inv.noInvoice}>
                        {inv.noInvoice}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>No. Referensi</label>
                <input type="text" className={inputClass} />
              </div>

              <div className="flex items-center mt-4">
                <label className={labelClass}>Tanda Tangan</label>
                <select
                  className={inputClass}
                  value={selectedTtdId}
                  onChange={(e) =>
                    setSelectedTtdId(
                      e.target.value ? Number(e.target.value) : "",
                    )
                  }
                >
                  <option value="" disabled>
                    Pilih Tanda Tangan...
                  </option>
                  {ttdList.map((ttd) => (
                    <option key={ttd.id} value={ttd.id}>
                      {ttd.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Jabatan</label>
                <input
                  type="text"
                  className={inputClass}
                  value={selectedTtd?.jabatan || ""}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[250px] overflow-hidden mb-4">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="w-10 px-2 py-2 text-center border-r border-slate-300 font-semibold">
                    No.
                  </th>
                  <th className="px-3 py-2 text-left border-r border-slate-300 min-w-[300px] font-semibold">
                    Keterangan
                  </th>
                  <th className="w-48 px-3 py-2 text-right border-r border-slate-300 font-semibold">
                    Jumlah
                  </th>
                  <th className="w-48 px-3 py-2 text-left border-r border-slate-300 font-semibold">
                    No Perkiraan
                  </th>
                  <th className="w-12 px-3 py-2 text-center font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {details.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-2 py-1 text-center border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                        value={row.keterangan}
                        onChange={(e) =>
                          handleRowChange(row.id, "keterangan", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200 text-right">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                        value={row.jumlahStr}
                        onChange={(e) =>
                          handleNumberChange(row.id, e.target.value)
                        }
                        onBlur={(e) => handleNumberBlur(row.id, e.target.value)}
                        onFocus={(e) =>
                          handleNumberFocus(row.id, e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200">
                      <select
                        className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs bg-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                        value={row.noPerkiraan}
                        onChange={(e) =>
                          handleRowChange(row.id, "noPerkiraan", e.target.value)
                        }
                      >
                        <option value="">- Pilih Perkiraan -</option>
                        {dummyPerkiraan.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.id} - {p.nama}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Add Row Button Row */}
                <tr className="border-b border-slate-200">
                  <td className="px-2 py-1 text-center border-r border-slate-200 text-slate-400 font-bold">
                    *
                  </td>
                  <td colSpan={4} className="px-2 py-1">
                    <button
                      onClick={addRow}
                      className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Tambah Baris
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 shrink-0">
          <button className={btnSecondary} onClick={() => navigate(-1)}>
            <X size={16} /> Batal
          </button>
          <button className={btnPrimary}>
            <Save size={16} /> Simpan Nota Kredit
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotaKredit;
