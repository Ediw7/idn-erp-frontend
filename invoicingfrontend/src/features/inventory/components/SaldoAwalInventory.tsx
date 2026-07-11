import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, X, Save } from "lucide-react";
import axiosClient from "../../../lib/axiosClient";
import { useConfirm } from "../../../contexts/ConfirmContext";
import toast from "react-hot-toast";

interface SaldoAwalInventoryLine {
  id?: number;
  item_id: number | null;
  item_kode: string;
  item_nama: string;
  satuan: string;
  quantity: number;
  hpp: number;
}

interface SaldoAwalInventoryData {
  id?: number;
  gudang_id: number | null;
  gudang_nama?: string;
  tanggal: string;
  keterangan: string;
  lines: SaldoAwalInventoryLine[];
}

interface GudangData {
  id: number;
  kode_gudang: string;
  nama_gudang: string;
}

interface ItemData {
  id: number;
  kode: string;
  nama: string;
  satuan: string;
}

const SaldoAwalInventory: React.FC = () => {
  const confirm = useConfirm();
  const [dataList, setDataList] = useState<SaldoAwalInventoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<SaldoAwalInventoryData>({
    gudang_id: null,
    tanggal: new Date().toISOString().split("T")[0],
    keterangan: "",
    lines: [],
  });

  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [showItemSearch, setShowItemSearch] = useState<number | null>(null);
  const [itemSearchQuery, setItemSearchQuery] = useState("");

  useEffect(() => {
    fetchLookups();
    fetchData();
  }, []);

  const fetchLookups = async () => {
    try {
      const [gudangRes, itemRes] = await Promise.all([
        axiosClient.post("/api/setup/gudang/get", {}),
        axiosClient.post("/api/setup/item/get", {}),
      ]);
      setGudangs(gudangRes.data.result?.data || []);
      setItems(itemRes.data.result?.data || []);
    } catch (error) {
      console.error("Failed to load lookups", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.post(
        "/api/inventory/saldo-awal/get",
        {},
      );
      setDataList(response.data.result?.data || []);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = dataList.filter(
    (item) =>
      (item.gudang_nama?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (item.keterangan?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      item.tanggal.includes(searchQuery),
  );

  const createEmptyLine = (): SaldoAwalInventoryLine => ({
    item_id: null,
    item_kode: "",
    item_nama: "",
    satuan: "",
    quantity: 0,
    hpp: 0,
  });

  const handleAddNew = () => {
    const defGudang = gudangs.find((g) => (g as any).is_default);
    setFormData({
      gudang_id: defGudang
        ? defGudang.id
        : gudangs.length > 0
          ? gudangs[0].id
          : null,
      tanggal: new Date().toISOString().split("T")[0],
      keterangan: "",
      lines: [createEmptyLine()],
    });
    setIsFormOpen(true);
  };

  const handleEdit = (record: SaldoAwalInventoryData) => {
    setFormData({
      ...record,
      lines:
        record.lines.length > 0
          ? [...record.lines, createEmptyLine()]
          : [createEmptyLine()],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm(
      "Apakah Anda yakin ingin menghapus data saldo awal ini?",
    );
    if (!isConfirmed) return;

    try {
      const response = await axiosClient.post(
        "/api/inventory/saldo-awal/HAPUS",
        { id },
      );
      if (response.data.result?.status === "success") {
        fetchData();
      } else {
        toast.error(response.data.result?.message || "Gagal menghapus data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data.");
    }
  };

  const handleSave = async () => {
    if (!formData.gudang_id || !formData.tanggal) {
      toast.error("Gudang dan Tanggal wajib diisi!");
      return;
    }

    const validLines = formData.lines.filter((l) => l.item_id !== null);
    if (validLines.length === 0) {
      toast.error("Minimal satu barang harus diisi!");
      return;
    }

    const dataToSave = { ...formData, lines: validLines };

    try {
      const response = await axiosClient.post(
        "/api/inventory/saldo-awal/SIMPAN",
        dataToSave,
      );
      if (response.data.result?.status === "success") {
        setIsFormOpen(false);
        fetchData();
      } else {
        toast.error(response.data.result?.message || "Gagal menyimpan data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleLineChange = (
    index: number,
    field: keyof SaldoAwalInventoryLine,
    value: any,
  ) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };

    if (
      index === newLines.length - 1 &&
      field === "item_id" &&
      value !== null
    ) {
      newLines.push(createEmptyLine());
    }

    setFormData({ ...formData, lines: newLines });
  };

  const selectItem = (index: number, item: ItemData) => {
    const newLines = [...formData.lines];
    newLines[index] = {
      ...newLines[index],
      item_id: item.id,
      item_kode: item.kode,
      item_nama: item.nama,
      satuan: item.satuan,
      quantity: newLines[index].quantity || 1,
      hpp: newLines[index].hpp || 0,
    };

    if (index === newLines.length - 1) {
      newLines.push(createEmptyLine());
    }

    setFormData({ ...formData, lines: newLines });
    setShowItemSearch(null);
  };

  const removeLine = (index: number) => {
    const newLines = [...formData.lines];
    newLines.splice(index, 1);
    if (newLines.length === 0) newLines.push(createEmptyLine());
    setFormData({ ...formData, lines: newLines });
  };

  const calcDocTotal = (lines: SaldoAwalInventoryLine[]) => {
    return lines.reduce((tot, l) => tot + (l.quantity || 0) * (l.hpp || 0), 0);
  };

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)] relative">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Saldo Awal Persediaan
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Kelola data saldo awal barang di gudang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
          >
            <Plus size={14} /> TAMBAH SALDO AWAL
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Filter Pencarian
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-sm text-sm w-72 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
              placeholder="Cari gudang, tanggal, keterangan..."
            />
            <Search
              size={14}
              className="absolute right-2.5 top-2.5 text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
              <tr>
                <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">
                  No
                </th>
                <th className="px-4 py-2 border-r border-slate-300 font-semibold">
                  Gudang
                </th>
                <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32">
                  Tanggal
                </th>
                <th className="px-4 py-2 border-r border-slate-300 font-semibold">
                  Keterangan
                </th>
                <th className="px-4 py-2 border-r border-slate-300 text-center font-semibold w-24">
                  Jml Item
                </th>
                <th className="px-4 py-2 border-r border-slate-300 text-right font-semibold w-40">
                  Total Saldo (IDR)
                </th>
                <th className="px-4 py-2 w-24 text-center font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-slate-500">
                    Tidak ada data saldo awal
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-r border-slate-200 text-center text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200 font-medium">
                      {row.gudang_nama || "-"}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200">
                      {row.tanggal}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200">
                      {row.keterangan || "-"}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200 text-center font-mono bg-slate-50">
                      {row.lines.length}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200 text-right font-bold text-slate-700 bg-slate-50">
                      {calcDocTotal(row.lines).toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-2 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-500 hover:text-blue-700 p-1 rounded transition-colors hover:bg-blue-50"
                        title="UBAH"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id!)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal/Overlay for Master-Detail */}
      {isFormOpen && (
        <div className="absolute inset-0 bg-slate-900/20 z-30 flex items-center justify-center p-6">
          <div className="bg-white border border-slate-300 shadow-2xl rounded-sm w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="font-semibold">
                {formData.id
                  ? "UBAH Saldo Awal Persediaan"
                  : "Tambah Saldo Awal Baru"}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              {/* Master Form Area */}
              <div className="p-4 grid grid-cols-2 gap-8 border-b-2 border-slate-300 shrink-0 bg-white">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center">
                    <label className="text-xs font-semibold text-slate-700 w-24">
                      Gudang
                    </label>
                    <select
                      value={formData.gudang_id || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          gudang_id: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-2 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 text-xs"
                    >
                      <option value="">-- Pilih Gudang --</option>
                      {gudangs.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.kode_gudang} - {g.nama_gudang}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="text-xs font-semibold text-slate-700 w-24">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) =>
                        setFormData({ ...formData, tanggal: e.target.value })
                      }
                      className="w-40 px-2 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start">
                    <label className="text-xs font-semibold text-slate-700 w-24 pt-1">
                      Keterangan
                    </label>
                    <textarea
                      value={formData.keterangan}
                      onChange={(e) =>
                        setFormData({ ...formData, keterangan: e.target.value })
                      }
                      rows={2}
                      className="flex-1 px-2 py-1.5 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Inline Grid Area */}
              <div className="flex-1 overflow-auto bg-white p-4">
                <table className="w-full text-left border-collapse whitespace-nowrap min-w-max border border-slate-300">
                  <thead className="bg-slate-200 text-slate-800 sticky top-0 z-10 shadow-sm border-b border-slate-400">
                    <tr>
                      <th className="w-10 border-r border-slate-300 py-2 text-center font-bold text-xs">
                        No
                      </th>
                      <th className="w-48 border-r border-slate-300 px-3 py-2 font-bold text-xs">
                        Kode Barang
                      </th>
                      <th className="w-80 border-r border-slate-300 px-3 py-2 font-bold text-xs">
                        Nama Barang
                      </th>
                      <th className="w-20 border-r border-slate-300 px-3 py-2 text-center font-bold text-xs">
                        Satuan
                      </th>
                      <th className="w-32 border-r border-slate-300 px-3 py-2 text-right font-bold text-xs">
                        Quantity
                      </th>
                      <th className="w-32 border-r border-slate-300 px-3 py-2 text-right font-bold text-xs">
                        HPP
                      </th>
                      <th className="w-40 border-r border-slate-300 px-3 py-2 text-right font-bold text-xs">
                        Jumlah HPP
                      </th>
                      <th className="w-12 py-2 text-center font-bold text-xs">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {formData.lines.map((line, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 focus-within:bg-blue-50"
                      >
                        <td className="w-10 border-r border-slate-300 text-center py-1.5 text-slate-500 bg-slate-100">
                          {index + 1}
                        </td>

                        <td className="w-48 border-r border-slate-300 p-0 relative">
                          <div className="flex h-full w-full">
                            <input
                              type="text"
                              value={line.item_kode}
                              onChange={(e) =>
                                handleLineChange(
                                  index,
                                  "item_kode",
                                  e.target.value,
                                )
                              }
                              className="flex-1 w-full px-2 py-1.5 outline-none bg-transparent"
                              placeholder={
                                index === formData.lines.length - 1
                                  ? "Pilih barang..."
                                  : ""
                              }
                            />
                            <button
                              onClick={() => {
                                setShowItemSearch(index);
                                setItemSearchQuery("");
                              }}
                              className="px-2 bg-slate-200 border-l border-slate-300 hover:bg-slate-300 transition-colors"
                            >
                              <Search size={12} className="text-slate-600" />
                            </button>
                          </div>

                          {showItemSearch === index && (
                            <div className="absolute left-0 top-full mt-1 w-96 bg-white border border-slate-400 shadow-xl z-50 rounded-sm">
                              <div className="p-2 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                                <input
                                  type="text"
                                  autoFocus
                                  placeholder="Cari kode atau nama item..."
                                  value={itemSearchQuery}
                                  onChange={(e) =>
                                    setItemSearchQuery(e.target.value)
                                  }
                                  className="w-full px-2 py-1.5 text-xs border border-slate-300 focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => setShowItemSearch(null)}
                                  className="ml-2 text-slate-500 hover:text-red-500"
                                >
                                  X
                                </button>
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {items
                                  .filter(
                                    (i) =>
                                      i.kode
                                        .toLowerCase()
                                        .includes(
                                          itemSearchQuery.toLowerCase(),
                                        ) ||
                                      i.nama
                                        .toLowerCase()
                                        .includes(
                                          itemSearchQuery.toLowerCase(),
                                        ),
                                  )
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      onClick={() => selectItem(index, item)}
                                      className="px-3 py-2 border-b border-slate-100 hover:bg-blue-100 cursor-pointer text-xs flex justify-between"
                                    >
                                      <span className="font-mono font-bold text-slate-700">
                                        {item.kode}
                                      </span>
                                      <span className="text-slate-600 truncate max-w-[200px]">
                                        {item.nama}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </td>

                        <td
                          className="w-80 border-r border-slate-300 px-3 py-1.5 bg-slate-50 text-slate-600 truncate"
                          title={line.item_nama}
                        >
                          {line.item_nama}
                        </td>
                        <td className="w-20 border-r border-slate-300 px-3 py-1.5 text-center bg-slate-50 text-slate-600">
                          {line.satuan}
                        </td>
                        <td className="w-32 border-r border-slate-300 p-0">
                          <input
                            type="number"
                            value={line.quantity === 0 ? "" : line.quantity}
                            onChange={(e) =>
                              handleLineChange(
                                index,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-3 py-1.5 outline-none bg-transparent text-right"
                          />
                        </td>
                        <td className="w-32 border-r border-slate-300 p-0">
                          <input
                            type="number"
                            value={line.hpp === 0 ? "" : line.hpp}
                            onChange={(e) =>
                              handleLineChange(
                                index,
                                "hpp",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-3 py-1.5 outline-none bg-transparent text-right"
                          />
                        </td>
                        <td className="w-40 border-r border-slate-300 px-3 py-1.5 text-right bg-slate-50 text-slate-800 font-bold">
                          {(
                            (line.quantity || 0) * (line.hpp || 0)
                          ).toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="w-12 text-center py-1.5">
                          {index !== formData.lines.length - 1 && (
                            <button
                              onClick={() => removeLine(index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-100 border-t border-slate-300 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center border border-slate-300 bg-white shadow-sm">
                <span className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 border-r border-slate-300">
                  TOTAL KESELURUHAN (IDR)
                </span>
                <span className="px-6 py-1.5 text-sm font-bold text-slate-900">
                  {calcDocTotal(formData.lines).toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  BATAL
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2 text-xs font-bold text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
                >
                  <Save size={14} /> SIMPAN DATA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaldoAwalInventory;
