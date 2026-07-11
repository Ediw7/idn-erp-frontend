import React, { useState } from "react";
import { Plus, Trash2, Edit2, Search, X, Save } from "lucide-react";
import { setupApi, GudangData } from "../api";
import { useMasterDataCRUD } from "../../../hooks/useMasterDataCRUD";
import { useConfirm } from "../../../contexts/ConfirmContext";

const SetupGudang: React.FC = () => {
  const confirm = useConfirm();
  const {
    list,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    editForm,
    setEditForm,
    handleAddNew,
    handleEdit,
    handleSave,
    handleDelete,
  } = useMasterDataCRUD<GudangData>({
    fetchApi: setupApi.getGudang,
    saveApi: setupApi.saveGudang,
    deleteApi: setupApi.deleteGudang,
    initialForm: {
      kode_gudang: "",
      nama_gudang: "",
      lokasi: "",
      is_default: false,
    },
    validate: (form) =>
      !form.kode_gudang || !form.nama_gudang
        ? "Kode Gudang dan Nama Gudang harus diisi!"
        : null,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = list.filter(
    (item) =>
      item.nama_gudang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_gudang.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDefaultChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const existingDefault = list.find(
        (g) => g.is_default && g.id !== editForm.id,
      );
      if (existingDefault) {
        const isConfirmed = await confirm(
          `Gudang "${existingDefault.nama_gudang}" saat ini adalah gudang default. Apakah Anda yakin ingin menggantinya?`,
        );
        if (!isConfirmed) return;
      }
    }
    setEditForm({ ...editForm, is_default: isChecked });
  };

  const inputClass =
    "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)] relative">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-white">Setup Gudang</h2>
          <p className="text-xs text-slate-300 mt-1">
            Kelola data gudang (warehouse) penyimpanan barang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors"
          >
            <Plus size={14} /> TAMBAH GUDANG
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Filter Gudang
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-8 py-1.5 border border-slate-300 rounded-sm text-sm w-72 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white"
              placeholder="Cari kode atau nama gudang..."
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
                <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32">
                  Kode Gudang
                </th>
                <th className="px-4 py-2 border-r border-slate-300 font-semibold">
                  Nama Gudang
                </th>
                <th className="px-4 py-2 border-r border-slate-300 font-semibold">
                  Lokasi
                </th>
                <th className="px-4 py-2 border-r border-slate-300 text-center font-semibold w-24">
                  Default
                </th>
                <th className="px-4 py-2 w-24 text-center font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">
                    Tidak ada data gudang
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-4 py-2 border-r border-slate-200 font-medium">
                      {row.kode_gudang}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200">
                      {row.nama_gudang}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200">
                      {row.lokasi || "-"}
                    </td>
                    <td className="px-4 py-2 border-r border-slate-200 text-center">
                      {row.is_default ? (
                        <span className="inline-block w-4 h-4 rounded bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </span>
                      ) : (
                        "-"
                      )}
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

      {/* Form Dialog/Modal Overlay */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-slate-900/20  z-30 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 shadow-xl rounded-sm w-full max-w-md flex flex-col overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm">
                {editForm.id ? "UBAH Gudang" : "Tambah Gudang Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Gudang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.kode_gudang}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      kode_gudang: e.target.value.toUpperCase(),
                    })
                  }
                  className={inputClass}
                  placeholder="Contoh: KP"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Gudang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.nama_gudang}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nama_gudang: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Contoh: Gudang Kapuk"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={editForm.lokasi}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lokasi: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Contoh: Jakarta"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_default_gudang"
                  checked={editForm.is_default}
                  onChange={handleDefaultChange}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                />
                <label
                  htmlFor="is_default_gudang"
                  className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                >
                  Set sebagai Default Gudang
                </label>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                BATAL
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 border border-blue-700 hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <Save size={14} /> SIMPAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupGudang;
