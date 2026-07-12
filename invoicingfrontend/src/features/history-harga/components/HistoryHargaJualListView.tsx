import React, { useState, useEffect } from "react";
import { List, Search, X, FilePlus, Eye } from "lucide-react";
import { HistoryHargaJualData } from "../api";
import { setupApi, ItemData } from "../../setup/api";

interface HistoryHargaJualListViewProps {
  logic: any;
}

export const HistoryHargaJualListView: React.FC<
  HistoryHargaJualListViewProps
> = ({ logic }) => {
  // Modal states for Item Search
  const [searchModalKode, setSearchModalKode] = useState("");
  const [searchModalNama, setSearchModalNama] = useState("");
  const [searchModalGroup, setSearchModalGroup] = useState("");
  const [items, setItems] = useState<ItemData[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (logic.showItemModal) {
      const fetchItems = async () => {
        setLoadingItems(true);
        try {
          const res = await setupApi.getItem();
          setItems(res);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingItems(false);
        }
      };
      fetchItems();
    }
  }, [logic.showItemModal]);

  const filteredItems = items.filter((it) => {
    const matchKode = it.kode
      .toLowerCase()
      .includes(searchModalKode.toLowerCase());
    const matchNama = it.nama
      .toLowerCase()
      .includes(searchModalNama.toLowerCase());
    const matchGroup = (it.group_barang_nama || "")
      .toLowerCase()
      .includes(searchModalGroup.toLowerCase());
    return matchKode && matchNama && matchGroup;
  });

  const selectItem = (item: ItemData) => {
    if (!item) return;
    logic.setKodeBarang(item.kode);
    logic.setNamaBarang(item.nama);
    logic.setShowItemModal(false);
  };

  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Modern Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">
            Cek History Harga Jual
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Barang:
              </span>
              <div className="flex items-center relative">
                <input
                  type="text"
                  placeholder="Kode / Nama"
                  className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-40 placeholder-slate-500"
                  value={logic.kodeBarang || logic.namaBarang}
                  onChange={(e) => {
                    logic.setKodeBarang(e.target.value);
                    logic.setNamaBarang(e.target.value);
                  }}
                />
                <button
                  onClick={() => logic.setShowItemModal(true)}
                  className="absolute right-1 text-slate-400 hover:text-white"
                >
                  <Search size={12} />
                </button>
              </div>
            </div>

            <div className="h-4 w-px bg-slate-600"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">
                Pelanggan:
              </span>
              <input
                type="text"
                placeholder="Nama Pelanggan"
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400 w-40 placeholder-slate-500"
                value={logic.namaPelanggan}
                onChange={(e) => logic.setNamaPelanggan(e.target.value)}
              />
            </div>

            <div className="h-4 w-px bg-slate-600"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium">Bulan:</span>
              <select
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
                value={logic.periode.split("-")[1]}
                onChange={(e) =>
                  logic.setPeriode(
                    `${logic.periode.split("-")[0]}-${e.target.value}`,
                  )
                }
              >
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <span className="text-xs text-slate-300 font-medium ml-1">
                Tahun:
              </span>
              <select
                value={logic.periode.split("-")[0]}
                onChange={(e) =>
                  logic.setPeriode(
                    `${e.target.value}-${logic.periode.split("-")[1]}`,
                  )
                }
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Table Area */}
      <div className="flex-1 overflow-auto bg-white p-6">
        <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm h-full flex flex-col">
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    No. Invoice
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 w-1/4">
                    Nama Pelanggan
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center">
                    Terms
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Item (Kode - Nama)
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">
                    Qty
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">
                    Harga Satuan
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">
                    Harga Jual
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-center w-20">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logic.loading ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-12 text-slate-400 bg-slate-50"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        Memuat data histori...
                      </div>
                    </td>
                  </tr>
                ) : logic.dataList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-12 text-slate-400 bg-slate-50"
                    >
                      Tidak ada histori harga jual yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  logic.dataList.map(
                    (item: HistoryHargaJualData, idx: number) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => {
                          logic.setSelectedRecord(item);
                          logic.setViewMode("form");
                        }}
                      >
                        <td className="px-4 py-2.5 text-slate-600">
                          {item.tgl}
                        </td>
                        <td className="px-4 py-2.5 text-blue-600 font-medium">
                          {item.no_invoice}
                        </td>
                        <td className="px-4 py-2.5 text-slate-800 font-medium truncate max-w-[200px]">
                          {item.nama_pelanggan}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 text-center">
                          {item.terms}
                        </td>
                        <td className="px-4 py-2.5 text-slate-700">
                          <span className="font-medium text-slate-900">
                            {item.kode_item}
                          </span>{" "}
                          - {item.nama_item}
                        </td>
                        <td className="px-4 py-2.5 text-slate-700 text-right font-medium">
                          {item.qty}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 text-right">
                          {item.harga_satuan.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-2.5 text-emerald-600 font-semibold text-right">
                          {item.curr}{" "}
                          {item.harga_jual.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              logic.setSelectedRecord(item);
                              logic.setViewMode("form");
                            }}
                            className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors inline-flex items-center justify-center"
                            title="Buka Form Detail"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
            <span>
              Menampilkan {logic.dataList.length} record
              {logic.periode ? ` untuk periode ${logic.periode}` : ""}
            </span>
            <span>Klik baris untuk melihat detail dalam Form View</span>
          </div>
        </div>
      </div>

      {/* Modern Item Search Modal */}
      {logic.showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Search size={18} className="text-blue-400" />
                Pencarian Master Barang
              </h3>
              <button
                onClick={() => logic.setShowItemModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Cari Kode Barang
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Contoh: B-011"
                    value={searchModalKode}
                    onChange={(e) => setSearchModalKode(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Cari Nama Barang
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Contoh: Baju Blazer"
                    value={searchModalNama}
                    onChange={(e) => setSearchModalNama(e.target.value)}
                  />
                </div>
              </div>

              <div className="h-64 overflow-y-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-medium text-slate-600 border-b">
                        Kode
                      </th>
                      <th className="px-4 py-2 font-medium text-slate-600 border-b">
                        Nama Barang
                      </th>
                      <th className="px-4 py-2 font-medium text-slate-600 border-b text-center">
                        Satuan
                      </th>
                      <th className="px-4 py-2 font-medium text-slate-600 border-b">
                        Group
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingItems ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-slate-400"
                        >
                          Memuat data barang...
                        </td>
                      </tr>
                    ) : filteredItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-8 text-slate-400"
                        >
                          Barang tidak ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((it) => (
                        <tr
                          key={it.id}
                          onClick={() => selectItem(it)}
                          className="hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-2 font-medium text-slate-800">
                            {it.kode}
                          </td>
                          <td className="px-4 py-2 text-slate-600">
                            {it.nama}
                          </td>
                          <td className="px-4 py-2 text-slate-600 text-center">
                            {it.satuan}
                          </td>
                          <td className="px-4 py-2 text-slate-600">
                            {it.group_barang_nama || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
              <button
                className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-300 transition-colors"
                onClick={() => logic.setShowItemModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
