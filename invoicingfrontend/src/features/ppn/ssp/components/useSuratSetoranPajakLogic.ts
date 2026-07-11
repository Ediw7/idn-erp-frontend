import { useState, useEffect } from "react";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import { sspApi, SuratSetoranPajakData } from "../api";
import { setupApi, PerusahaanData } from "../../../setup/api";
import toast from "react-hot-toast";

export const useSuratSetoranPajakLogic = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<SuratSetoranPajakData[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [perusahaan, setPerusahaan] = useState<PerusahaanData | null>(null);

  const emptyForm: SuratSetoranPajakData = {
    kpp: "",
    nama_wp: "",
    npwp: "",
    alamat: "",
    kode_pos: "",
    tahun: new Date().getFullYear().toString(),
    bulan: (new Date().getMonth() + 1).toString().padStart(2, "0"),
    kode_jenis_pajak: "411211",
    kode_jenis_pajak_desc: "Pajak Pertambahan Nilai Dalam Negeri",
    kode_jenis_setoran: "100",
    kode_jenis_setoran_desc: "Setoran Masa",
    uraian_pembayaran: "",
    no_ketetapan: "",
    ntpp: "",
    jumlah: 0,
    tanggal: new Date().toISOString().split("T")[0],
    tanda_tangan: "",
    keterangan: "",
    ssp_pemungut: false,
  };

  const [form, setForm] = useState<SuratSetoranPajakData>(emptyForm);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingList(true);
    try {
      const [listRes, pRes] = await Promise.all([
        sspApi.getAll().catch(() => []),
        setupApi.getPerusahaan().catch(() => []),
      ]);
      setDataList(listRes);
      if (pRes.length > 0) {
        setPerusahaan(pRes[0]);
      }
    } catch (error) {
      console.error("Failed to fetch SSP data", error);
      toast.error("Gagal memuat data SSP");
    } finally {
      setLoadingList(false);
    }
  };

  const handleNewClick = () => {
    const f = { ...emptyForm };
    if (perusahaan) {
      f.nama_wp = perusahaan.nama || "";
      f.npwp = perusahaan.npwp || "";
      f.alamat = perusahaan.alamat || "";
      f.kode_pos = perusahaan.kode_pos || "";
    }
    setForm(f);
    setIsNew(true);
    setViewMode("form");
  };

  const handleEditClick = (item: SuratSetoranPajakData) => {
    setForm(item);
    setIsNew(false);
    setViewMode("form");
  };

  const handleSave = async () => {
    if (!form.kpp) {
      toast.error("KPP wajib diisi");
      return;
    }
    try {
      setIsSaving(true);
      const res = await sspApi.save(form);
      toast.success("Surat Setoran Pajak berhasil disimpan");
      setIsNew(false);

      const newData = { ...form, id: form.id || res.id };
      if (isNew) {
        setDataList([newData, ...dataList]);
      } else {
        setDataList(dataList.map((x) => (x.id === form.id ? newData : x)));
      }
    } catch (error) {
      toast.error("Gagal menyimpan SSP");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteById = async (id: number) => {
    const isConfirmed = await confirm(
      "Apakah Anda yakin ingin menghapus SSP ini?",
    );
    if (!isConfirmed) return;
    try {
      await sspApi.delete(id);
      toast.success("SSP berhasil dihapus");
      setDataList(dataList.filter((x) => x.id !== id));
      if (form.id === id) {
        setViewMode("list");
      }
    } catch (error) {
      toast.error("Gagal menghapus SSP");
    }
  };

  return {
    dataList,
    loadingList,
    form,
    setForm,
    viewMode,
    setViewMode,
    isNew,
    isSaving,
    handleNewClick,
    handleEditClick,
    handleSave,
    handleDeleteById,
  };
};
