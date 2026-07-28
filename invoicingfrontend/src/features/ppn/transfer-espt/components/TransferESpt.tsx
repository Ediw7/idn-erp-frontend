import React, { useState } from "react";
import { PageLayout } from "../../../../components/layouts/PageLayout";
import { FileText, Users, Receipt, X, Download } from "lucide-react";
import { exportLampiran, exportWajibPajak, exportPPh22 } from "../api";

export const TransferESpt: React.FC = () => {
  const [activeModal, setActiveModal] = useState<
    "lampiran" | "wp" | "pph22" | null
  >(null);

  // Form states
  const [tahun, setTahun] = useState("2026");
  const [masa, setMasa] = useState("07");
  const [pembetulan, setPembetulan] = useState("0");
  const [jenisLampiran, setJenisLampiran] = useState("1111A");

  const [pphPrefiks, setPphPrefiks] = useState("");
  const [pphSufiks, setPphSufiks] = useState("");
  const [pphDigit, setPphDigit] = useState("3");
  const [pphIndustri, setPphIndustri] = useState("");
  const [pphUraian, setPphUraian] = useState("");

  const handleExportLampiran = () => {
    exportLampiran(tahun, masa, pembetulan, jenisLampiran);
    setActiveModal(null);
  };

  const handleExportWP = () => {
    exportWajibPajak();
    setActiveModal(null);
  };

  const handleExportPPh22 = () => {
    exportPPh22(tahun, masa, pembetulan);
    setActiveModal(null);
  };

  const inputClass =
    "w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md text-sm transition-colors";
  const labelClass = "text-sm font-semibold text-slate-700 mb-1 block";

  return (
    <PageLayout
      title="Transfer Data ke e-SPT"
      contentClassName="flex-1 p-8 overflow-y-auto bg-slate-50"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Pilih Modul Ekspor CSV
          </h2>
          <p className="text-slate-500 text-sm">
            Pilih jenis data yang ingin Anda ekspor ke dalam format CSV untuk
            diimpor ke aplikasi e-SPT DJP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Lampiran SPT */}
          <div
            onClick={() => setActiveModal("lampiran")}
            className="group bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <FileText size={32} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Ekspor Data Lampiran SPT
            </h3>
            <p className="text-slate-500 text-sm">
              Ekspor daftar Faktur Pajak Masukan dan Keluaran (1111A / 1111B)
              sesuai masa pajak.
            </p>
          </div>

          {/* Card 2: Wajib Pajak */}
          <div
            onClick={() => setActiveModal("wp")}
            className="group bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:teal-400 transition-all cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Ekspor Data Wajib Pajak
            </h3>
            <p className="text-slate-500 text-sm">
              Ekspor master data pelanggan dan supplier (Lawan Transaksi) ke
              format e-SPT.
            </p>
          </div>

          {/* Card 3: PPh 22 */}
          <div
            onClick={() => setActiveModal("pph22")}
            className="group bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:indigo-400 transition-all cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Receipt size={32} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">
              Ekspor Data PPh 22
            </h3>
            <p className="text-slate-500 text-sm">
              Ekspor data bukti pemungutan PPh Pasal 22 dengan sistem penomoran
              spesifik.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Modals */}

      {/* Modal: Lampiran SPT */}
      {activeModal === "lampiran" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <FileText size={18} />
                </div>
                <h3 className="font-bold text-slate-800">
                  Transfer Lampiran SPT
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Tahun</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Masa</label>
                  <select
                    className={inputClass}
                    value={masa}
                    onChange={(e) => setMasa(e.target.value)}
                  >
                    <option value="01">Januari (01)</option>
                    <option value="02">Februari (02)</option>
                    <option value="03">Maret (03)</option>
                    <option value="04">April (04)</option>
                    <option value="05">Mei (05)</option>
                    <option value="06">Juni (06)</option>
                    <option value="07">Juli (07)</option>
                    <option value="08">Agustus (08)</option>
                    <option value="09">September (09)</option>
                    <option value="10">Oktober (10)</option>
                    <option value="11">November (11)</option>
                    <option value="12">Desember (12)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className={labelClass}>Pembetulan Ke</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={pembetulan}
                    onChange={(e) => setPembetulan(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Jenis Lampiran</label>
                  <select
                    className={inputClass}
                    value={jenisLampiran}
                    onChange={(e) => setJenisLampiran(e.target.value)}
                  >
                    <option value="1111A">1111A (Keluaran)</option>
                    <option value="1111B">1111B (Masukan)</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 text-blue-800 text-xs p-4 rounded-lg border border-blue-100 leading-relaxed">
                Proses ini akan mengekspor data lampiran SPT Masa PPN ke dalam
                suatu file CSV. File akan terunduh secara otomatis melalui
                browser Anda.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleExportLampiran}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Ekspor CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Wajib Pajak */}
      {activeModal === "wp" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 text-teal-600 p-2 rounded-lg">
                  <Users size={18} />
                </div>
                <h3 className="font-bold text-slate-800">
                  Transfer Data Wajib Pajak
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-teal-50 text-teal-800 text-sm p-4 rounded-lg border border-teal-100 leading-relaxed">
                <p className="font-semibold mb-1">Siap Diekspor!</p>
                Proses ini akan mengekspor seluruh master data Wajib Pajak
                (Lawan Transaksi) ke dalam satu file CSV standar e-SPT. File
                akan terunduh secara otomatis.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleExportWP}
                className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Ekspor CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: PPh 22 */}
      {activeModal === "pph22" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <Receipt size={18} />
                </div>
                <h3 className="font-bold text-slate-800">
                  Transfer Bukti Pungut PPh 22
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className={labelClass}>Tahun</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Masa</label>
                  <select
                    className={inputClass}
                    value={masa}
                    onChange={(e) => setMasa(e.target.value)}
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
                </div>
                <div>
                  <label className={labelClass}>Pembetulan Ke</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={pembetulan}
                    onChange={(e) => setPembetulan(e.target.value)}
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700">
                    Sistem Penomoran Bukti Pungut
                  </h4>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Prefiks</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: PPH"
                      value={pphPrefiks}
                      onChange={(e) => setPphPrefiks(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Sufiks</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Contoh: 26"
                      value={pphSufiks}
                      onChange={(e) => setPphSufiks(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Jumlah Digit</label>
                    <select
                      className={inputClass}
                      value={pphDigit}
                      onChange={(e) => setPphDigit(e.target.value)}
                    >
                      <option value="3">3 Digit</option>
                      <option value="4">4 Digit</option>
                      <option value="5">5 Digit</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Jenis Industri</label>
                    <select
                      className={inputClass}
                      value={pphIndustri}
                      onChange={(e) => setPphIndustri(e.target.value)}
                    >
                      <option value="">- Pilih Industri -</option>
                      <option value="Baja">Industri Baja</option>
                      <option value="Kertas">Industri Kertas</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Uraian Singkat</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Keterangan tambahan..."
                      value={pphUraian}
                      onChange={(e) => setPphUraian(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 text-indigo-800 text-xs p-4 rounded-lg border border-indigo-100 leading-relaxed">
                Proses ini akan mengekspor data Bukti Pemungutan PPh 22 ke dalam
                suatu file CSV. File akan terunduh secara otomatis melalui
                browser Anda.
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleExportPPh22}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Download size={16} /> Ekspor CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};
